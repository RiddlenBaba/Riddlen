// Test deployment script for local development
// This version skips the network check to test deployment logic

const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("🧪 Testing Riddlen v5.1 deployment logic...\n");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📋 Deploying with account:", deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH\n");

    const deployedContracts = {};

    console.log("=== Phase 1: Core Token Deployment ===");

    // 1. Deploy RDLNUpgradeable
    console.log("📄 Deploying RDLNUpgradeable...");
    const RDLNUpgradeable = await ethers.getContractFactory("RDLNUpgradeable");

    const rdln = await upgrades.deployProxy(
        RDLNUpgradeable,
        [
            deployer.address,    // _admin
            deployer.address,    // _treasuryWallet
            deployer.address,    // _liquidityWallet
            deployer.address,    // _airdropWallet
            deployer.address     // _grandPrizeWallet
        ],
        {
            initializer: 'initialize',
            unsafeAllow: ['external-library-linking', 'delegatecall']
        }
    );
    await rdln.waitForDeployment();

    deployedContracts.rdln = await rdln.getAddress();
    console.log("✅ RDLNUpgradeable deployed to:", deployedContracts.rdln);

    // 2. Deploy RONAdvanced
    console.log("\n📄 Deploying RONAdvanced...");
    const RONAdvanced = await ethers.getContractFactory("RONAdvanced");
    const ron = await upgrades.deployProxy(
        RONAdvanced,
        [deployer.address], // admin
        { initializer: 'initialize' }
    );
    await ron.waitForDeployment();

    deployedContracts.ron = await ron.getAddress();
    console.log("✅ RONAdvanced deployed to:", deployedContracts.ron);

    // 3. Deploy RiddleNFTAdvanced
    console.log("\n📄 Deploying RiddleNFTAdvanced...");
    const RiddleNFTAdvanced = await ethers.getContractFactory("RiddleNFTAdvanced");
    const riddleNFT = await RiddleNFTAdvanced.deploy(
        await rdln.getAddress(),  // RDLN token
        await ron.getAddress(),   // RON token
        deployer.address,        // Treasury wallet
        deployer.address,        // Grand prize wallet
        deployer.address         // Admin
    );
    await riddleNFT.waitForDeployment();

    deployedContracts.riddleNFT = await riddleNFT.getAddress();
    console.log("✅ RiddleNFTAdvanced deployed to:", deployedContracts.riddleNFT);

    console.log("\n=== Phase 2: Cross-Contract Integration Test ===");

    // Setup roles
    const MINTER_ROLE = await rdln.MINTER_ROLE();
    const GAME_ROLE = await ron.GAME_ROLE();

    await rdln.grantRole(MINTER_ROLE, await riddleNFT.getAddress());
    await ron.grantRole(GAME_ROLE, await riddleNFT.getAddress());
    console.log("✅ Cross-contract permissions configured");

    // Test functionality
    await rdln.mintAirdrop(deployer.address, ethers.parseEther("1000"));
    console.log("✅ Test RDLN minting successful");

    await ron.awardRON(deployer.address, 1, true, false, "Test deployment");
    const ronBalance = await ron.balanceOf(deployer.address);
    console.log("✅ Test RON earning successful:", ronBalance.toString(), "RON");

    console.log("\n🎉 Deployment logic test completed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("   RDLNUpgradeable:", deployedContracts.rdln);
    console.log("   RONAdvanced:", deployedContracts.ron);
    console.log("   RiddleNFTAdvanced:", deployedContracts.riddleNFT);

    return deployedContracts;
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("❌ Test deployment failed:", error);
            process.exit(1);
        });
}

module.exports = main;