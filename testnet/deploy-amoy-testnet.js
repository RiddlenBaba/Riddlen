// Deploy Riddlen v5.1 Ecosystem to Amoy Testnet
// This script deploys the complete ecosystem integration to Polygon Amoy testnet

const { ethers, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Deploying Riddlen v5.1 Ecosystem to Amoy Testnet...\n");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📋 Deploying with account:", deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "MATIC\n");

    // Check we're on Amoy testnet
    const network = await ethers.provider.getNetwork();
    console.log("🌐 Network:", network.name, "Chain ID:", network.chainId.toString());

    if (network.chainId !== 80002n) {
        console.error("❌ Error: Not on Amoy testnet (Chain ID: 80002)");
        console.log("   Run: npx hardhat run scripts/deploy-amoy-testnet.js --network amoy");
        process.exit(1);
    }

    const deployedContracts = {};

    console.log("\n=== Phase 1: Core Token Deployment ===");

    // 1. Deploy RDLNUpgradeable (Primary Token)
    console.log("📄 Deploying RDLNUpgradeable...");
    const RDLNUpgradeable = await ethers.getContractFactory("RDLNUpgradeable");

    // Setup wallet addresses for testnet
    const treasuryWallet = deployer.address; // For testnet, use deployer
    const liquidityWallet = deployer.address;
    const airdropWallet = deployer.address;
    const grandPrizeWallet = deployer.address;
    const operationsWallet = deployer.address; // For automated monthly releases

    const rdln = await upgrades.deployProxy(
        RDLNUpgradeable,
        [
            deployer.address,    // _admin
            treasuryWallet,      // _treasuryWallet
            liquidityWallet,     // _liquidityWallet
            airdropWallet,       // _airdropWallet
            grandPrizeWallet,    // _grandPrizeWallet
            operationsWallet     // _operationsWallet (NEW!)
        ],
        {
            initializer: 'initialize',
            unsafeAllow: ['external-library-linking', 'delegatecall']
        }
    );
    await rdln.waitForDeployment();

    deployedContracts.rdln = {
        address: await rdln.getAddress(),
        name: "RDLNUpgradeable",
        proxy: true
    };
    console.log("✅ RDLNUpgradeable deployed to:", deployedContracts.rdln.address);

    // 2. Deploy RONAdvanced (Reputation System)
    console.log("\n📄 Deploying RONAdvanced...");
    const RONAdvanced = await ethers.getContractFactory("RONAdvanced");
    const ron = await upgrades.deployProxy(
        RONAdvanced,
        [
            deployer.address,   // _admin
            7200,              // _votingPeriod (2 hours for testnet)
            80,                // _qualityThreshold (80%)
            30                 // _minActivityThreshold (30 days)
        ],
        { initializer: 'initialize' }
    );
    await ron.waitForDeployment();

    deployedContracts.ron = {
        address: await ron.getAddress(),
        name: "RONAdvanced",
        proxy: true
    };
    console.log("✅ RONAdvanced deployed to:", deployedContracts.ron.address);

    console.log("\n=== Phase 2: NFT System Deployment ===");

    // 3. Deploy RiddleNFTAdvanced
    console.log("📄 Deploying RiddleNFTAdvanced...");
    const RiddleNFTAdvanced = await ethers.getContractFactory("RiddleNFTAdvanced");
    const riddleNFT = await upgrades.deployProxy(
        RiddleNFTAdvanced,
        [
            deployer.address,        // _admin
            await rdln.getAddress(), // _rdlnToken
            await ron.getAddress(),  // _ronToken
            treasuryWallet,          // _treasuryWallet
            grandPrizeWallet,        // _devOpsWallet
            grandPrizeWallet         // _grandPrizeWallet
        ],
        { initializer: 'initialize' }
    );
    await riddleNFT.waitForDeployment();

    deployedContracts.riddleNFT = {
        address: await riddleNFT.getAddress(),
        name: "RiddleNFTAdvanced",
        proxy: false
    };
    console.log("✅ RiddleNFTAdvanced deployed to:", deployedContracts.riddleNFT.address);

    console.log("\n=== Phase 3: Cross-Contract Integration ===");

    // Setup roles and permissions
    console.log("🔐 Setting up cross-contract permissions...");

    const MINTER_ROLE = await rdln.MINTER_ROLE();
    const GAME_ROLE = await ron.GAME_ROLE();
    const ORACLE_ROLE = await ron.ORACLE_ROLE();
    const GAME_MASTER_ROLE = await riddleNFT.GAME_MASTER_ROLE();

    // Grant RDLN minting permissions
    await rdln.grantRole(MINTER_ROLE, await riddleNFT.getAddress());
    console.log("✅ Granted MINTER_ROLE to RiddleNFT");

    // Grant RON game permissions
    await ron.grantRole(GAME_ROLE, await riddleNFT.getAddress());
    await ron.grantRole(ORACLE_ROLE, deployer.address); // Admin as oracle for testing
    console.log("✅ Granted GAME_ROLE to RiddleNFT");
    console.log("✅ Granted ORACLE_ROLE to deployer");

    // Grant NFT game master permissions
    await riddleNFT.grantRole(GAME_MASTER_ROLE, deployer.address);
    console.log("✅ Granted GAME_MASTER_ROLE to deployer");

    console.log("\n=== Phase 4: Initial Setup ===");

    // Mint some test tokens for demonstration
    console.log("🪙 Minting test tokens...");
    await rdln.mintAirdrop(deployer.address, ethers.parseEther("100000"));
    console.log("✅ Minted 100,000 RDLN for testing");

    // Test RON earning
    console.log("🏆 Testing RON system...");
    await ron.awardRON(deployer.address, 1, true, false, "Testnet deployment test");
    const ronBalance = await ron.balanceOf(deployer.address);
    console.log("✅ Earned", ronBalance.toString(), "RON");

    console.log("\n=== Phase 5: Verification ===");

    // Verify deployment
    console.log("🔍 Verifying ecosystem integration...");

    const rdlnName = await rdln.name();
    const rdlnSymbol = await rdln.symbol();
    const rdlnTotalSupply = await rdln.totalSupply();

    console.log("📊 RDLN Token Info:");
    console.log("   Name:", rdlnName);
    console.log("   Symbol:", rdlnSymbol);
    console.log("   Total Supply:", ethers.formatEther(rdlnTotalSupply), "RDLN");

    const ronName = await ron.name();
    const ronSymbol = await ron.symbol();

    console.log("📊 RON Token Info:");
    console.log("   Name:", ronName);
    console.log("   Symbol:", ronSymbol);
    console.log("   Deployer RON:", ronBalance.toString());

    const nftName = await riddleNFT.name();
    const nftSymbol = await riddleNFT.symbol();

    console.log("📊 RiddleNFT Info:");
    console.log("   Name:", nftName);
    console.log("   Symbol:", nftSymbol);

    console.log("\n=== Deployment Summary ===");
    console.log("🌐 Network: Polygon Amoy Testnet (Chain ID: 80002)");
    console.log("📅 Deployed:", new Date().toISOString());
    console.log("🚀 Riddlen v5.1 Ecosystem Integration");
    console.log("\n📋 Contract Addresses:");

    for (const [key, contract] of Object.entries(deployedContracts)) {
        console.log(`   ${contract.name}: ${contract.address} ${contract.proxy ? '(Proxy)' : ''}`);
    }

    // Save deployment info
    const deploymentInfo = {
        network: "amoy",
        chainId: 80002,
        timestamp: new Date().toISOString(),
        deployer: deployer.address,
        version: "v5.1",
        contracts: deployedContracts,
        testAccounts: {
            deployer: deployer.address,
            treasury: treasuryWallet,
            grandPrize: grandPrizeWallet
        },
        testTokens: {
            rdlnBalance: ethers.formatEther(await rdln.balanceOf(deployer.address)),
            ronBalance: ronBalance.toString()
        }
    };

    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(deploymentsDir, "amoy-testnet.json");
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log("\n💾 Deployment info saved to:", deploymentFile);
    console.log("\n🎉 Riddlen v5.1 Ecosystem successfully deployed to Amoy testnet!");
    console.log("\n📖 Next Steps:");
    console.log("   1. Verify contracts on Amoy PolygonScan");
    console.log("   2. Test ecosystem integration");
    console.log("   3. Run comprehensive test suite");
    console.log("   4. Document testnet setup for community");
    console.log("\n🔗 Amoy PolygonScan: https://amoy.polygonscan.com/");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });