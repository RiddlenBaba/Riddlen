const { ethers } = require("hardhat");

async function main() {
    console.log("🎯 Quick Test Setup for Airdrop\n");

    const [deployer] = await ethers.getSigners();
    console.log("Admin:", deployer.address);

    const AIRDROP_ADDRESS = "0x330275259AfCeC8822A861ecbbdfD026dB1B0A13";
    const airdrop = await ethers.getContractAt("RiddlenAirdrop", AIRDROP_ADDRESS);

    // Check current balance
    const RDLN_ADDRESS = "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";
    const rdln = await ethers.getContractAt("RDLNUpgradeable", RDLN_ADDRESS);
    const balance = await rdln.balanceOf(AIRDROP_ADDRESS);

    console.log("📊 Current Status:");
    console.log("Airdrop Balance:", ethers.formatEther(balance), "RDLN");
    console.log("Phase 1 Active:", await airdrop.phase1Active());
    console.log("Snapshot Taken:", await airdrop.snapshotTaken());

    console.log("\n💡 We have", ethers.formatEther(balance), "RDLN");
    console.log("This is enough for", Math.floor(Number(ethers.formatEther(balance)) / 10000), "Phase 1 claims");

    console.log("\n✅ For testing, let's use this amount. Next steps:");
    console.log("1. We need to either:");
    console.log("   a) Mint more RDLN (need MINTER_ROLE)");
    console.log("   b) Temporarily modify the phase activation requirement");
    console.log("\nWhat would you like to do?");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });