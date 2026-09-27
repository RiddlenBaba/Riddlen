const { ethers, upgrades, network } = require("hardhat");
const { saveAddress } = require("./lib");

// Local rehearsal step 1: deploy copies of the live RDLN and RON on a local node and fund players.
async function main() {
    if (network.name !== "localhost") throw new Error("Run against --network localhost");
    const [admin, treasury, liquidity, airdrop, grand, devops] = await ethers.getSigners();
    const rdln = await upgrades.deployProxy(await ethers.getContractFactory("RDLNDeployed"),
        [admin.address, treasury.address, liquidity.address, airdrop.address, grand.address, devops.address]);
    const ron = await upgrades.deployProxy(await ethers.getContractFactory("RONAdvanced"), [admin.address, 7200, 80, 30]);
    const signers = await ethers.getSigners();
    for (const s of signers.slice(0, 10)) await rdln.mintPrizePool(s.address, ethers.parseEther("5000"));
    const file = saveAddress({ rdln: await rdln.getAddress(), ron: await ron.getAddress() });
    console.log(`RDLN ${await rdln.getAddress()}  RON ${await ron.getAddress()}  (saved to ${file})`);
}
main().catch((e) => { console.error(e); process.exit(1); });
