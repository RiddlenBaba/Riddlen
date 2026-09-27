const { ethers, upgrades, network } = require("hardhat");

/**
 * Upgrade the deployed RiddleNFTAdvanced proxy to the commit-reveal implementation.
 *
 * Modes:
 *   Dry run (default)   — reads live state, registers the proxy against the deployed layout,
 *                         validates the upgrade. Sends no transactions.
 *     npx hardhat run scripts/upgrades/upgrade-nft-commit-reveal.js --network amoy
 *
 *   Fork rehearsal      — upgrade on a local fork while impersonating the upgrader.
 *     npx hardhat node --fork <AMOY_RPC_URL>
 *     SIMULATE_AS=<upgrader address> npx hardhat run scripts/upgrades/upgrade-nft-commit-reveal.js --network localhost
 *
 *   Real upgrade        — signer must hold UPGRADER_ROLE on the proxy.
 *     CONFIRM_UPGRADE=yes npx hardhat run scripts/upgrades/upgrade-nft-commit-reveal.js --network amoy
 *
 * No .openzeppelin manifest exists for Amoy, so the proxy is force-imported against
 * RiddleNFTAdvancedDeployed (the source believed deployed; see research/README.md).
 * Storage-layout validation is therefore only as good as that belief — check the
 * sanity reads below match expectations before confirming.
 */

const NFT_PROXY = process.env.NFT_PROXY_ADDRESS || "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";
const EXPECTED_RDLN = process.env.EXPECTED_RDLN || "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";
const EXPECTED_RON = process.env.EXPECTED_RON || "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635";
const IMPL_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
// Checked for UPGRADER_ROLE when no signer is configured (dry run needs no private key)
const DEFAULT_UPGRADER = process.env.UPGRADER_ADDRESS || "0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040";

async function snapshot(nft) {
    return {
        rdlnToken: await nft.rdlnToken(),
        ronToken: await nft.ronToken(),
        currentSessionId: await nft.currentSessionId(),
        currentQuestionId: await nft.currentQuestionId(),
        deploymentTime: await nft.deploymentTime(),
        treasuryWallet: await nft.treasuryWallet(),
        emergencyMode: await nft.emergencyMode(),
    };
}

async function implementationOf(proxy) {
    const raw = await ethers.provider.getStorage(proxy, IMPL_SLOT);
    return ethers.getAddress("0x" + raw.slice(-40));
}

async function main() {
    const simulateAs = process.env.SIMULATE_AS;
    const confirmed = process.env.CONFIRM_UPGRADE === "yes";

    let signer;
    if (simulateAs) {
        if (network.name !== "localhost" && network.name !== "hardhat") {
            throw new Error("SIMULATE_AS only works on a local fork (--network localhost)");
        }
        // Hardhat has no hardfork history for chain 80002, so calls at the fork block itself fail.
        // Mining a local block makes every later call execute on local state.
        await network.provider.send("hardhat_mine", ["0x1"]);
        await network.provider.request({ method: "hardhat_impersonateAccount", params: [simulateAs] });
        await network.provider.send("hardhat_setBalance", [simulateAs, "0x56BC75E2D63100000"]);
        signer = await ethers.getSigner(simulateAs);
    } else {
        [signer] = await ethers.getSigners();
    }

    // Without a configured key the dry run is read-only; a real upgrade needs a signer
    const runner = signer ?? ethers.provider;
    const upgraderAddress = signer?.address ?? DEFAULT_UPGRADER;
    console.log(`Network: ${network.name}`);
    console.log(`Signer:  ${signer ? signer.address : "none (read-only dry run)"}`);
    console.log(`Proxy:   ${NFT_PROXY}`);

    const code = await ethers.provider.getCode(NFT_PROXY);
    if (code === "0x") throw new Error("No contract at proxy address on this network");

    const oldImpl = await implementationOf(NFT_PROXY);
    const oldImplSize = (await ethers.provider.getCode(oldImpl)).length / 2 - 1;
    console.log(`Current implementation: ${oldImpl} (${oldImplSize} bytes)`);

    const Deployed = await ethers.getContractFactory("RiddleNFTAdvancedDeployed", signer);
    const Next = await ethers.getContractFactory("RiddleNFTAdvanced", signer);
    const live = Deployed.attach(NFT_PROXY).connect(runner);

    const before = await snapshot(live);
    console.log("\nLive state (read through the deployed layout):", before);

    const problems = [];
    if (before.rdlnToken !== EXPECTED_RDLN) problems.push(`rdlnToken is ${before.rdlnToken}, expected ${EXPECTED_RDLN}`);
    if (before.ronToken !== EXPECTED_RON) problems.push(`ronToken is ${before.ronToken}, expected ${EXPECTED_RON}`);
    if (before.currentSessionId === 0n) problems.push("currentSessionId is 0; layout may not match");
    if (problems.length) {
        console.error("\nSanity checks failed — the deployed layout may differ from RiddleNFTAdvancedDeployed:");
        problems.forEach((p) => console.error(`  - ${p}`));
        process.exit(1);
    }
    console.log("Sanity checks passed: token addresses sit where the deployed layout says.");

    const nextSize = (Next.bytecode.length - 2) / 2;
    console.log(`\nNew implementation initcode: ${nextSize} bytes`);

    await upgrades.forceImport(NFT_PROXY, Deployed, { kind: "uups" });
    await upgrades.validateUpgrade(NFT_PROXY, Next, { kind: "uups" });
    console.log("OpenZeppelin storage-layout validation passed.");

    const rdln = (await ethers.getContractAt("RDLNDeployed", before.rdlnToken)).connect(runner);
    const nftHasRdlnGameRole = await rdln.hasRole(await rdln.GAME_ROLE(), NFT_PROXY);
    const prizeBalance = await rdln.balanceOf(NFT_PROXY);
    console.log(`NFT holds RDLN GAME_ROLE: ${nftHasRdlnGameRole}${nftHasRdlnGameRole ? "" : "  <-- mints will revert until granted"}`);
    console.log(`NFT RDLN balance (prize funds): ${ethers.formatEther(prizeBalance)}`);

    const canUpgrade = await live.hasRole(await live.UPGRADER_ROLE(), upgraderAddress);
    console.log(`${upgraderAddress} holds UPGRADER_ROLE: ${canUpgrade}`);

    if (!simulateAs && !confirmed) {
        console.log("\nDry run complete. Set CONFIRM_UPGRADE=yes to upgrade.");
        return;
    }
    if (!signer) throw new Error("No signer configured for this network (set PRIVATE_KEY for the upgrader)");
    if (!canUpgrade) throw new Error("Signer lacks UPGRADER_ROLE");

    console.log("\nUpgrading...");
    const upgraded = await upgrades.upgradeProxy(NFT_PROXY, Next, { kind: "uups" });
    await upgraded.waitForDeployment();
    // Load-balanced public RPCs can serve stale state right after a tx; wait for the new implementation
    let newImpl = await implementationOf(NFT_PROXY);
    for (let i = 0; i < 30 && newImpl === oldImpl; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        newImpl = await implementationOf(NFT_PROXY);
    }
    if (newImpl === oldImpl) {
        throw new Error(`Implementation still ${oldImpl} after 90s — verify on a block explorer before retrying`);
    }
    console.log(`New implementation: ${newImpl}`);

    const after = await snapshot(upgraded);
    for (const key of Object.keys(before)) {
        if (before[key] !== after[key]) {
            throw new Error(`State changed across upgrade: ${key} ${before[key]} -> ${after[key]}`);
        }
    }
    console.log("State preserved across upgrade.");

    console.log(`
Next steps:
  0. Grant RDLN GAME_ROLE to the NFT if missing: RDLN.grantRole(GAME_ROLE, ${NFT_PROXY}) — mints and penalties revert without it.
  1. Fund prizes: RDLN.mintPrizePool(${NFT_PROXY}, <amount>) — prizes are paid from the NFT's balance.
  2. For each new session: createRiddleSession -> commitSolution(sessionId, keccak256(abi.encode(nft, sessionId, answers, salt))) -> startRiddleSession.
     Keep the salt secret until the session ends; use a game-master key that never plays.
  3. After endTime: revealSolution(sessionId, answers, salt); after REVEAL_WINDOW: finalizeSession(sessionId, maxSteps).
  4. Update the frontend (frontend-staging first) to the commit/reveal flow.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
