// Checks lib/riddleAnswers.js against the vectors shared with the contracts project
import { readFileSync } from 'node:fs';
import { normalizeAnswer, playerCommitment, solutionCommitment } from '../lib/riddleAnswers.js';

const fx = JSON.parse(readFileSync(new URL('../../contracts/test/fixtures/answer-vectors.json', import.meta.url)));
let failures = 0;
const failed = new Set();
for (const v of fx.vectors) {
  const got = {
    normalized: normalizeAnswer(v.input),
    playerCommitment: playerCommitment({ contract: fx.contract, player: fx.player, sessionId: v.sessionId, answers: [v.input], nonce: fx.nonce }),
    solutionCommitment: solutionCommitment({ contract: fx.contract, sessionId: v.sessionId, answers: [v.input], salt: fx.salt }),
  };
  for (const key of Object.keys(got)) {
    if (got[key] !== v[key]) {
      failures++;
      failed.add(v.input);
      console.error(`FAIL ${JSON.stringify(v.input)} ${key}: got ${got[key]}, want ${v[key]}`);
    }
  }
}
console.log(`${fx.vectors.length - failed.size}/${fx.vectors.length} vectors pass, ${failures} mismatches`);
process.exit(failures ? 1 : 0);
