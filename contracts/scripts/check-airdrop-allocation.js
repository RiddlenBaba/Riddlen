const { ethers } = require("hardhat");

async function main() {
    const RDLN_ADDRESS = "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";
    const rdln = await ethers.getContractAt("RDLNUpgradeable", RDLN_ADDRESS);

    const AIRDROP_ALLOCATION = await rdln.AIRDROP_ALLOCATION();
    const airdropMinted = await rdln.airdropMinted();
    const remaining = AIRDROP_ALLOCATION - airdropMinted;

    console.log("📊 Airdrop Allocation Status:\n");
    console.log("Total Allocation:", ethers.formatEther(AIRDROP_ALLOCATION), "RDLN");
    console.log("Already Minted:  ", ethers.formatEther(airdropMinted), "RDLN");
    console.log("Remaining:       ", ethers.formatEther(remaining), "RDLN");

    console.log("\n💡 You can mint up to", ethers.formatEther(remaining), "more RDLN for airdrop");
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });