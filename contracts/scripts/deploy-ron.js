const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying RON Reputation System...");

  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Configuration
  const config = {
    admin: process.env.ADMIN_WALLET || deployer.address,
  };

  console.log("Configuration:");
  console.log("- Admin:", config.admin);

  // Deploy RON contract
  const RON = await ethers.getContractFactory("RON");
  const ron = await RON.deploy(config.admin);

  await ron.waitForDeployment();
  const ronAddress = await ron.getAddress();

  console.log("✅ RON Reputation System deployed to:", ronAddress);

  // Verify initial state
  console.log("\n📊 Verifying deployment...");
  console.log("- Total Users:", await ron.totalUsers());
  console.log("- Total RON Minted:", await ron.totalRONMinted());
  console.log("- Total Validations:", await ron.totalValidationsPerformed());

  // Show tier thresholds
  const [solverThreshold, expertThreshold, oracleThreshold] = await ron.getTierThresholds();
  console.log("\n🎯 Tier Thresholds:");
  console.log("- Solver Threshold:", solverThreshold.toString(), "RON");
  console.log("- Expert Threshold:", expertThreshold.toString(), "RON");
  console.log("- Oracle Threshold:", oracleThreshold.toString(), "RON");

  // Show role information
  console.log("\n🔐 Role Information:");
  const DEFAULT_ADMIN_ROLE = await ron.DEFAULT_ADMIN_ROLE();
  const GAME_ROLE = await ron.GAME_ROLE();
  const ORACLE_ROLE = await ron.ORACLE_ROLE();
  const PAUSER_ROLE = await ron.PAUSER_ROLE();

  console.log("- DEFAULT_ADMIN_ROLE:", DEFAULT_ADMIN_ROLE);
  console.log("- GAME_ROLE:", GAME_ROLE);
  console.log("- ORACLE_ROLE:", ORACLE_ROLE);
  console.log("- PAUSER_ROLE:", PAUSER_ROLE);

  // Check admin has all necessary roles
  console.log("\n👑 Admin Role Verification:");
  console.log("- Has DEFAULT_ADMIN_ROLE:", await ron.hasRole(DEFAULT_ADMIN_ROLE, config.admin));
  console.log("- Has PAUSER_ROLE:", await ron.hasRole(PAUSER_ROLE, config.admin));

  // Show reward calculations for each difficulty
  console.log("\n💎 RON Reward Examples:");

  // Easy riddle, no bonuses
  const [easyBase, easyBonus] = await ron.calculateRONReward(0, false, false, 0);
  console.log("- Easy riddle (base):", easyBase.toString(), "RON");

  // Medium riddle with first solver bonus
  const [mediumBase, mediumBonus] = await ron.calculateRONReward(1, true, false, 0);
  console.log("- Medium riddle (first solver):", (mediumBase + mediumBonus).toString(), "RON");

  // Hard riddle with speed bonus
  const [hardBase, hardBonus] = await ron.calculateRONReward(2, false, true, 0);
  console.log("- Hard riddle (speed solver):", (hardBase + hardBonus).toString(), "RON");

  // Legendary riddle with all bonuses
  const [legendaryBase, legendaryAllBonus] = await ron.calculateRONReward(3, true, true, 5);
  console.log("- Legendary riddle (all bonuses):", (legendaryBase + legendaryAllBonus).toString(), "RON");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: ronAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    config: config,
    roles: {
      DEFAULT_ADMIN_ROLE,
      GAME_ROLE,
      ORACLE_ROLE,
      PAUSER_ROLE
    },
    tierThresholds: {
      solver: solverThreshold.toString(),
      expert: expertThreshold.toString(),
      oracle: oracleThreshold.toString()
    }
  };

  console.log("\n💾 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Post-deployment instructions
  console.log("\n📋 Next Steps:");
  console.log("1. Grant GAME_ROLE to riddle contracts:");
  console.log(`   await ron.grantRole("${GAME_ROLE}", riddleContractAddress)`);
  console.log("2. Grant ORACLE_ROLE to oracle validation contracts:");
  console.log(`   await ron.grantRole("${ORACLE_ROLE}", oracleContractAddress)`);
  console.log("3. Test RON earning with:");
  console.log(`   await ron.awardRON(userAddress, 0, false, false, "Test riddle")`);

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 To verify the contract, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${ronAddress} "${config.admin}"`);
  }

  return {
    ron,
    address: ronAddress,
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