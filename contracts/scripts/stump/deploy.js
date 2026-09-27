const { ethers, upgrades, network } = require("hardhat");
const { saveAddress } = require("./lib");

/**
 * Deploy StumpTheMachine (UUPS proxy) and wire it to the live RDLN and RON.
 *
 * Dry run (default): prints what would happen.
 *   npx hardhat run scripts/stump/deploy.js --network amoy
 * Execute:
 *   CONFIRM=yes npx hardhat run scripts/stump/deploy.js --network amoy
 *
 * Optional: GAME_MASTER=<address> (defaults to the deployer), PRIZE_FUNDING=<RDLN> minted to the
 * game via mintPrizePool (needs MINTER_ROLE on RDLN; default 1000000).
 * After deploying, the deployer must hold RDLN DEFAULT_ADMIN_ROLE and RON admin to grant GAME_ROLE;
 * the script tries and reports each step.
 */

const RDLN = process.env.RDLN_ADDRESS || "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";
const RON = process.env.RON_ADDRESS || "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635";

async function main() {
    const [deployer] = await ethers.getSigners();
    if (!deployer) throw new Error("No signer configured (set PRIVATE_KEY)");
    const gameMaster = process.env.GAME_MASTER || deployer.address;
    const funding = ethers.parseEther(process.env.PRIZE_FUNDING || "1000000");

    console.log(`Network: ${network.name}   Deployer: ${deployer.address}`);
    console.log(`RDLN: ${RDLN}   RON: ${RON}   Game master: ${gameMaster}   Funding: ${ethers.formatEther(funding)} RDLN`);

    const rdln = await ethers.getContractAt("IRDLN", RDLN, deployer);
    const rdlnAdmin = await ethers.getContractAt(["function hasRole(bytes32,address) view returns (bool)",
        "function grantRole(bytes32,address)", "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
        "function GAME_ROLE() view returns (bytes32)", "function MINTER_ROLE() view returns (bytes32)"], RDLN, deployer);
    const ronAdmin = await ethers.getContractAt(["function hasRole(bytes32,address) view returns (bool)",
        "function grantRole(bytes32,address)", "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
        "function GAME_ROLE() view returns (bytes32)"], RON, deployer);

    const canGrantRdln = await rdlnAdmin.hasRole(await rdlnAdmin.DEFAULT_ADMIN_ROLE(), deployer.address);
    const canGrantRon = await ronAdmin.hasRole(await ronAdmin.DEFAULT_ADMIN_ROLE(), deployer.address);
    const canMint = await rdlnAdmin.hasRole(await rdlnAdmin.MINTER_ROLE(), deployer.address);
    console.log(`Deployer can grant RDLN GAME_ROLE: ${canGrantRdln}   RON GAME_ROLE: ${canGrantRon}   mint prizes: ${canMint}`);

    if (process.env.CONFIRM !== "yes") {
        console.log("\nDry run complete. Set CONFIRM=yes to deploy.");
        return;
    }

    const game = await upgrades.deployProxy(await ethers.getContractFactory("StumpTheMachine"),
        [deployer.address, RDLN, RON], { kind: "uups" });
    await game.waitForDeployment();
    const proxy = await game.getAddress();
    const impl = await upgrades.erc1967.getImplementationAddress(proxy);
    console.log(`StumpTheMachine proxy: ${proxy}   implementation: ${impl}`);

    await (await game.grantRole(await game.GAME_MASTER_ROLE(), gameMaster)).wait();
    console.log(`GAME_MASTER_ROLE granted to ${gameMaster}`);

    if (canGrantRdln) {
        await (await rdlnAdmin.grantRole(await rdlnAdmin.GAME_ROLE(), proxy)).wait();
        console.log("RDLN GAME_ROLE granted");
    } else console.log("SKIPPED: RDLN GAME_ROLE (deployer is not RDLN admin)");
    if (canGrantRon) {
        await (await ronAdmin.grantRole(await ronAdmin.GAME_ROLE(), proxy)).wait();
        console.log("RON GAME_ROLE granted");
    } else console.log("SKIPPED: RON GAME_ROLE (deployer is not RON admin)");
    if (canMint && funding > 0n) {
        await (await rdln.mintPrizePool(proxy, funding)).wait();
        console.log(`Funded with ${ethers.formatEther(funding)} RDLN`);
    } else console.log("SKIPPED: prize funding");

    const file = saveAddress({ proxy, implementation: impl, rdln: RDLN, ron: RON, deployedAt: new Date().toISOString() });
    console.log(`\nSaved to ${file}. Set NEXT_PUBLIC_STUMP_ADDRESS=${proxy} in the frontend.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
