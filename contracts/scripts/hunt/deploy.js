const { ethers, upgrades, network } = require("hardhat");
const fs = require("fs");
const path = require("path");
const { saveAddress, mapDir } = require("./lib");

/**
 * Deploy the hunt: HuntCommitments (immutable), HuntNFT (UUPS), RiddlenHunt (UUPS); wire roles
 * to the live RDLN and RON; fund the pots.
 *
 * Dry run (default):   npx hardhat run scripts/hunt/deploy.js --network amoy
 * Execute:             CONFIRM=yes npx hardhat run scripts/hunt/deploy.js --network amoy
 *
 * Commitments come from the map manifest written by mapmaker.js (game-master/hunt/map/manifest.json)
 * or from MAP_ROOT and PRIZE_COMMITMENT. Other options:
 *   LAUNCH_AT (unix seconds, default now)     BASE_PRICE (the mint-price FLOOR in RDLN, default 10)
 *   HALVING_DAYS (default 730)                TOTAL_RIDDLES (default 1000)
 *   SPACING_SECONDS (default 0; the schedule on mainnet)
 *   GAME_MASTER (default deployer)            PRIZE_FUNDING (RDLN via mintPrizePool, default 1000000)
 *   BASE_URI (token metadata, default https://riddlen.com/api/token/)
 *   RDLN_ADDRESS / RON_ADDRESS (default the Amoy tokens)
 */

const RDLN = process.env.RDLN_ADDRESS || "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";
const RON = process.env.RON_ADDRESS || "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635";

async function main() {
    const [deployer] = await ethers.getSigners();
    if (!deployer) throw new Error("No signer configured (set PRIVATE_KEY)");

    let mapRoot = process.env.MAP_ROOT, prizeCommitment = process.env.PRIZE_COMMITMENT;
    const manifest = path.join(mapDir(), "manifest.json");
    if ((!mapRoot || !prizeCommitment) && fs.existsSync(manifest)) {
        const m = JSON.parse(fs.readFileSync(manifest, "utf8"));
        mapRoot = mapRoot || m.mapRoot;
        prizeCommitment = prizeCommitment || m.prizeCommitment;
    }
    if (!mapRoot || !prizeCommitment) throw new Error("Run scripts/hunt/mapmaker.js first, or set MAP_ROOT and PRIZE_COMMITMENT");

    const launchAt = Number(process.env.LAUNCH_AT || (await ethers.provider.getBlock("latest")).timestamp);
    const basePrice = ethers.parseEther(process.env.BASE_PRICE || "10");
    const halving = Number(process.env.HALVING_DAYS || 730) * 86400;
    const total = Number(process.env.TOTAL_RIDDLES || 1000);
    const spacing = Number(process.env.SPACING_SECONDS || 0);
    const gameMaster = process.env.GAME_MASTER || deployer.address;
    const funding = ethers.parseEther(process.env.PRIZE_FUNDING || "1000000");
    const baseURI = process.env.BASE_URI || "https://riddlen.com/api/token/";

    console.log(`Network ${network.name}   deployer ${deployer.address}   game master ${gameMaster}`);
    console.log(`RDLN ${RDLN}   RON ${RON}`);
    console.log(`Commitments: mapRoot ${mapRoot}  prize ${prizeCommitment}`);
    console.log(`  launchAt ${new Date(launchAt * 1000).toISOString()}  price floor ${ethers.formatEther(basePrice)} RDLN  halving ${halving / 86400}d  total ${total}  spacing ${spacing}s`);
    console.log(`Funding ${ethers.formatEther(funding)} RDLN   baseURI ${baseURI}`);

    const roleAbi = ["function hasRole(bytes32,address) view returns (bool)", "function grantRole(bytes32,address)",
        "function DEFAULT_ADMIN_ROLE() view returns (bytes32)", "function GAME_ROLE() view returns (bytes32)",
        "function MINTER_ROLE() view returns (bytes32)", "function mintPrizePool(address,uint256)"];
    const rdln = await ethers.getContractAt(roleAbi, RDLN, deployer);
    const ron = await ethers.getContractAt(roleAbi, RON, deployer);
    const canGrantRdln = await rdln.hasRole(await rdln.DEFAULT_ADMIN_ROLE(), deployer.address);
    const canGrantRon = await ron.hasRole(await ron.DEFAULT_ADMIN_ROLE(), deployer.address);
    const canMint = await rdln.hasRole(await rdln.MINTER_ROLE(), deployer.address);
    console.log(`Deployer can grant RDLN GAME_ROLE: ${canGrantRdln}   RON GAME_ROLE: ${canGrantRon}   mint prizes: ${canMint}`);

    if (process.env.CONFIRM !== "yes") { console.log("\nDry run complete. Set CONFIRM=yes to deploy."); return; }

    const commitments = await (await ethers.getContractFactory("HuntCommitments"))
        .deploy(mapRoot, prizeCommitment, launchAt, basePrice, halving, total, spacing);
    await commitments.waitForDeployment();
    console.log(`HuntCommitments ${await commitments.getAddress()}`);

    const nft = await upgrades.deployProxy(await ethers.getContractFactory("HuntNFT"), [deployer.address, baseURI], { kind: "uups" });
    await nft.waitForDeployment();
    console.log(`HuntNFT proxy ${await nft.getAddress()}`);

    const hunt = await upgrades.deployProxy(await ethers.getContractFactory("RiddlenHunt"),
        [deployer.address, RDLN, RON, await nft.getAddress(), await commitments.getAddress()], { kind: "uups" });
    await hunt.waitForDeployment();
    const huntAddr = await hunt.getAddress();
    console.log(`RiddlenHunt proxy ${huntAddr}   implementation ${await upgrades.erc1967.getImplementationAddress(huntAddr)}`);

    await (await nft.grantRole(await nft.MINTER_ROLE(), huntAddr)).wait();
    await (await hunt.grantRole(await hunt.GAME_MASTER_ROLE(), gameMaster)).wait();
    console.log("MINTER_ROLE and GAME_MASTER_ROLE granted");
    if (canGrantRdln) { await (await rdln.grantRole(await rdln.GAME_ROLE(), huntAddr)).wait(); console.log("RDLN GAME_ROLE granted"); }
    else console.log("SKIPPED: RDLN GAME_ROLE (deployer is not RDLN admin)");
    if (canGrantRon) { await (await ron.grantRole(await ron.GAME_ROLE(), huntAddr)).wait(); console.log("RON GAME_ROLE granted"); }
    else console.log("SKIPPED: RON GAME_ROLE (deployer is not RON admin)");
    if (canMint && funding > 0n) { await (await rdln.mintPrizePool(huntAddr, funding)).wait(); console.log(`Funded with ${ethers.formatEther(funding)} RDLN`); }
    else console.log("SKIPPED: prize funding");

    const file = saveAddress({
        hunt: huntAddr, huntImplementation: await upgrades.erc1967.getImplementationAddress(huntAddr),
        nft: await nft.getAddress(), nftImplementation: await upgrades.erc1967.getImplementationAddress(await nft.getAddress()),
        commitments: await commitments.getAddress(), rdln: RDLN, ron: RON, mapRoot, prizeCommitment,
        launchAt, deployedAt: new Date().toISOString(),
    });
    console.log(`\nSaved to ${file}.`);
    console.log(`Site env: NEXT_PUBLIC_HUNT_ADDRESS=${huntAddr} NEXT_PUBLIC_HUNT_NFT_ADDRESS=${await nft.getAddress()} NEXT_PUBLIC_HUNT_COMMITMENTS_ADDRESS=${await commitments.getAddress()}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
