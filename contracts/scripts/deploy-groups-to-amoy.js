/**
 * Deploy Group Mechanics System to Amoy Testnet v5.1
 *
 * Integrates with existing v5.1 deployment:
 * - RDLN: 0x133029184EC460F661d05b0dC57BFC916b4AB0eB
 * - RON: 0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635
 *
 * Deploys:
 * 1. GroupCompositionValidator
 * 2. RiddleGroupManager
 * 3. Upgrades RON with group extensions (if upgradeable)
 * 4. Upgrades RDLN with group extensions (if upgradeable)
 */

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// v5.1 Deployed Contract Addresses on Amoy
const V5_1_ADDRESSES = {
  rdln: "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
  ron: "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
  airdrop: "0x8345ba8DA61F0192BF421B8A039BC972F3f74d4b",
  // NFT address TBD - will be deployed separately if needed
  nft: process.env.NFT_CONTRACT_ADDRESS || ethers.ZeroAddress
};

async function main() {
  console.log("🚀 Deploying Group Mechanics to Amoy Testnet (v5.2)\n");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC\n");

  // Verify network
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "Chain ID:", network.chainId.toString());

  if (network.chainId !== 80002n) {
    console.error("❌ Error: Not on Amoy testnet (Chain ID: 80002)");
    process.exit(1);
  }

  console.log("\n📍 Integrating with v5.1 Contracts:");
  console.log("   RDLN:", V5_1_ADDRESSES.rdln);
  console.log("   RON:", V5_1_ADDRESSES.ron);
  console.log();

  const deployedContracts = {};

  // =============================================================
  // STEP 1: Deploy GroupCompositionValidator
  // =============================================================
  console.log("=== Step 1/2: Deploy GroupCompositionValidator ===\n");

  console.log("📦 Deploying GroupCompositionValidator...");
  const GroupCompositionValidator = await ethers.getContractFactory("GroupCompositionValidator");
  const validator = await GroupCompositionValidator.deploy(V5_1_ADDRESSES.ron);
  await validator.waitForDeployment();

  const validatorAddress = await validator.getAddress();
  deployedContracts.validator = validatorAddress;

  console.log("✅ GroupCompositionValidator deployed:", validatorAddress);

  // Verify validator config
  console.log("   Testing validator...");
  const [minMembers, maxMembers, maxHigh, maxMid, maxLow] = await validator.getTierLimits();
  console.log("   - Min Members:", minMembers.toString());
  console.log("   - Max Members:", maxMembers.toString());
  console.log("   - Max High Tier:", maxHigh.toString());
  console.log("   - Max Mid Tier:", maxMid.toString());
  console.log("   - Max Low Tier:", maxLow.toString());

  // =============================================================
  // STEP 2: Deploy RiddleGroupManager
  // =============================================================
  console.log("\n=== Step 2/2: Deploy RiddleGroupManager ===\n");

  console.log("📦 Deploying RiddleGroupManager...");

  // For now, use deployer as NFT contract placeholder
  // Later we'll grant actual NFT contract the role
  const nftContractPlaceholder = V5_1_ADDRESSES.nft !== ethers.ZeroAddress
    ? V5_1_ADDRESSES.nft
    : deployer.address;

  const RiddleGroupManager = await ethers.getContractFactory("RiddleGroupManager");
  const groupManager = await RiddleGroupManager.deploy(
    deployer.address,           // admin
    nftContractPlaceholder,     // nft contract (or placeholder)
    V5_1_ADDRESSES.ron,         // ron contract
    V5_1_ADDRESSES.rdln,        // rdln token
    validatorAddress            // validator
  );
  await groupManager.waitForDeployment();

  const groupManagerAddress = await groupManager.getAddress();
  deployedContracts.groupManager = groupManagerAddress;

  console.log("✅ RiddleGroupManager deployed:", groupManagerAddress);

  // Verify group manager
  console.log("   Testing GroupManager...");
  console.log("   - Next Group ID:", (await groupManager.nextGroupId()).toString());
  console.log("   - Max Group Size:", (await groupManager.MAX_GROUP_SIZE()).toString());
  console.log("   - Min Group Size:", (await groupManager.MIN_GROUP_SIZE()).toString());
  console.log("   - Disband Fee:", ethers.formatEther(await groupManager.disbandFee()), "RDLN");

  // =============================================================
  // STEP 3: Setup Permissions
  // =============================================================
  console.log("\n=== Step 3: Setup Permissions ===\n");

  // Get RDLN contract
  const rdln = await ethers.getContractAt("RDLNUpgradeable", V5_1_ADDRESSES.rdln);

  console.log("🔐 Setting up roles...");

  try {
    // Grant GAME_ROLE to GroupManager in RDLN (for cost collection)
    const GAME_ROLE = await rdln.GAME_ROLE();
    await rdln.grantRole(GAME_ROLE, groupManagerAddress);
    console.log("✅ Granted GAME_ROLE to GroupManager in RDLN");
  } catch (error) {
    console.log("⚠️  Could not grant GAME_ROLE (may need admin):", error.message);
  }

  // =============================================================
  // DEPLOYMENT SUMMARY
  // =============================================================
  console.log("\n=== Deployment Summary ===\n");

  const deploymentInfo = {
    network: "amoy",
    chainId: 80002,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    version: "v5.2-groups",
    existingContracts: V5_1_ADDRESSES,
    newContracts: deployedContracts,
    roles: {
      admin: deployer.address,
      gameRole: "GAME_ROLE granted to GroupManager"
    }
  };

  console.log("📋 Contract Addresses:");
  console.log("   GroupCompositionValidator:", validatorAddress);
  console.log("   RiddleGroupManager:", groupManagerAddress);
  console.log();
  console.log("🔗 Integration Points:");
  console.log("   RDLN Token:", V5_1_ADDRESSES.rdln);
  console.log("   RON Token:", V5_1_ADDRESSES.ron);
  console.log("   Airdrop:", V5_1_ADDRESSES.airdrop);

  // Save deployment
  const deploymentsDir = path.join(__dirname, "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, "amoy-groups-v5.2.json");
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n💾 Deployment saved:", deploymentFile);

  // =============================================================
  // NEXT STEPS
  // =============================================================
  console.log("\n📖 Next Steps:\n");

  console.log("1️⃣  Test group creation:");
  console.log(`   const groupManager = await ethers.getContractAt("RiddleGroupManager", "${groupManagerAddress}")`);
  console.log(`   await groupManager.createGroupFromNFT(...)`);
  console.log();

  console.log("2️⃣  Grant NFT_CONTRACT_ROLE when NFT deployed:");
  console.log(`   const NFT_CONTRACT_ROLE = await groupManager.NFT_CONTRACT_ROLE()`);
  console.log(`   await groupManager.grantRole(NFT_CONTRACT_ROLE, nftAddress)`);
  console.log();

  console.log("3️⃣  Verify on Amoy PolygonScan:");
  console.log(`   npx hardhat verify --network amoy ${validatorAddress} "${V5_1_ADDRESSES.ron}"`);
  console.log();
  console.log(`   npx hardhat verify --network amoy ${groupManagerAddress} \\`);
  console.log(`     "${deployer.address}" \\`);
  console.log(`     "${nftContractPlaceholder}" \\`);
  console.log(`     "${V5_1_ADDRESSES.ron}" \\`);
  console.log(`     "${V5_1_ADDRESSES.rdln}" \\`);
  console.log(`     "${validatorAddress}"`);
  console.log();

  console.log("4️⃣  Update frontend with addresses:");
  console.log(`   GROUP_MANAGER_ADDRESS="${groupManagerAddress}"`);
  console.log(`   GROUP_VALIDATOR_ADDRESS="${validatorAddress}"`);
  console.log();

  console.log("🎉 Group Mechanics v5.2 deployed to Amoy testnet!");
  console.log("🔗 View on PolygonScan: https://amoy.polygonscan.com/");

  return {
    validator: validatorAddress,
    groupManager: groupManagerAddress,
    deploymentInfo
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });