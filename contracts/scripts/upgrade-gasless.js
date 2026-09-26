const { ethers, upgrades } = require("hardhat");
require('dotenv').config();

/**
 * Upgrade RiddleNFTAdvancedV2_Comprehensive with gasless support
 * This script initializes the gasless functionality on the deployed contract
 */
async function main() {
    console.log("🔄 Upgrading RiddleNFT with gasless support...");

    const [deployer] = await ethers.getSigners();
    console.log("Upgrading with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

    // Contract addresses from environment or deployment
    const RIDDLE_NFT_PROXY = process.env.RIDDLE_NFT_PROXY || "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";
    const FORWARDER_ADDRESS = process.env.FORWARDER_ADDRESS;

    if (!FORWARDER_ADDRESS) {
        console.error("❌ FORWARDER_ADDRESS not found in environment variables");
        console.log("Please run: npm run deploy:forwarder first");
        process.exit(1);
    }

    console.log("\n📋 Configuration:");
    console.log("Riddle NFT Proxy:", RIDDLE_NFT_PROXY);
    console.log("Forwarder Address:", FORWARDER_ADDRESS);

    // Get contract factory for V2 Comprehensive
    console.log("\n📦 Getting contract factory...");
    const RiddleNFTV2 = await ethers.getContractFactory("RiddleNFTAdvancedV2_Comprehensive");

    // Check if we need to upgrade the implementation
    console.log("\n🔍 Checking current implementation...");
    const proxyContract = await ethers.getContractAt("RiddleNFTAdvancedV2_Comprehensive", RIDDLE_NFT_PROXY);

    try {
        // Try to call a V2 function to see if it's already upgraded
        await proxyContract.getCurrentEra();
        console.log("✅ Contract already has V2 functionality");

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
        if (error.message.includes("Function not found")) {
            console.log("🔄 Upgrading to V2 Comprehensive implementation...");

            // Upgrade the proxy to V2 Comprehensive
            const upgraded = await upgrades.upgradeProxy(RIDDLE_NFT_PROXY, RiddleNFTV2);
            await upgraded.waitForDeployment();

            console.log("✅ Contract upgraded to V2 Comprehensive");

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

    console.log("\n📋 Gasless Upgrade Summary:");
    console.log("=====================================");
    console.log("Riddle NFT Proxy:", RIDDLE_NFT_PROXY);
    console.log("Trusted Forwarder:", FORWARDER_ADDRESS);
    console.log("Gasless Enabled:", gaslessInfo.enabled);
    console.log("Network:", network.name);
    console.log("=====================================");

    console.log("\n🎉 Gasless upgrade complete!");
    console.log("\n📋 Next Steps:");
    console.log("1. Configure OpenZeppelin Defender relayer");
    console.log("2. Update frontend to use meta-transactions");
    console.log("3. Test gasless functionality on testnet");

    // Save upgrade info
    const upgradeInfo = {
        network: network.name,
        chainId: network.config.chainId,
        upgrader: deployer.address,
        timestamp: new Date().toISOString(),
        proxyAddress: RIDDLE_NFT_PROXY,
        forwarderAddress: FORWARDER_ADDRESS,
        gaslessEnabled: gaslessInfo.enabled
    };

    console.log("\n💾 Saving upgrade info...");
    const fs = require('fs');
    const path = require('path');

    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = `gasless-upgrade-${network.name}-${Date.now()}.json`;
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
            console.error("❌ Upgrade failed:", error);
            process.exit(1);
        });
}

module.exports = main;