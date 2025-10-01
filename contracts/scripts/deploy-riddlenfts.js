const { ethers } = require("hardhat");

async function main() {
  console.log("🧩 Deploying Riddlen Weekly NFT System...");

  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Configuration
  const config = {
    admin: process.env.ADMIN_WALLET || deployer.address,
    liquidityWallet: process.env.LIQUIDITY_WALLET || deployer.address,
    devOpsWallet: process.env.DEVOPS_WALLET || deployer.address,
    // These would be the deployed RDLN and RON addresses
    rdlnToken: process.env.RDLN_ADDRESS || "0x0000000000000000000000000000000000000000",
    ronToken: process.env.RON_ADDRESS || "0x0000000000000000000000000000000000000000",
  };

  console.log("Configuration:");
  console.log("- Admin:", config.admin);
  console.log("- Liquidity Wallet:", config.liquidityWallet);
  console.log("- DevOps Wallet:", config.devOpsWallet);
  console.log("- RDLN Token:", config.rdlnToken);
  console.log("- RON Token:", config.ronToken);

  // Validate required addresses
  if (config.rdlnToken === "0x0000000000000000000000000000000000000000") {
    console.log("⚠️  Warning: RDLN token address not set. Deploy RDLN first.");
    console.log("   Set RDLN_ADDRESS environment variable or update config.");
  }

  if (config.ronToken === "0x0000000000000000000000000000000000000000") {
    console.log("⚠️  Warning: RON token address not set. Deploy RON first.");
    console.log("   Set RON_ADDRESS environment variable or update config.");
  }

  // Deploy RiddleNFT contract
  const RiddleNFT = await ethers.getContractFactory("RiddleNFT");
  const riddleNFT = await RiddleNFT.deploy(
    config.rdlnToken,
    config.ronToken,
    config.liquidityWallet,
    config.devOpsWallet,
    config.admin
  );

  await riddleNFT.waitForDeployment();
  const riddleNFTAddress = await riddleNFT.getAddress();

  console.log("✅ Riddlen Weekly NFT System deployed to:", riddleNFTAddress);

  // Verify initial state
  console.log("\n📊 Verifying deployment...");
  console.log("- Current Week:", await riddleNFT.getCurrentWeek());
  console.log("- Current Mint Cost:", ethers.formatEther(await riddleNFT.getCurrentMintCost()), "RDLN");

  const [period, cost] = await riddleNFT.getBiennialPeriod();
  console.log("- Biennial Period:", period.toString());
  console.log("- Biennial Cost:", ethers.formatEther(cost), "RDLN");

  // Show commission structure
  console.log("\n💰 Commission Structure:");
  const burnPercent = await riddleNFT.burnPercent();
  const liquidityPercent = await riddleNFT.liquidityPercent();
  const devOpsPercent = await riddleNFT.devOpsPercent();

  console.log("- Burn Percent:", (Number(burnPercent) / 100).toString() + "%");
  console.log("- Liquidity Percent:", (Number(liquidityPercent) / 100).toString() + "%");
  console.log("- DevOps Percent:", (Number(devOpsPercent) / 100).toString() + "%");

  // Show role information
  console.log("\n🔐 Role Information:");
  const DEFAULT_ADMIN_ROLE = await riddleNFT.DEFAULT_ADMIN_ROLE();
  const ADMIN_ROLE = await riddleNFT.ADMIN_ROLE();
  const CREATOR_ROLE = await riddleNFT.CREATOR_ROLE();

  console.log("- DEFAULT_ADMIN_ROLE:", DEFAULT_ADMIN_ROLE);
  console.log("- ADMIN_ROLE:", ADMIN_ROLE);
  console.log("- CREATOR_ROLE:", CREATOR_ROLE);

  // Check admin has all necessary roles
  console.log("\n👑 Admin Role Verification:");
  console.log("- Has DEFAULT_ADMIN_ROLE:", await riddleNFT.hasRole(DEFAULT_ADMIN_ROLE, config.admin));
  console.log("- Has ADMIN_ROLE:", await riddleNFT.hasRole(ADMIN_ROLE, config.admin));
  console.log("- Has CREATOR_ROLE:", await riddleNFT.hasRole(CREATOR_ROLE, config.admin));

  // Show system constants
  console.log("\n⚙️ System Constants:");
  console.log("- Genesis Time:", new Date(Number(await riddleNFT.GENESIS_TIME()) * 1000).toISOString());
  console.log("- Week Duration:", Number(await riddleNFT.WEEK_DURATION()) / (24 * 60 * 60), "days");
  console.log("- Total Weeks:", await riddleNFT.TOTAL_WEEKS());
  console.log("- Biennial Period:", Number(await riddleNFT.BIENNIAL_PERIOD()) / (24 * 60 * 60), "days");
  console.log("- Initial Mint Cost:", ethers.formatEther(await riddleNFT.INITIAL_MINT_COST()), "RDLN");
  console.log("- Prize Allocation:", ethers.formatEther(await riddleNFT.PRIZE_ALLOCATION()), "RDLN");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: riddleNFTAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    config: config,
    roles: {
      DEFAULT_ADMIN_ROLE,
      ADMIN_ROLE,
      CREATOR_ROLE
    },
    commissionStructure: {
      burn: Number(burnPercent) / 100,
      liquidity: Number(liquidityPercent) / 100,
      devOps: Number(devOpsPercent) / 100
    }
  };

  console.log("\n💾 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Post-deployment instructions
  console.log("\n📋 Next Steps:");
  console.log("1. Grant necessary roles to related contracts if needed:");
  console.log(`   await riddleNFT.grantRole("${ADMIN_ROLE}", additionalAdminAddress)`);
  console.log("2. Ensure RDLN contract has approved this contract for prize distributions:");
  console.log(`   await rdln.approve("${riddleNFTAddress}", amount)`);
  console.log("3. Release first weekly riddle:");
  console.log(`   await riddleNFT.releaseWeeklyRiddle("Mathematics", 0, answerHash, ipfsHash)`);

  // Integration requirements
  console.log("\n🔗 Integration Requirements:");
  console.log("- RDLN Token must approve this contract to transfer tokens for prizes");
  console.log("- RON Token must grant GAME_ROLE to this contract for awarding reputation");
  console.log("- This contract must have access to 700M RDLN from the prize allocation");

  // Testing suggestions
  console.log("\n🧪 Testing Suggestions:");
  console.log("1. Test weekly riddle creation with different difficulties");
  console.log("2. Test NFT minting and progressive burn mechanics");
  console.log("3. Test solution submission and prize distribution");
  console.log("4. Test NFT resale with commission distribution");
  console.log("5. Test biennial cost halving mechanism");

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 To verify the contract, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${riddleNFTAddress} \\`);
    console.log(`  "${config.rdlnToken}" \\`);
    console.log(`  "${config.ronToken}" \\`);
    console.log(`  "${config.liquidityWallet}" \\`);
    console.log(`  "${config.devOpsWallet}" \\`);
    console.log(`  "${config.admin}"`);
  }

  return {
    riddleNFT,
    address: riddleNFTAddress,
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