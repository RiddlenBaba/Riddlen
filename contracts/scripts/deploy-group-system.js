const { ethers } = require("hardhat");

/**
 * Deploy complete group mechanics system
 *
 * Deployment Order:
 * 1. GroupCompositionValidator (no dependencies)
 * 2. RiddleGroupManager (needs addresses)
 * 3. Upgrade RON contract for group extensions
 * 4. Upgrade RDLN contract for group extensions
 * 5. Upgrade RiddleNFT contract for group support
 *
 * Prerequisites:
 * - RON contract must be deployed
 * - RDLN contract must be deployed
 * - RiddleNFT contract must be deployed
 */
async function main() {
  console.log("🚀 Deploying Group Mechanics System...\n");

  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Configuration
  const config = {
    admin: process.env.ADMIN_WALLET || deployer.address,
    // Existing contract addresses (must be set)
    nftContract: process.env.NFT_CONTRACT_ADDRESS || ethers.ZeroAddress,
    ronContract: process.env.RON_CONTRACT_ADDRESS || ethers.ZeroAddress,
    rdlnToken: process.env.RDLN_TOKEN_ADDRESS || ethers.ZeroAddress,
  };

  // Validate existing contracts
  if (config.nftContract === ethers.ZeroAddress) {
    throw new Error("❌ NFT_CONTRACT_ADDRESS must be set in environment");
  }
  if (config.ronContract === ethers.ZeroAddress) {
    throw new Error("❌ RON_CONTRACT_ADDRESS must be set in environment");
  }
  if (config.rdlnToken === ethers.ZeroAddress) {
    throw new Error("❌ RDLN_TOKEN_ADDRESS must be set in environment");
  }

  console.log("📋 Configuration:");
  console.log("- Admin:", config.admin);
  console.log("- NFT Contract:", config.nftContract);
  console.log("- RON Contract:", config.ronContract);
  console.log("- RDLN Token:", config.rdlnToken);
  console.log();

  // ============================================================
  // STEP 1: Deploy GroupCompositionValidator
  // ============================================================
  console.log("📦 Step 1/2: Deploying GroupCompositionValidator...");

  const GroupCompositionValidator = await ethers.getContractFactory("GroupCompositionValidator");
  const validator = await GroupCompositionValidator.deploy(
    config.ronContract
  );
  await validator.waitForDeployment();
  const validatorAddress = await validator.getAddress();

  console.log("✅ GroupCompositionValidator deployed to:", validatorAddress);

  // Verify validator functionality
  console.log("   Testing validator configuration...");
  const [minMembers, maxMembers, maxHighTier, maxMidTier, maxLowTier] =
    await validator.getTierLimits();
  console.log("   - Min Members:", minMembers.toString());
  console.log("   - Max Members:", maxMembers.toString());
  console.log("   - Max High Tier:", maxHighTier.toString());
  console.log("   - Max Mid Tier:", maxMidTier.toString());
  console.log("   - Max Low Tier:", maxLowTier.toString());
  console.log();

  // ============================================================
  // STEP 2: Deploy RiddleGroupManager
  // ============================================================
  console.log("📦 Step 2/2: Deploying RiddleGroupManager...");

  const RiddleGroupManager = await ethers.getContractFactory("RiddleGroupManager");
  const groupManager = await RiddleGroupManager.deploy(
    config.admin,
    config.nftContract,
    config.ronContract,
    config.rdlnToken,
    validatorAddress
  );
  await groupManager.waitForDeployment();
  const groupManagerAddress = await groupManager.getAddress();

  console.log("✅ RiddleGroupManager deployed to:", groupManagerAddress);

  // Verify group manager configuration
  console.log("   Verifying group manager configuration...");
  console.log("   - Next Group ID:", await groupManager.nextGroupId());
  console.log("   - Max Group Size:", await groupManager.MAX_GROUP_SIZE());
  console.log("   - Min Group Size:", await groupManager.MIN_GROUP_SIZE());
  console.log("   - Disband Fee:", ethers.formatEther(await groupManager.disbandFee()), "RDLN");
  console.log();

  // ============================================================
  // DEPLOYMENT SUMMARY
  // ============================================================

  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    contracts: {
      groupCompositionValidator: validatorAddress,
      riddleGroupManager: groupManagerAddress,
    },
    existingContracts: {
      nftContract: config.nftContract,
      ronContract: config.ronContract,
      rdlnToken: config.rdlnToken,
    },
    configuration: {
      admin: config.admin,
      maxGroupSize: 11,
      minGroupSize: 3,
      disbandFee: ethers.formatEther(await groupManager.disbandFee()),
    }
  };

  console.log("💾 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log();

  // ============================================================
  // POST-DEPLOYMENT INSTRUCTIONS
  // ============================================================

  console.log("📋 Post-Deployment Steps:\n");

  console.log("1️⃣  Grant NFT_CONTRACT_ROLE to NFT contract:");
  const NFT_CONTRACT_ROLE = await groupManager.NFT_CONTRACT_ROLE();
  console.log(`   await groupManager.grantRole("${NFT_CONTRACT_ROLE}", "${config.nftContract}")`);
  console.log();

  console.log("2️⃣  Grant GAME_ROLE to GroupManager in RDLN token:");
  console.log(`   await rdlnToken.grantRole(GAME_ROLE, "${groupManagerAddress}")`);
  console.log();

  console.log("3️⃣  Update RiddleNFT contract to reference GroupManager:");
  console.log(`   await riddleNFT.setGroupManager("${groupManagerAddress}")`);
  console.log();

  console.log("4️⃣  Update RON contract to reference GroupManager (if needed):");
  console.log(`   await ron.setGroupManager("${groupManagerAddress}")`);
  console.log();

  console.log("5️⃣  Test group creation:");
  console.log(`   // Mint NFT first`);
  console.log(`   await riddleNFT.mintNFT(riddleId)`);
  console.log(`   // Convert to group`);
  console.log(`   await riddleNFT.convertToGroupNFT(tokenId)`);
  console.log();

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("🔍 To verify contracts:\n");
    console.log(`npx hardhat verify --network ${hre.network.name} ${validatorAddress} "${config.ronContract}"`);
    console.log();
    console.log(`npx hardhat verify --network ${hre.network.name} ${groupManagerAddress} \\`);
    console.log(`  "${config.admin}" \\`);
    console.log(`  "${config.nftContract}" \\`);
    console.log(`  "${config.ronContract}" \\`);
    console.log(`  "${config.rdlnToken}" \\`);
    console.log(`  "${validatorAddress}"`);
    console.log();
  }

  // Warning about upgrades
  console.log("⚠️  IMPORTANT: Upgrades Required\n");
  console.log("The following existing contracts need upgrades to support groups:");
  console.log("- RiddleNFTv3: Add convertToGroupNFT() and makeGroupAttempt()");
  console.log("- RONAdvanced: Add getEffectiveRON() and group dilution");
  console.log("- RDLNUpgradeable: Add collectGroupCosts() and distributeGroupRewards()");
  console.log();
  console.log("Use the upgrade scripts in scripts/upgrades/ directory");
  console.log();

  return {
    validator,
    groupManager,
    validatorAddress,
    groupManagerAddress,
    deploymentInfo
  };
}

// Execute deployment if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main;