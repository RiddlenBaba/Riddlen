const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const RDLN_ADDRESS = "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";
    const rdln = await ethers.getContractAt("RDLNUpgradeable", RDLN_ADDRESS);

    console.log("Checking roles for:", deployer.address, "\n");

    const MINTER_ROLE = await rdln.MINTER_ROLE();
    const hasMinter = await rdln.hasRole(MINTER_ROLE, deployer.address);

    console.log("MINTER_ROLE:", hasMinter ? "✅ YES" : "❌ NO");

    if (!hasMinter) {
        console.log("\n💡 Grant MINTER_ROLE with:");
        console.log(`rdln.grantRole("${MINTER_ROLE}", "${deployer.address}")`);
    }
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });