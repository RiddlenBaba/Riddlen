const { ethers } = require("hardhat");

async function main() {
    const signers = await ethers.getSigners();
    console.log("Number of signers:", signers.length);

    if (signers.length > 0) {
        const deployer = signers[0];
        console.log("✅ Deployer address:", deployer.address);
        const balance = await ethers.provider.getBalance(deployer.address);
        console.log("✅ Balance:", ethers.formatEther(balance), "MATIC");
    } else {
        console.log("❌ No signers configured - check PRIVATE_KEY in .env");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });