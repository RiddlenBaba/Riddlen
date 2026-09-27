const { ethers, upgrades, network } = require("hardhat");

/**
 * Upgrade the live RDLN proxy to RDLNSplit: the game protocol split moves from
 * 50% burn / 25% grand prize / 25% treasury to 25% burn / 25% grand prize / 25% treasury /
 * 25% liquidity reserve. Nothing else changes; no storage is added or moved.
 *
 *   Dry run (default):  npx hardhat run scripts/upgrades/upgrade-rdln-split.js --network amoy
 *   Real upgrade:       CONFIRM_UPGRADE=yes npx hardhat run scripts/upgrades/upgrade-rdln-split.js --network amoy
 *                       (signer must hold UPGRADER_ROLE on the token)
 *   Optional after:     LIQUIDITY_WALLET=<address> to repoint the liquidity quarter (admin only)
 *
 * No OpenZeppelin manifest exists for Amoy, so the proxy is force-imported against RDLNDeployed,
 * the source believed deployed (research/README.md). The sanity reads below must look right
 * before confirming. RDLNSplit is over 24 KiB; Amoy accepts it, mainnet will not without a diet.
 */

const RDLN_PROXY = process.env.RDLN_PROXY_ADDRESS || "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";
const IMPL_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
const DEFAULT_UPGRADER = process.env.UPGRADER_ADDRESS || "0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040";

async function implementationOf(proxy) {
    const raw = await ethers.provider.getStorage(proxy, IMPL_SLOT);
    return ethers.getAddress("0x" + raw.slice(-40));
}

async function snapshot(t) {
    return {
        name: await t.name(), symbol: await t.symbol(), totalSupply: await t.totalSupply(),
        totalBurned: await t.totalBurned(), gameplayBurned: await t.gameplayBurned(),
        treasuryWallet: await t.treasuryWallet(), liquidityWallet: await t.liquidityWallet(),
        grandPrizeWallet: await t.grandPrizeWallet(), prizePoolMinted: await t.prizePoolMinted(),
        paused: await t.paused(),
    };
}

async function main() {
    const confirmed = process.env.CONFIRM_UPGRADE === "yes";
    const [signer] = await ethers.getSigners();
    const runner = signer ?? ethers.provider;
    const upgrader = signer?.address ?? DEFAULT_UPGRADER;
    console.log(`Network ${network.name}   signer ${signer ? signer.address : "none (read-only)"}   proxy ${RDLN_PROXY}`);

    if ((await ethers.provider.getCode(RDLN_PROXY)) === "0x") throw new Error("No contract at the proxy address on this network");
    const oldImpl = await implementationOf(RDLN_PROXY);
    console.log(`Current implementation ${oldImpl} (${(await ethers.provider.getCode(oldImpl)).length / 2 - 1} bytes)`);

    const Deployed = await ethers.getContractFactory("RDLNDeployed", signer);
    const Next = await ethers.getContractFactory("RDLNSplit", signer);
    const live = Deployed.attach(RDLN_PROXY).connect(runner);
    const before = await snapshot(live);
    console.log("Live state through the deployed layout:", before);
    if (before.symbol !== "RDLN" || before.totalSupply === 0n || before.treasuryWallet === ethers.ZeroAddress) {
        throw new Error("Sanity checks failed: the deployed layout may not match RDLNDeployed");
    }

    await upgrades.forceImport(RDLN_PROXY, Deployed, { kind: "uups" });
    await upgrades.validateUpgrade(RDLN_PROXY, Next, { kind: "uups" });
    console.log("OpenZeppelin storage-layout validation passed.");
    console.log(`New implementation initcode ${(Next.bytecode.length - 2) / 2} bytes`);

    const games = [
        ["StumpTheMachine", "0x660cEF782AEc87b0667De610B2077A9A4B81dB14"],
        ["RiddlenHunt", process.env.HUNT_ADDRESS || "0xa5a36d589B122d0306FEEa7422e3c7f7d8edf009"],
    ];
    for (const [n, a] of games) console.log(`${n} holds GAME_ROLE: ${await live.hasRole(await live.GAME_ROLE(), a)}`);
    const canUpgrade = await live.hasRole(await live.UPGRADER_ROLE(), upgrader);
    console.log(`${upgrader} holds UPGRADER_ROLE: ${canUpgrade}`);
    console.log(`Liquidity quarter will go to ${before.liquidityWallet}${before.liquidityWallet === before.treasuryWallet ? " (same as treasury; repoint with LIQUIDITY_WALLET)" : ""}`);

    if (!confirmed) { console.log("\nDry run complete. Set CONFIRM_UPGRADE=yes to upgrade."); return; }
    if (!signer) throw new Error("No signer configured (set PRIVATE_KEY)");
    if (!canUpgrade) throw new Error("Signer lacks UPGRADER_ROLE");

    console.log("\nUpgrading...");
    const upgraded = await upgrades.upgradeProxy(RDLN_PROXY, Next, { kind: "uups" });
    await upgraded.waitForDeployment();
    let newImpl = await implementationOf(RDLN_PROXY);
    for (let i = 0; i < 30 && newImpl === oldImpl; i++) { await new Promise((r) => setTimeout(r, 3000)); newImpl = await implementationOf(RDLN_PROXY); }
    if (newImpl === oldImpl) throw new Error("Implementation unchanged after 90s; verify on the explorer before retrying");
    console.log(`New implementation ${newImpl}`);

    const after = await snapshot(upgraded);
    for (const k of Object.keys(before)) if (before[k] !== after[k]) throw new Error(`State changed across upgrade: ${k} ${before[k]} -> ${after[k]}`);
    console.log(`State preserved. protocolVersion() = ${await upgraded.protocolVersion()}`);

    if (process.env.LIQUIDITY_WALLET) {
        await (await upgraded.setLiquidityWallet(process.env.LIQUIDITY_WALLET)).wait();
        console.log(`Liquidity wallet set to ${process.env.LIQUIDITY_WALLET}`);
    }
    console.log("\nEvery game payment now splits 25% burn / 25% grand prize / 25% treasury / 25% liquidity. Update docs/hunt.md, docs/next.md and docs/tokens.md.");
}

main().catch((e) => { console.error(e); process.exit(1); });
