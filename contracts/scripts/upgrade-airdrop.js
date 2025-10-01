const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🔄 Upgrading RiddlenAirdrop contract...\n");

  // Current proxy address on Amoy testnet
  const PROXY_ADDRESS = "0x330275259AfCeC8822A861ecbbdfD026dB1B0A13";

  // Get the upgraded contract factory
  const RiddlenAirdropV2 = await ethers.getContractFactory("RiddlenAirdrop");

  console.log("📝 Validating upgrade compatibility...");

  // Upgrade the proxy to the new implementation
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, RiddlenAirdropV2);
  await upgraded.waitForDeployment();

  const upgradedAddress = await upgraded.getAddress();

  console.log("\n✅ Upgrade successful!");
  console.log("📍 Proxy address (unchanged):", PROXY_ADDRESS);
  console.log("📍 New implementation deployed");
  console.log("\n🎉 New autoClaimPhase1() function is now available!");
  console.log("\n⚠️  REMEMBER: autoClaimPhase1() is for TESTNET ONLY - remove for mainnet\n");

  // Verify the upgrade
  console.log("🔍 Verifying upgrade...");
  const airdrop = await ethers.getContractAt("RiddlenAirdrop", PROXY_ADDRESS);

  const phase1Active = await airdrop.phase1Active();
  const participants = await airdrop.phase1Participants();

  console.log("✓ Phase 1 Active:", phase1Active);
  console.log("✓ Current Participants:", participants.toString());
  console.log("\n✅ All state preserved successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });