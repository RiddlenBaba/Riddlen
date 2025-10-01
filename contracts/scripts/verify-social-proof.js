const hre = require("hardhat");

async function main() {
  // Get command line arguments
  const userAddress = process.argv[2];

  if (!userAddress) {
    console.log("Usage: npx hardhat run scripts/verify-social-proof.js <user_address>");
    process.exit(1);
  }

  console.log("Verifying social proof for:", userAddress);

  // Get the deployed airdrop contract address
  const airdropAddress = "YOUR_AIRDROP_CONTRACT_ADDRESS"; // Replace with your deployed address

  const RiddlenAirdrop = await hre.ethers.getContractFactory("RiddlenAirdrop");
  const airdrop = RiddlenAirdrop.attach(airdropAddress);

  // Check current social proof status
  const socialProof = await airdrop.socialProofs(userAddress);
  console.log("\nCurrent social proof:");
  console.log("Twitter handle:", socialProof.twitterHandle);
  console.log("Telegram handle:", socialProof.telegramHandle);
  console.log("Twitter verified:", socialProof.twitterVerified);
  console.log("Telegram verified:", socialProof.telegramVerified);
  console.log("Share verified:", socialProof.shareVerified);

  // Verify all requirements (set all to true)
  console.log("\nVerifying social proof...");
  const tx = await airdrop.verifySocialProof(
    userAddress,
    true,  // Twitter verified
    true,  // Telegram verified
    true   // Share verified
  );

  await tx.wait();
  console.log("✅ Social proof verified!");
  console.log("Transaction hash:", tx.hash);

  // Check verification status
  const isVerified = await airdrop.socialProofVerified(userAddress);
  console.log("\nVerification status:", isVerified);

  // Check Phase 1 eligibility
  const phase1Status = await airdrop.getPhase1Status(userAddress);
  console.log("\nPhase 1 Status:");
  console.log("Eligible:", phase1Status.eligible);
  console.log("Claimed:", phase1Status.claimed);
  console.log("Verified:", phase1Status.verified);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });