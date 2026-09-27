const { ethers, network } = require("hardhat");
const { saveAddress } = require("./lib");

/**
 * Deploy the testnet RDLN faucet and fund it. Refuses to run on anything but Amoy or a local node.
 *   npx hardhat run scripts/stump/deploy-faucet.js --network amoy                # dry run
 *   CONFIRM=yes npx hardhat run scripts/stump/deploy-faucet.js --network amoy
 * Options: CLAIM (RDLN per wallet, default 500), FUNDING (RDLN minted from the airdrop
 * allocation, default 250000), FAUCET (existing address: only top up).
 */
const RDLN = process.env.RDLN_ADDRESS || "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";

async function main() {
    if (!["amoy", "localhost", "hardhat"].includes(network.name)) throw new Error("Testnet only");
    const [deployer] = await ethers.getSigners();
    const claim = ethers.parseEther(process.env.CLAIM || "500");
    const funding = ethers.parseEther(process.env.FUNDING || "250000");
    const rdln = await ethers.getContractAt("IRDLN", RDLN, deployer);
    console.log(`Network: ${network.name}   Deployer: ${deployer.address}   Claim: ${ethers.formatEther(claim)}   Funding: ${ethers.formatEther(funding)} RDLN`);
    const [, , airdropRemaining] = await rdln.getRemainingAllocations();
    console.log(`Airdrop allocation remaining: ${ethers.formatEther(airdropRemaining)} RDLN`);
    if (process.env.CONFIRM !== "yes") { console.log("\nDry run complete. Set CONFIRM=yes to deploy."); return; }

    let faucet;
    if (process.env.FAUCET) {
        faucet = await ethers.getContractAt("RDLNFaucet", process.env.FAUCET, deployer);
    } else {
        faucet = await (await ethers.getContractFactory("RDLNFaucet", deployer)).deploy(RDLN, claim);
        await faucet.waitForDeployment();
        console.log(`RDLNFaucet: ${await faucet.getAddress()}`);
    }
    await (await rdln.mintAirdrop(await faucet.getAddress(), funding)).wait();
    console.log(`Funded with ${ethers.formatEther(funding)} RDLN`);
    const file = saveAddress({ faucet: await faucet.getAddress() });
    console.log(`Saved to ${file}. Set NEXT_PUBLIC_FAUCET_ADDRESS=${await faucet.getAddress()} in the frontend.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
