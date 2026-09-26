const { ethers, network } = require("hardhat");

/**
 * Plays a full commit-reveal game on a local fork of Amoy, against the real deployed RDLN
 * and RON bytecode, after the NFT has been upgraded. Sends nothing to a real network.
 *
 *   npx hardhat node --fork https://polygon-amoy-bor-rpc.publicnode.com
 *   SIMULATE_AS=<deployer> npx hardhat run scripts/upgrades/upgrade-nft-commit-reveal.js --network localhost
 *   DEPLOYER=<deployer> npx hardhat run scripts/upgrades/rehearse-game-on-fork.js --network localhost
 */

const NFT_PROXY = process.env.NFT_PROXY_ADDRESS || "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";
const coder = ethers.AbiCoder.defaultAbiCoder();
const E = (n) => ethers.parseEther(String(n));

async function increase(seconds) {
    await network.provider.send("evm_increaseTime", [seconds]);
    await network.provider.send("evm_mine");
}

async function main() {
    if (network.name !== "localhost") throw new Error("Fork only: run with --network localhost");
    const deployerAddress = process.env.DEPLOYER;
    if (!deployerAddress) throw new Error("Set DEPLOYER to the address holding admin roles");

    // Hardhat has no hardfork history for chain 80002, so calls at the fork block itself fail.
    // Mining a local block makes every later call execute on local state.
    await network.provider.send("hardhat_mine", ["0x1"]);
    await network.provider.request({ method: "hardhat_impersonateAccount", params: [deployerAddress] });
    await network.provider.send("hardhat_setBalance", [deployerAddress, "0x56BC75E2D63100000"]);
    const admin = await ethers.getSigner(deployerAddress);
    const [, alice, bob, carol] = await ethers.getSigners();

    const nft = await ethers.getContractAt("RiddleNFTAdvanced", NFT_PROXY, admin);
    await nft.getCommitRevealState(0).catch(() => {
        throw new Error("NFT is not upgraded on this fork yet — run the upgrade script with SIMULATE_AS first");
    });
    const rdln = await ethers.getContractAt("RDLNDeployed", await nft.rdlnToken(), admin);
    const ron = await ethers.getContractAt("RONAdvanced", await nft.ronToken(), admin);

    const GAME_ROLE = await rdln.GAME_ROLE();
    if (!(await rdln.hasRole(GAME_ROLE, NFT_PROXY))) {
        await rdln.grantRole(GAME_ROLE, NFT_PROXY);
        console.log("Granted RDLN GAME_ROLE to the NFT");
    }

    await rdln.mintPrizePool(NFT_PROXY, E(20_000_000));
    for (const p of [alice, bob, carol]) await rdln.mintPrizePool(p.address, E(5_000));

    const answers = ["echo"];
    const salt = ethers.hexlify(ethers.randomBytes(32));
    await nft.createRiddleSession("Fork rehearsal", "I speak without a mouth and hear without ears. What am I?",
        "classic", 0, [], 3600);
    const sessionId = (await nft.currentSessionId()) - 1n;
    await nft.commitSolution(sessionId, ethers.keccak256(coder.encode(
        ["address", "uint256", "string[]", "bytes32"], [NFT_PROXY, sessionId, answers, salt]
    )));
    await nft.startRiddleSession(sessionId);
    console.log(`Session ${sessionId} started`);

    const plays = [[alice, ["echo"]], [bob, ["shadow"]], [carol, ["echo"]]];
    const start = {};
    const nonces = {};
    for (const [p] of plays) start[p.address] = await rdln.balanceOf(p.address);
    for (const [p] of plays) {
        await increase(31);
        await nft.connect(p).mintRiddleAccess(sessionId);
    }
    for (const [p, a] of plays) {
        await increase(31);
        nonces[p.address] = ethers.hexlify(ethers.randomBytes(32));
        await nft.connect(p).commitAnswer(sessionId, ethers.keccak256(coder.encode(
            ["address", "address", "uint256", "string[]", "bytes32"],
            [NFT_PROXY, p.address, sessionId, a, nonces[p.address]]
        )));
    }

    await increase(3600);
    await nft.revealSolution(sessionId, answers, salt);
    for (const [p, a] of plays) await nft.connect(p).revealAnswer(sessionId, a, nonces[p.address]);
    await increase(2 * 24 * 3600 + 1);
    const receipt = await (await nft.finalizeSession(sessionId, 10)).wait();
    const ronFailures = receipt.logs.filter((l) => {
        try { return nft.interface.parseLog(l)?.name === "RONAwardFailed"; } catch { return false; }
    }).length;

    const results = [];
    for (const [p, a] of plays) {
        const tokenId = await nft.tokenOfOwnerByIndex(p.address, 0);
        const [, , , successful, prize] = await nft.getParticipantData(tokenId);
        if (prize > 0n) await nft.connect(p).claimPrize(tokenId);
        results.push({
            player: p.address.slice(0, 10),
            answer: a[0],
            solved: successful,
            prizeRDLN: ethers.formatEther(prize),
            netRDLN: ethers.formatEther((await rdln.balanceOf(p.address)) - start[p.address]),
            RON: (await ron.balanceOf(p.address)).toString(),
        });
    }
    console.table(results);
    console.log(`RONAwardFailed events: ${ronFailures}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
