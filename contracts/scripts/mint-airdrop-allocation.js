const { ethers } = require("hardhat");

async function main() {
    console.log("💰 Minting RDLN tokens for airdrop allocation...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Admin account:", deployer.address);

    const RDLN_ADDRESS = "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";
    const AIRDROP_ALLOCATION = ethers.parseEther("50000000"); // 50M RDLN (already have 1M)

    const rdln = await ethers.getContractAt("RDLNUpgradeable", RDLN_ADDRESS);

    console.log("📋 Current RDLN balance:", ethers.formatEther(await rdln.balanceOf(deployer.address)), "RDLN");
    console.log("💰 Minting:", ethers.formatEther(AIRDROP_ALLOCATION), "RDLN for airdrop...\n");

    // Mint airdrop allocation
    const mintTx = await rdln.mintAirdrop(deployer.address, AIRDROP_ALLOCATION);
    console.log("Transaction hash:", mintTx.hash);
    await mintTx.wait();

    const newBalance = await rdln.balanceOf(deployer.address);
    console.log("✅ New RDLN balance:", ethers.formatEther(newBalance), "RDLN");
    console.log("\n✅ Ready to fund airdrop contract!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Minting failed:");
        console.error(error);
        process.exit(1);
    });