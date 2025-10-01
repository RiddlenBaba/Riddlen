const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying RDLN Token Contract...");

  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Configuration - Replace with actual wallet addresses
  const config = {
    admin: deployer.address, // Replace with multi-sig wallet
    treasuryWallet: process.env.TREASURY_WALLET || deployer.address,
    liquidityWallet: process.env.LIQUIDITY_WALLET || deployer.address,
    airdropWallet: process.env.AIRDROP_WALLET || deployer.address,
  };

  console.log("Configuration:");
  console.log("- Admin:", config.admin);
  console.log("- Treasury Wallet:", config.treasuryWallet);
  console.log("- Liquidity Wallet:", config.liquidityWallet);
  console.log("- Airdrop Wallet:", config.airdropWallet);

  // Deploy RDLN Token
  const RDLN = await ethers.getContractFactory("RDLN");
  const rdln = await RDLN.deploy(
    config.admin,
    config.treasuryWallet,
    config.liquidityWallet,
    config.airdropWallet
  );

  await rdln.waitForDeployment();
  const rdlnAddress = await rdln.getAddress();

  console.log("✅ RDLN Token deployed to:", rdlnAddress);

  // Verify initial state
  console.log("\n📊 Verifying deployment...");
  console.log("- Name:", await rdln.name());
  console.log("- Symbol:", await rdln.symbol());
  console.log("- Total Supply Cap:", ethers.formatEther(await rdln.TOTAL_SUPPLY()));
  console.log("- Prize Pool Allocation:", ethers.formatEther(await rdln.PRIZE_POOL_ALLOCATION()));
  console.log("- Treasury Allocation:", ethers.formatEther(await rdln.TREASURY_ALLOCATION()));
  console.log("- Airdrop Allocation:", ethers.formatEther(await rdln.AIRDROP_ALLOCATION()));
  console.log("- Liquidity Allocation:", ethers.formatEther(await rdln.LIQUIDITY_ALLOCATION()));

  const deployerBalance = await rdln.balanceOf(deployer.address);
  console.log("- Initial Admin Balance:", ethers.formatEther(deployerBalance), "RDLN");

  // Show role information
  console.log("\n🔐 Role Information:");
  const DEFAULT_ADMIN_ROLE = await rdln.DEFAULT_ADMIN_ROLE();
  const MINTER_ROLE = await rdln.MINTER_ROLE();
  const GAME_ROLE = await rdln.GAME_ROLE();
  const PAUSER_ROLE = await rdln.PAUSER_ROLE();

  console.log("- DEFAULT_ADMIN_ROLE:", DEFAULT_ADMIN_ROLE);
  console.log("- MINTER_ROLE:", MINTER_ROLE);
  console.log("- GAME_ROLE:", GAME_ROLE);
  console.log("- PAUSER_ROLE:", PAUSER_ROLE);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: rdlnAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    config: config,
    roles: {
      DEFAULT_ADMIN_ROLE,
      MINTER_ROLE,
      GAME_ROLE,
      PAUSER_ROLE
    }
  };

  console.log("\n💾 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 To verify the contract, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${rdlnAddress} "${config.admin}" "${config.treasuryWallet}" "${config.liquidityWallet}" "${config.airdropWallet}"`);
  }

  return {
    rdln,
    address: rdlnAddress,
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