const { ethers, upgrades } = require("hardhat");

/**
 * Upgrade existing contracts to support group mechanics
 *
 * This script upgrades:
 * 1. RONAdvanced - Add group dilution functions
 * 2. RDLNUpgradeable - Add group cost/reward functions
 * 3. RiddleNFTv3 - Add group conversion and attempt functions
 *
 * Prerequisites:
 * - Contracts must be deployed as upgradeable proxies
 * - Deployer must have UPGRADER_ROLE
 * - GroupManager must be deployed first
 */
async function main() {
  console.log("🔄 Upgrading Contracts for Group Support...\n");

  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Upgrading with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Configuration - these must be set
  const config = {
    ronProxyAddress: process.env.RON_PROXY_ADDRESS || ethers.ZeroAddress,
    rdlnProxyAddress: process.env.RDLN_PROXY_ADDRESS || ethers.ZeroAddress,
    // RiddleNFT is NOT upgradeable in current implementation
    // nftAddress: process.env.NFT_CONTRACT_ADDRESS || ethers.ZeroAddress,
    groupManagerAddress: process.env.GROUP_MANAGER_ADDRESS || ethers.ZeroAddress,
  };

  // Validate addresses
  if (config.ronProxyAddress === ethers.ZeroAddress) {
    throw new Error("❌ RON_PROXY_ADDRESS must be set");
  }
  if (config.rdlnProxyAddress === ethers.ZeroAddress) {
    throw new Error("❌ RDLN_PROXY_ADDRESS must be set");
  }
  if (config.groupManagerAddress === ethers.ZeroAddress) {
    throw new Error("❌ GROUP_MANAGER_ADDRESS must be set");
  }

  console.log("📋 Configuration:");
  console.log("- RON Proxy:", config.ronProxyAddress);
  console.log("- RDLN Proxy:", config.rdlnProxyAddress);
  console.log("- Group Manager:", config.groupManagerAddress);
  console.log();

  const upgrades = [];

  // ============================================================
  // UPGRADE 1: RONAdvanced
  // ============================================================
  console.log("🔧 Step 1/2: Upgrading RONAdvanced...");

  try {
    const RONAdvancedV2 = await ethers.getContractFactory("RONAdvanced");

    console.log("   Validating upgrade...");
    await upgrades.validateUpgrade(config.ronProxyAddress, RONAdvancedV2);

    console.log("   Upgrading proxy...");
    const ronUpgraded = await upgrades.upgradeProxy(
      config.ronProxyAddress,
      RONAdvancedV2
    );
    await ronUpgraded.waitForDeployment();

    console.log("✅ RONAdvanced upgraded successfully");
    console.log("   Proxy:", config.ronProxyAddress);
    console.log("   New Implementation:", await upgrades.erc1967.getImplementationAddress(config.ronProxyAddress));

    // Verify new functions exist
    console.log("   Verifying new functions...");
    const testAddress = deployer.address;
    const effectiveRON = await ronUpgraded.getEffectiveRON(testAddress);
    const maxGroups = await ronUpgraded.getMaxConcurrentGroups(testAddress);
    const canJoin = await ronUpgraded.canJoinGroup(testAddress);

    console.log("   - getEffectiveRON() exists:", effectiveRON !== undefined);
    console.log("   - getMaxConcurrentGroups() exists:", maxGroups !== undefined);
    console.log("   - canJoinGroup() exists:", canJoin !== undefined);

    upgrades.push({
      contract: "RONAdvanced",
      proxy: config.ronProxyAddress,
      newImplementation: await upgrades.erc1967.getImplementationAddress(config.ronProxyAddress),
      status: "success"
    });
  } catch (error) {
    console.error("❌ RONAdvanced upgrade failed:", error.message);
    upgrades.push({
      contract: "RONAdvanced",
      status: "failed",
      error: error.message
    });
  }
  console.log();

  // ============================================================
  // UPGRADE 2: RDLNUpgradeable
  // ============================================================
  console.log("🔧 Step 2/2: Upgrading RDLNUpgradeable...");

  try {
    const RDLNUpgradeableV2 = await ethers.getContractFactory("RDLNUpgradeable");

    console.log("   Validating upgrade...");
    await upgrades.validateUpgrade(config.rdlnProxyAddress, RDLNUpgradeableV2);

    console.log("   Upgrading proxy...");
    const rdlnUpgraded = await upgrades.upgradeProxy(
      config.rdlnProxyAddress,
      RDLNUpgradeableV2
    );
    await rdlnUpgraded.waitForDeployment();

    console.log("✅ RDLNUpgradeable upgraded successfully");
    console.log("   Proxy:", config.rdlnProxyAddress);
    console.log("   New Implementation:", await upgrades.erc1967.getImplementationAddress(config.rdlnProxyAddress));

    // Verify new functions exist
    console.log("   Verifying new functions...");
    // Note: These functions require arrays, just check they exist
    const rdlnContract = await ethers.getContractAt("RDLNUpgradeable", config.rdlnProxyAddress);
    const hasBatchTransfer = typeof rdlnContract.batchTransfer === 'function';
    const hasGroupCosts = typeof rdlnContract.collectGroupCosts === 'function';

    console.log("   - batchTransfer() exists:", hasBatchTransfer);
    console.log("   - collectGroupCosts() exists:", hasGroupCosts);

    upgrades.push({
      contract: "RDLNUpgradeable",
      proxy: config.rdlnProxyAddress,
      newImplementation: await upgrades.erc1967.getImplementationAddress(config.rdlnProxyAddress),
      status: "success"
    });
  } catch (error) {
    console.error("❌ RDLNUpgradeable upgrade failed:", error.message);
    upgrades.push({
      contract: "RDLNUpgradeable",
      status: "failed",
      error: error.message
    });
  }
  console.log();

  // ============================================================
  // UPGRADE SUMMARY
  // ============================================================

  const upgradeInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    upgradeTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    upgrades: upgrades,
    configuration: {
      groupManager: config.groupManagerAddress,
    }
  };

  console.log("💾 Upgrade Summary:");
  console.log(JSON.stringify(upgradeInfo, null, 2));
  console.log();

  // ============================================================
  // POST-UPGRADE INSTRUCTIONS
  // ============================================================

  console.log("📋 Post-Upgrade Steps:\n");

  console.log("1️⃣  Grant GAME_ROLE to GroupManager in RDLN:");
  console.log(`   const GAME_ROLE = await rdln.GAME_ROLE()`);
  console.log(`   await rdln.grantRole(GAME_ROLE, "${config.groupManagerAddress}")`);
  console.log();

  console.log("2️⃣  Update RiddleNFT to reference GroupManager:");
  console.log(`   // Note: RiddleNFTv3 is NOT upgradeable`);
  console.log(`   // Deploy new version with group support:`);
  console.log(`   await deploy("RiddleNFTv4", { args: [..., groupManager] })`);
  console.log();

  console.log("3️⃣  Test upgraded contracts:");
  console.log(`   // Test RON dilution`);
  console.log(`   const effectiveRON = await ron.getEffectiveRON(userAddress)`);
  console.log(`   const canJoin = await ron.canJoinGroup(userAddress)`);
  console.log();
  console.log(`   // Test RDLN group operations`);
  console.log(`   await rdln.collectGroupCosts([member1, member2], [100, 200], groupId, "TEST")`);
  console.log();

  console.log("⚠️  IMPORTANT NOTES:");
  console.log("- RiddleNFTv3 is NOT upgradeable (no UUPS proxy)");
  console.log("- You must deploy a NEW NFT contract with group support");
  console.log("- Existing NFTs cannot be converted unless contract supports it");
  console.log("- Consider migration strategy for existing users");
  console.log();

  // Check if upgrades were successful
  const allSuccess = upgrades.every(u => u.status === "success");

  if (allSuccess) {
    console.log("✅ All upgrades completed successfully!");
  } else {
    console.error("⚠️  Some upgrades failed. Check logs above.");
  }

  return {
    upgrades,
    upgradeInfo
  };
}

// Execute upgrade if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Upgrade failed:", error);
      process.exit(1);
    });
}

module.exports = main;