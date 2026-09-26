const { ethers, upgrades } = require("hardhat");
require('dotenv').config();

/**
 * Upgrade RiddlenAirdrop with gasless support
 * This script initializes the gasless functionality on the deployed airdrop contract
 */
async function main() {
    console.log("🎁 Upgrading RiddlenAirdrop with gasless support...");

    const [deployer] = await ethers.getSigners();
    console.log("Upgrading with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

    // Contract addresses from environment or deployment
    const AIRDROP_PROXY = process.env.AIRDROP_PROXY || "0x330275259AfCeC8822A861ecbbdfD026dB1B0A13";
    const FORWARDER_ADDRESS = process.env.FORWARDER_ADDRESS;

    if (!FORWARDER_ADDRESS) {
        console.error("❌ FORWARDER_ADDRESS not found in environment variables");
        console.log("Please run: npm run deploy:forwarder first");
        process.exit(1);
    }

    console.log("\n📋 Configuration:");
    console.log("Airdrop Proxy:", AIRDROP_PROXY);
    console.log("Forwarder Address:", FORWARDER_ADDRESS);

    // Get contract factory
    console.log("\n📦 Getting contract factory...");
    const RiddlenAirdrop = await ethers.getContractFactory("RiddlenAirdrop");

    // Check if we need to upgrade the implementation
    console.log("\n🔍 Checking current implementation...");
    const proxyContract = await ethers.getContractAt("RiddlenAirdrop", AIRDROP_PROXY);

    try {
        // Check if gasless is already initialized
        try {
            const gaslessInfo = await proxyContract.getGaslessInfo();
            if (gaslessInfo.enabled) {
                console.log("ℹ️ Gasless functionality already enabled");
                console.log("Current forwarder:", gaslessInfo.forwarder);

                if (gaslessInfo.forwarder.toLowerCase() === FORWARDER_ADDRESS.toLowerCase()) {
                    console.log("✅ Forwarder is already correctly configured");
                    return;
                } else {
                    console.log("🔄 Updating forwarder address...");
                    const tx = await proxyContract.updateTrustedForwarder(FORWARDER_ADDRESS);
                    await tx.wait();
                    console.log("✅ Forwarder updated successfully");
                    return;
                }
            }
        } catch (error) {
            console.log("ℹ️ Gasless functionality not yet initialized");
        }

        // Initialize gasless functionality
        console.log("\n🔄 Initializing gasless functionality...");
        const initTx = await proxyContract.initializeGasless(FORWARDER_ADDRESS);
        console.log("Transaction submitted:", initTx.hash);

        const receipt = await initTx.wait();
        console.log("✅ Gasless functionality initialized!");
        console.log("Gas used:", receipt.gasUsed.toString());

    } catch (error) {
        if (error.message.includes("Function not found") || error.message.includes("getGaslessInfo")) {
            console.log("🔄 Upgrading to gasless-enabled implementation...");

            // Upgrade the proxy to gasless-enabled version
            const upgraded = await upgrades.upgradeProxy(AIRDROP_PROXY, RiddlenAirdrop);
            await upgraded.waitForDeployment();

            console.log("✅ Contract upgraded to gasless-enabled version");

            // Initialize gasless functionality
            console.log("\n🔄 Initializing gasless functionality...");
            const initTx = await upgraded.initializeGasless(FORWARDER_ADDRESS);
            console.log("Transaction submitted:", initTx.hash);

            const receipt = await initTx.wait();
            console.log("✅ Gasless functionality initialized!");
            console.log("Gas used:", receipt.gasUsed.toString());
        } else {
            throw error;
        }
    }

    // Verify the gasless setup
    console.log("\n🔍 Verifying gasless setup...");
    const gaslessInfo = await proxyContract.getGaslessInfo();
    console.log("Gasless enabled:", gaslessInfo.enabled);
    console.log("Trusted forwarder:", gaslessInfo.forwarder);

    // Test isTrustedForwarder function
    const isTrusted = await proxyContract.isTrustedForwarder(FORWARDER_ADDRESS);
    console.log("Forwarder is trusted:", isTrusted);

    // Check phases status
    console.log("\n📊 Airdrop Phases Status:");
    console.log("Phase 1 Active:", await proxyContract.phase1Active());
    console.log("Phase 2 Active:", await proxyContract.phase2Active());
    console.log("Phase 3 Active:", await proxyContract.phase3Active());

    console.log("\n📋 Airdrop Gasless Upgrade Summary:");
    console.log("=====================================");
    console.log("Airdrop Proxy:", AIRDROP_PROXY);
    console.log("Trusted Forwarder:", FORWARDER_ADDRESS);
    console.log("Gasless Enabled:", gaslessInfo.enabled);
    console.log("Network:", network.name);
    console.log("=====================================");

    console.log("\n🎉 Airdrop gasless upgrade complete!");
    console.log("\n📋 Gasless Functions Available:");
    console.log("1. submitSocialProof() - Phase 1 social verification");
    console.log("2. claimPhase1() - Phase 1 social proof claims");
    console.log("3. claimPhase2() - Phase 2 RON-based claims");
    console.log("4. claimPhase3() - Phase 3 validation rewards");

    console.log("\n📋 Next Steps:");
    console.log("1. Configure airdrop webhook in Defender");
    console.log("2. Update frontend for gasless airdrop claims");
    console.log("3. Test gasless functionality on testnet");
    console.log("4. Activate phases when ready");

    // Save upgrade info
    const upgradeInfo = {
        network: network.name,
        chainId: network.config.chainId,
        upgrader: deployer.address,
        timestamp: new Date().toISOString(),
        proxyAddress: AIRDROP_PROXY,
        forwarderAddress: FORWARDER_ADDRESS,
        gaslessEnabled: gaslessInfo.enabled,
        contractType: "RiddlenAirdrop"
    };

    console.log("\n💾 Saving upgrade info...");
    const fs = require('fs');
    const path = require('path');

    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = `airdrop-gasless-upgrade-${network.name}-${Date.now()}.json`;
    fs.writeFileSync(
        path.join(deploymentsDir, filename),
        JSON.stringify(upgradeInfo, null, 2)
    );

    console.log(`📄 Upgrade info saved to: deployments/${filename}`);
}

// Handle both direct execution and module export
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("❌ Airdrop upgrade failed:", error);
            process.exit(1);
        });
}

module.exports = main;