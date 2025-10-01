import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateCode(prompt) {
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20250116",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });
  
  return msg.content[0].text;
}

// Usage example
if (process.argv[2]) {
  const result = await generateCode(process.argv[2]);
  console.log(result);
}
