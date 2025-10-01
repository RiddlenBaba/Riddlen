const hre = require("hardhat");

async function main() {
  // Get the deployed airdrop contract address
  const airdropAddress = "0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040"; // Replace with your deployed address

  const RiddlenAirdrop = await hre.ethers.getContractFactory("RiddlenAirdrop");
  const airdrop = RiddlenAirdrop.attach(airdropAddress);

  // Get all social proof submissions from events
  console.log("Fetching social proof submissions...");

  const filter = airdrop.filters.SocialProofSubmitted();
  const events = await airdrop.queryFilter(filter);

  console.log(`Found ${events.length} social proof submissions\n`);

  // Get already verified users
  const verifiedUsers = new Set();
  const verifyFilter = airdrop.filters.SocialProofVerified();
  const verifyEvents = await airdrop.queryFilter(verifyFilter);

  for (const event of verifyEvents) {
    if (event.args.twitterVerified && event.args.telegramVerified && event.args.shareVerified) {
      verifiedUsers.add(event.args.user);
    }
  }

  console.log(`Already verified: ${verifiedUsers.size} users\n`);

  // Filter unverified submissions
  const unverifiedUsers = events
    .map(event => event.args.user)
    .filter(user => !verifiedUsers.has(user));

  const uniqueUnverified = [...new Set(unverifiedUsers)];

  console.log(`Unverified users: ${uniqueUnverified.length}\n`);

  if (uniqueUnverified.length === 0) {
    console.log("No users to verify!");
    return;
  }

  // Display users and their social proof
  for (let i = 0; i < uniqueUnverified.length; i++) {
    const user = uniqueUnverified[i];
    const socialProof = await airdrop.socialProofs(user);

    console.log(`${i + 1}. ${user}`);
    console.log(`   Twitter: @${socialProof.twitterHandle}`);
    console.log(`   Telegram: @${socialProof.telegramHandle}`);
  }

  console.log("\n⚠️  Review the submissions above. This will verify ALL of them.");
  console.log("Press Ctrl+C to cancel, or wait 5 seconds to continue...\n");

  await new Promise(resolve => setTimeout(resolve, 5000));

  // Batch verify all users
  console.log("Starting batch verification...\n");

  for (let i = 0; i < uniqueUnverified.length; i++) {
    const user = uniqueUnverified[i];

    try {
      console.log(`Verifying ${i + 1}/${uniqueUnverified.length}: ${user}`);

      const tx = await airdrop.verifySocialProof(
        user,
        true,  // Twitter verified
        true,  // Telegram verified
        true   // Share verified
      );

      await tx.wait();
      console.log(`✅ Verified (tx: ${tx.hash})\n`);

    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    }
  }

  console.log("Batch verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
