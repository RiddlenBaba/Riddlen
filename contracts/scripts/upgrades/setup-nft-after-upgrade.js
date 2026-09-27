const { ethers, network } = require("hardhat");

/**
 * One-time setup after the commit-reveal upgrade:
 *   1. Grant RDLN GAME_ROLE to the NFT (mints and penalties revert without it)
 *   2. Fund prizes by minting from the 700M prize-pool allocation to the NFT
 *
 * Dry run (default):
 *   PRIZE_FUND=10000000 npx hardhat run scripts/upgrades/setup-nft-after-upgrade.js --network amoy
 * Fork rehearsal:
 *   SIMULATE_AS=<admin> CONFIRM_SETUP=yes PRIZE_FUND=... npx hardhat run ... --network localhost
 * Execute:
 *   CONFIRM_SETUP=yes PRIZE_FUND=10000000 npx hardhat run scripts/upgrades/setup-nft-after-upgrade.js --network amoy
 *
 * PRIZE_FUND is in whole RDLN. Each session's prize pool is randomized between 100K and 10M
 * RDLN and paid from the NFT's balance, so fund at least the pools of the sessions you plan to run.
 */

const NFT_PROXY = process.env.NFT_PROXY_ADDRESS || "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";

async function waitFor(check, label) {
    for (let i = 0; i < 30; i++) {
        if (await check()) return;
        await new Promise((r) => setTimeout(r, 3000));
    }
    throw new Error(`${label} not visible after 90s — verify on a block explorer before retrying`);
}

async function main() {
    let signer;
    if (process.env.SIMULATE_AS) {
        if (network.name !== "localhost") throw new Error("SIMULATE_AS only works on a local fork");
        await network.provider.send("hardhat_mine", ["0x1"]);
        await network.provider.request({ method: "hardhat_impersonateAccount", params: [process.env.SIMULATE_AS] });
        await network.provider.send("hardhat_setBalance", [process.env.SIMULATE_AS, "0x56BC75E2D63100000"]);
        signer = await ethers.getSigner(process.env.SIMULATE_AS);
    } else {
        [signer] = await ethers.getSigners();
    }
    if (!signer) throw new Error("No signer configured (set PRIVATE_KEY)");
    const confirmed = process.env.CONFIRM_SETUP === "yes";
    const fund = process.env.PRIZE_FUND ? ethers.parseEther(process.env.PRIZE_FUND) : 0n;

    const nft = await ethers.getContractAt("RiddleNFTAdvanced", NFT_PROXY, signer);
    await nft.getCommitRevealState(0).catch(() => {
        throw new Error("NFT is not on the commit-reveal implementation yet");
    });
    const rdln = await ethers.getContractAt("RDLNDeployed", await nft.rdlnToken(), signer);

    const GAME_ROLE = await rdln.GAME_ROLE();
    const hasGameRole = await rdln.hasRole(GAME_ROLE, NFT_PROXY);
    const isAdmin = await rdln.hasRole(ethers.ZeroHash, signer.address);
    const isMinter = await rdln.hasRole(await rdln.MINTER_ROLE(), signer.address);
    const balance = await rdln.balanceOf(NFT_PROXY);
    const remaining = (await rdln.PRIZE_POOL_ALLOCATION()) - (await rdln.prizePoolMinted());

    console.log(`Network: ${network.name}   Signer: ${signer.address}`);
    console.log(`NFT ${NFT_PROXY}`);
    console.log(`  RDLN GAME_ROLE:        ${hasGameRole}`);
    console.log(`  RDLN balance:          ${ethers.formatEther(balance)}`);
    console.log(`Prize allocation left:   ${ethers.formatEther(remaining)}`);
    console.log(`Signer is RDLN admin:    ${isAdmin}   minter: ${isMinter}`);

    const plan = [];
    if (!hasGameRole) plan.push("grant RDLN GAME_ROLE to the NFT");
    if (fund > 0n) plan.push(`mint ${ethers.formatEther(fund)} RDLN from the prize-pool allocation to the NFT`);
    if (!plan.length) {
        console.log("\nNothing to do. (Set PRIZE_FUND to fund prizes.)");
        return;
    }
    console.log("\nPlan:");
    plan.forEach((p) => console.log(`  - ${p}`));

    if (!hasGameRole && !isAdmin) throw new Error("Signer can't grant roles on RDLN");
    if (fund > 0n && !isMinter) throw new Error("Signer lacks MINTER_ROLE on RDLN");
    if (fund > remaining) throw new Error("PRIZE_FUND exceeds the remaining prize-pool allocation");

    if (!confirmed) {
        console.log("\nDry run complete. Set CONFIRM_SETUP=yes to execute.");
        return;
    }

    if (!hasGameRole) {
        const tx = await rdln.grantRole(GAME_ROLE, NFT_PROXY);
        console.log(`grantRole tx: ${tx.hash}`);
        await tx.wait();
        await waitFor(() => rdln.hasRole(GAME_ROLE, NFT_PROXY), "GAME_ROLE grant");
        console.log("GAME_ROLE granted.");
    }
    if (fund > 0n) {
        const tx = await rdln.mintPrizePool(NFT_PROXY, fund);
        console.log(`mintPrizePool tx: ${tx.hash}`);
        await tx.wait();
        await waitFor(async () => (await rdln.balanceOf(NFT_PROXY)) >= balance + fund, "Prize funding");
        console.log(`NFT prize balance: ${ethers.formatEther(await rdln.balanceOf(NFT_PROXY))} RDLN`);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
