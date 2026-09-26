const { ethers } = require("hardhat");

/**
 * Deploy ERC2771Forwarder for gasless transactions
 * This script deploys the trusted forwarder contract that will relay meta-transactions
 */
async function main() {
    console.log("🚀 Deploying ERC2771Forwarder for gasless transactions...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

    // Deploy ERC2771Forwarder
    console.log("\n📦 Deploying ERC2771Forwarder...");
    const ERC2771Forwarder = await ethers.getContractFactory("@openzeppelin/contracts/metatx/ERC2771Forwarder.sol:ERC2771Forwarder");
    const forwarder = await ERC2771Forwarder.deploy("RiddlenForwarder");

    await forwarder.waitForDeployment();
    const forwarderAddress = await forwarder.getAddress();

    console.log("✅ ERC2771Forwarder deployed to:", forwarderAddress);

    // Verify the deployment
    console.log("\n🔍 Verifying deployment...");
    const deployedForwarder = await ethers.getContractAt("@openzeppelin/contracts/metatx/ERC2771Forwarder.sol:ERC2771Forwarder", forwarderAddress);
    console.log("Forwarder name:", await deployedForwarder.name());

    console.log("\n📋 Deployment Summary:");
    console.log("=====================================");
    console.log("ERC2771Forwarder:", forwarderAddress);
    console.log("Network:", network.name);
    console.log("Deployer:", deployer.address);
    console.log("=====================================");

    // Save deployment info
    const deploymentInfo = {
        network: network.name,
        chainId: network.config.chainId,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            ERC2771Forwarder: forwarderAddress
        }
    };

    console.log("\n💾 Saving deployment info...");
    const fs = require('fs');
    const path = require('path');

    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = `forwarder-${network.name}-${Date.now()}.json`;
    fs.writeFileSync(
        path.join(deploymentsDir, filename),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`📄 Deployment info saved to: deployments/${filename}`);

    console.log("\n🎉 Forwarder deployment complete!");
    console.log("\n📋 Next Steps:");
    console.log("1. Update your .env with FORWARDER_ADDRESS=" + forwarderAddress);
    console.log("2. Configure OpenZeppelin Defender with this forwarder address");
    console.log("3. Run: npm run upgrade-gasless");

    return forwarderAddress;
}

// Handle both direct execution and module export
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("❌ Deployment failed:", error);
            process.exit(1);
        });
}

module.exports = main;