const { ethers, upgrades } = require("hardhat");
require('dotenv').config();

/**
 * Deploy the Revolutionary Creator Economy Upgrade
 * This script transforms Riddlen from deflationary to generative tokenomics
 */
async function main() {
    console.log("🚀 REVOLUTIONARY UPGRADE: From Burn to Build!");
    console.log("Transforming from 50% burn to 100% creator rewards...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

    // Contract addresses from environment
    const RDLN_PROXY = process.env.RDLN_PROXY || "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";
    const RIDDLE_NFT_PROXY = process.env.RIDDLE_NFT_PROXY || "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";

    console.log("\\n📋 Revolutionary Upgrade Configuration:");
    console.log("RDLN Token Proxy:", RDLN_PROXY);
    console.log("Riddle NFT Proxy:", RIDDLE_NFT_PROXY);
    console.log("Network:", network.name);

    console.log("\\n🎯 NEW TOKENOMICS:");
    console.log("OLD: 50% burn, 25% grand prize, 25% dev/ops");
    console.log("NEW: 0% burn, 10% grand prize, 30% dev/ops, 30% contributors, 30% validators");
    console.log("IMPACT: From destruction to creation economy! 🔥➡️💎");

    try {
        // Step 1: Upgrade RDLN Token with Creator Economy
        console.log("\\n📦 Step 1: Upgrading RDLN Token with Creator Economy...");
        const RDLNUpgradeable = await ethers.getContractFactory("RDLNUpgradeable");

        console.log("🔄 Upgrading RDLN proxy to creator economy version...");
        const upgradedRDLN = await upgrades.upgradeProxy(RDLN_PROXY, RDLNUpgradeable);
        await upgradedRDLN.waitForDeployment();
        console.log("✅ RDLN Token upgraded with creator economy!");

        // Step 2: Create reward wallets
        console.log("\\n💰 Step 2: Setting up Creator Economy Wallets...");

        // For demo purposes, we'll use the deployer as wallet addresses
        // In production, these should be dedicated multisig wallets
        const contributorWallet = deployer.address; // TODO: Replace with actual multisig
        const validatorWallet = deployer.address;   // TODO: Replace with actual multisig

        console.log("Contributor Rewards Wallet:", contributorWallet);
        console.log("Validator Rewards Wallet:", validatorWallet);

        // Step 3: Initialize Creator Economy
        console.log("\\n🎨 Step 3: Initializing Creator Economy System...");
        try {
            const initTx = await upgradedRDLN.initializeCreatorEconomy(
                contributorWallet,
                validatorWallet
            );
            await initTx.wait();
            console.log("✅ Creator Economy initialized!");
        } catch (error) {
            if (error.message.includes("already initialized")) {
                console.log("ℹ️ Creator Economy already initialized");
            } else {
                throw error;
            }
        }

        // Step 4: Upgrade NFT contracts (optional, for consistency)
        console.log("\\n🎮 Step 4: Upgrading NFT Contracts...");
        const RiddleNFTV2 = await ethers.getContractFactory("RiddleNFTAdvancedV2_Comprehensive");

        console.log("🔄 Upgrading NFT proxy to new tokenomics...");
        const upgradedNFT = await upgrades.upgradeProxy(RIDDLE_NFT_PROXY, RiddleNFTV2);
        await upgradedNFT.waitForDeployment();
        console.log("✅ NFT Contract updated with new tokenomics!");

        // Step 5: Verify the transformation
        console.log("\\n🔍 Step 5: Verifying Revolutionary Changes...");

        // Check creator economy stats
        try {
            const stats = await upgradedRDLN.getCreatorEconomyStats();
            console.log("Creator Economy Stats:");
            console.log("- Total Distributed:", ethers.formatEther(stats.totalDistributed), "RDLN");
            console.log("- Contributor Pool:", ethers.formatEther(stats.totalContributorPool), "RDLN");
            console.log("- Validator Pool:", ethers.formatEther(stats.totalValidatorPool), "RDLN");
        } catch (error) {
            console.log("ℹ️ Creator economy stats not yet available (no activity)");
        }

        // Check token info
        const tokenName = await upgradedRDLN.name();
        const tokenSymbol = await upgradedRDLN.symbol();
        const totalSupply = await upgradedRDLN.totalSupply();

        console.log("\\n📊 Token Verification:");
        console.log("Name:", tokenName);
        console.log("Symbol:", tokenSymbol);
        console.log("Total Supply:", ethers.formatEther(totalSupply), "RDLN");

        console.log("\\n🎉 REVOLUTIONARY UPGRADE COMPLETE!");
        console.log("=====================================");
        console.log("🔥 OLD SYSTEM: Burned tokens forever");
        console.log("💎 NEW SYSTEM: Rewards creators & validators");
        console.log("=====================================");

        console.log("\\n📈 Revolutionary Benefits:");
        console.log("✅ Sustainable tokenomics - no more burning!");
        console.log("✅ Creator economy - question makers get paid!");
        console.log("✅ Validator rewards - quality control incentivized!");
        console.log("✅ Platform growth - 30% funds development!");
        console.log("✅ Grand prizes - 10% keeps excitement alive!");

        console.log("\\n🚀 Next Steps:");
        console.log("1. Set up proper multisig wallets for rewards");
        console.log("2. Implement question creator registration");
        console.log("3. Start validator reward distribution");
        console.log("4. Monitor creator economy growth");
        console.log("5. Celebrate the sustainable future! 🎊");

        // Save upgrade summary
        const upgradeInfo = {
            network: network.name,
            chainId: network.config.chainId,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: {
                rdlnProxy: RDLN_PROXY,
                nftProxy: RIDDLE_NFT_PROXY
            },
            tokenomics: {
                old: "50% burn, 25% grand prize, 25% dev/ops",
                new: "0% burn, 10% grand prize, 30% dev/ops, 30% contributors, 30% validators"
            },
            wallets: {
                contributorRewards: contributorWallet,
                validatorRewards: validatorWallet
            },
            impact: "Transformed from deflationary game to sustainable creator economy"
        };

        console.log("\\n💾 Saving revolutionary upgrade info...");
        const fs = require('fs');
        const path = require('path');

        const deploymentsDir = path.join(__dirname, '../deployments');
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir, { recursive: true });
        }

        const filename = `creator-economy-revolution-${network.name}-${Date.now()}.json`;
        fs.writeFileSync(
            path.join(deploymentsDir, filename),
            JSON.stringify(upgradeInfo, null, 2)
        );

        console.log(`📄 Revolution documented: deployments/${filename}`);
        console.log("\\n🌟 Welcome to the Creator Economy Era! 🌟");

    } catch (error) {
        console.error("❌ Revolutionary upgrade failed:", error);
        throw error;
    }
}

// Handle both direct execution and module export
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("❌ Revolution failed:", error);
            process.exit(1);
        });
}

module.exports = main;