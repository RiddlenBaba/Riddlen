const hre = require("hardhat");

async function main() {
  const airdropAddress = "0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040";

  const RiddlenAirdrop = await hre.ethers.getContractFactory("RiddlenAirdrop");
  const airdrop = RiddlenAirdrop.attach(airdropAddress);

  // Get signer address
  const [signer] = await hre.ethers.getSigners();
  console.log("Checking address:", signer.address);

  // Check social proof
  const socialProof = await airdrop.socialProofs(signer.address);

  console.log("\nSocial Proof Status:");
  console.log("Twitter handle:", socialProof.twitterHandle);
  console.log("Telegram handle:", socialProof.telegramHandle);
  console.log("Twitter verified:", socialProof.twitterVerified);
  console.log("Telegram verified:", socialProof.telegramVerified);
  console.log("Share verified:", socialProof.shareVerified);
  console.log("Verification timestamp:", socialProof.verificationTimestamp.toString());

  // Check overall verification status
  const isVerified = await airdrop.socialProofVerified(signer.address);
  console.log("\nOverall verified:", isVerified);

  // Check Phase 1 status
  const phase1Status = await airdrop.getPhase1Status(signer.address);
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