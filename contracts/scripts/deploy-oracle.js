/**
 * Deploy RiddlenOracleNetwork to Amoy Testnet
 *
 * Integrates with existing deployed contracts:
 * - RDLN: 0x133029184EC460F661d05b0dC57BFC916b4AB0eB
 * - RON: 0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635
 *
 * Deploys:
 * 1. RiddlenOracleNetwork (UUPS Upgradeable)
 *
 * Oracle Network: Enterprise data validation service
 * - Companies pay RDLN for data validation
 * - High-RON users become validators earning RDLN
 * - Revenue generation (10% protocol fee)
 */

const { ethers, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Deployed Contract Addresses on Amoy
const DEPLOYED_ADDRESSES = {
    rdln: "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
    ron: "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
    airdrop: "0x8345ba8DA61F0192BF421B8A039BC972F3f74d4b",
    // Treasury and buyback wallets
    treasury: process.env.TREASURY_WALLET || "",
    buyback: process.env.BUYBACK_WALLET || ""
};

async function main() {
    console.log("🚀 Deploying RiddlenOracleNetwork to Amoy Testnet\n");

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
        console.log("💡 Tip: Use --network amoy");
        process.exit(1);
    }

    console.log("\n📍 Integrating with Deployed Contracts:");
    console.log("   RDLN:", DEPLOYED_ADDRESSES.rdln);
    console.log("   RON:", DEPLOYED_ADDRESSES.ron);

    // Check wallet addresses
    let treasuryWallet = DEPLOYED_ADDRESSES.treasury;
    let buybackWallet = DEPLOYED_ADDRESSES.buyback;

    if (!treasuryWallet || treasuryWallet === "") {
        console.log("\n⚠️  No TREASURY_WALLET in env, using deployer address");
        treasuryWallet = deployer.address;
    }

    if (!buybackWallet || buybackWallet === "") {
        console.log("⚠️  No BUYBACK_WALLET in env, using deployer address");
        buybackWallet = deployer.address;
    }

    let validatorBonusPool = process.env.VALIDATOR_BONUS_POOL || deployer.address;
    if (validatorBonusPool === deployer.address) {
        console.log("⚠️  No VALIDATOR_BONUS_POOL in env, using deployer address");
    }

    console.log("\n📍 Wallet Configuration:");
    console.log("   Treasury:", treasuryWallet);
    console.log("   Buyback:", buybackWallet);
    console.log("   Validator Bonus Pool:", validatorBonusPool);
    console.log("   Admin:", deployer.address);
    console.log();

    const deployedContracts = {};

    // =============================================================
    // STEP 1: Deploy RiddlenOracleNetwork (UUPS Proxy)
    // =============================================================
    console.log("=== Step 1/1: Deploy RiddlenOracleNetwork ===\n");

    console.log("📦 Deploying RiddlenOracleNetwork (UUPS Upgradeable)...");
    console.log("   This will deploy both implementation and proxy...\n");

    const RiddlenOracleNetwork = await ethers.getContractFactory("RiddlenOracleNetwork");

    const oracleNetwork = await upgrades.deployProxy(
        RiddlenOracleNetwork,
        [
            DEPLOYED_ADDRESSES.rdln,
            DEPLOYED_ADDRESSES.ron,
            treasuryWallet,
            buybackWallet,
            validatorBonusPool,
            deployer.address  // admin
        ],
        {
            initializer: "initialize",
            kind: "uups"
        }
    );

    await oracleNetwork.waitForDeployment();
    const oracleAddress = await oracleNetwork.getAddress();
    deployedContracts.oracleNetwork = oracleAddress;

    console.log("✅ RiddlenOracleNetwork deployed (Proxy):", oracleAddress);

    // Get implementation address
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(oracleAddress);
    console.log("📝 Implementation address:", implementationAddress);

    // =============================================================
    // STEP 2: Verify Deployment
    // =============================================================
    console.log("\n=== Step 2: Verify Deployment ===\n");

    console.log("🔍 Verifying contract state...\n");

    // Check tokens
    const rdlnAddress = await oracleNetwork.rdlnToken();
    const ronAddress = await oracleNetwork.ronToken();
    console.log("✅ RDLN Token:", rdlnAddress);
    console.log("✅ RON Token:", ronAddress);

    // Check wallets
    const treasuryAddr = await oracleNetwork.treasuryWallet();
    const buybackAddr = await oracleNetwork.buybackWallet();
    console.log("✅ Treasury Wallet:", treasuryAddr);
    console.log("✅ Buyback Wallet:", buybackAddr);

    // Check protocol fee
    const protocolFee = await oracleNetwork.protocolFeePercent();
    console.log("✅ Protocol Fee:", protocolFee.toString(), "/ 10000 (",
        (Number(protocolFee) / 100).toFixed(1), "%)");

    // Check circuit breaker limits
    const maxDailyRequests = await oracleNetwork.MAX_DAILY_REQUESTS();
    const maxSingleReward = await oracleNetwork.MAX_SINGLE_REWARD();
    const minReward = await oracleNetwork.MIN_REWARD();
    console.log("✅ Max Daily Requests:", maxDailyRequests.toString());
    console.log("✅ Max Single Reward:", ethers.formatEther(maxSingleReward), "RDLN");
    console.log("✅ Min Reward:", ethers.formatEther(minReward), "RDLN");

    // Check validator tier requirements
    const bronzeMin = await oracleNetwork.BRONZE_MIN_RON();
    const silverMin = await oracleNetwork.SILVER_MIN_RON();
    const goldMin = await oracleNetwork.GOLD_MIN_RON();
    const platinumMin = await oracleNetwork.PLATINUM_MIN_RON();
    console.log("\n📊 Validator Tier Requirements:");
    console.log("   Bronze:", ethers.formatEther(bronzeMin), "RON");
    console.log("   Silver:", ethers.formatEther(silverMin), "RON");
    console.log("   Gold:", ethers.formatEther(goldMin), "RON");
    console.log("   Platinum:", ethers.formatEther(platinumMin), "RON");

    // Check roles
    const ADMIN_ROLE = await oracleNetwork.ADMIN_ROLE();
    const UPGRADER_ROLE = await oracleNetwork.UPGRADER_ROLE();
    const PAUSER_ROLE = await oracleNetwork.PAUSER_ROLE();
    const DEFAULT_ADMIN_ROLE = await oracleNetwork.DEFAULT_ADMIN_ROLE();

    console.log("\n🔐 Role Assignments:");
    console.log("   Admin has DEFAULT_ADMIN_ROLE:",
        await oracleNetwork.hasRole(DEFAULT_ADMIN_ROLE, deployer.address));
    console.log("   Admin has ADMIN_ROLE:",
        await oracleNetwork.hasRole(ADMIN_ROLE, deployer.address));
    console.log("   Admin has UPGRADER_ROLE:",
        await oracleNetwork.hasRole(UPGRADER_ROLE, deployer.address));
    console.log("   Admin has PAUSER_ROLE:",
        await oracleNetwork.hasRole(PAUSER_ROLE, deployer.address));

    // Check emergency limits
    const maxEmergencyWithdrawals = await oracleNetwork.MAX_EMERGENCY_WITHDRAWALS();
    const emergencyCooldown = await oracleNetwork.EMERGENCY_COOLDOWN();
    console.log("\n⚠️  Emergency Protection:");
    console.log("   Max Emergency Withdrawals:", maxEmergencyWithdrawals.toString());
    console.log("   Emergency Cooldown:", (Number(emergencyCooldown) / 86400).toFixed(0), "days");

    // =============================================================
    // STEP 3: Save Deployment Info
    // =============================================================
    console.log("\n=== Step 3: Save Deployment Info ===\n");

    const deploymentInfo = {
        network: "amoy",
        chainId: network.chainId.toString(),
        timestamp: new Date().toISOString(),
        deployer: deployer.address,
        contracts: {
            oracleNetwork: {
                proxy: oracleAddress,
                implementation: implementationAddress
            },
            rdln: DEPLOYED_ADDRESSES.rdln,
            ron: DEPLOYED_ADDRESSES.ron
        },
        wallets: {
            treasury: treasuryAddr,
            buyback: buybackAddr,
            admin: deployer.address
        },
        configuration: {
            protocolFee: protocolFee.toString(),
            maxDailyRequests: maxDailyRequests.toString(),
            maxSingleReward: maxSingleReward.toString(),
            minReward: minReward.toString()
        }
    };

    const deploymentPath = path.join(__dirname, "..", "deployments", "oracle-amoy.json");
    fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

    console.log("✅ Deployment info saved:", deploymentPath);

    // =============================================================
    // STEP 4: Next Steps
    // =============================================================
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));

    console.log("\n📋 Deployed Addresses:");
    console.log("   RiddlenOracleNetwork (Proxy):", oracleAddress);
    console.log("   Implementation:", implementationAddress);

    console.log("\n🔗 PolygonScan (Amoy):");
    console.log("   Proxy:", `https://amoy.polygonscan.com/address/${oracleAddress}`);
    console.log("   Implementation:", `https://amoy.polygonscan.com/address/${implementationAddress}`);

    console.log("\n📝 Next Steps:");
    console.log("   1. Verify contracts on PolygonScan:");
    console.log("      npx hardhat verify --network amoy", oracleAddress);
    console.log();
    console.log("   2. Fund oracle with RDLN for validator rewards");
    console.log();
    console.log("   3. (Optional) Grant additional roles:");
    console.log("      - OPERATOR_ROLE for operations");
    console.log("      - PAUSER_ROLE for security team");
    console.log();
    console.log("   4. Test creating a validation request:");
    console.log("      - Companies need to approve RDLN to oracle");
    console.log("      - Call createValidationRequest()");
    console.log();
    console.log("   5. Onboard validators:");
    console.log("      - Users with RON can become validators");
    console.log("      - Bronze: 100 RON, Silver: 1K RON, Gold: 10K RON, Platinum: 100K RON");

    console.log("\n⚠️  Security Reminders:");
    console.log("   - Contract is PAUSED by default: false");
    console.log("   - Emergency withdrawal limit: 3 times max");
    console.log("   - Circuit breaker active:", maxDailyRequests.toString(), "requests/day");
    console.log("   - All admin functions require appropriate roles");

    console.log("\n💰 Revenue Model:");
    console.log("   - Protocol fee: 10% of all rewards");
    console.log("   - Distribution: 50% treasury, 30% buyback/burn, 20% validator bonuses");
    console.log("   - Slashed stakes: 50% burned, 50% to correct validators");

    console.log("\n✅ Oracle Network Ready for Testing!");
    console.log("=".repeat(60) + "\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });
