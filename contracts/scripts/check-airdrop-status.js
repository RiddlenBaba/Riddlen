const hre = require("hardhat");

async function main() {
  const airdropAddress = "0x330275259AfCeC8822A861ecbbdfD026dB1B0A13";

  console.log("\n🔍 Checking Airdrop Contract Status...\n");
  console.log("Contract Address:", airdropAddress);
  console.log("Network:", hre.network.name);

  const Airdrop = await hre.ethers.getContractAt("RiddlenAirdrop", airdropAddress);

  // Check phase status
  const phase1Active = await Airdrop.phase1Active();
  const phase2Active = await Airdrop.phase2Active();

  console.log("\n📊 Phase Status:");
  console.log("Phase 1 Active:", phase1Active);
  console.log("Phase 2 Active:", phase2Active);

  // Get stats
  const stats = await Airdrop.getAirdropStats();
  const maxParticipants = await Airdrop.PHASE1_MAX_PARTICIPANTS();
  const perWallet = await Airdrop.PHASE1_PER_WALLET();

  console.log("\n📈 Airdrop Stats:");
  console.log("Phase 1 Participants:", stats[0].toString(), "/", maxParticipants.toString());
  console.log("Phase 1 Remaining:", stats[1].toString());
  console.log("Contract Balance:", hre.ethers.formatEther(stats[2]), "RDLN");
  console.log("Per Wallet Amount:", hre.ethers.formatEther(perWallet), "RDLN");

  // Check constants
  const ronMinThreshold = await Airdrop.RON_MINIMUM_THRESHOLD();
  console.log("\n💎 Phase 2 Requirements:");
  console.log("RON Minimum:", hre.ethers.formatEther(ronMinThreshold), "RON");

  // Get deployer/signer for testing
  const [signer] = await hre.ethers.getSigners();
  console.log("\n👤 Current Signer:", signer.address);

  // Check if signer has admin role
  const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const hasAdminRole = await Airdrop.hasRole(DEFAULT_ADMIN_ROLE, signer.address);
  console.log("Has Admin Role:", hasAdminRole);

  // Check signer's status
  const phase1Status = await Airdrop.getPhase1Status(signer.address);
  console.log("\n🎯 Your Airdrop Status:");
  console.log("Phase 1 Eligible:", phase1Status[0]);
  console.log("Phase 1 Claimed:", phase1Status[1]);
  console.log("Social Verified:", phase1Status[2]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });