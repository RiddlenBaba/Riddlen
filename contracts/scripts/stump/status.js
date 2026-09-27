const { ethers, network } = require("hardhat");
const { gameAddress, STATUS, OUTCOME, DIFFICULTY } = require("./lib");

// Read-only overview of the deployed game: funding, roles and every challenge.
//   npx hardhat run scripts/stump/status.js --network amoy
async function main() {
    const address = gameAddress();
    const g = await ethers.getContractAt("StumpTheMachine", address);
    const roleAbi = ["function hasRole(bytes32,address) view returns (bool)", "function GAME_ROLE() view returns (bytes32)"];
    const rdln = await ethers.getContractAt(roleAbi, await g.rdln());
    const ron = await ethers.getContractAt(roleAbi, await g.ron());
    console.log(`StumpTheMachine ${address} on ${network.name}`);
    console.log(`Available RDLN: ${ethers.formatEther(await g.available())}   Reserved: ${ethers.formatEther(await g.reserved())}`);
    console.log(`RDLN GAME_ROLE: ${await rdln.hasRole(await rdln.GAME_ROLE(), address)}   RON GAME_ROLE: ${await ron.hasRole(await ron.GAME_ROLE(), address)}`);
    const pools = await Promise.all([0, 1, 2, 3].map((d) => g.poolByDifficulty(d)));
    const costs = await Promise.all([0, 1, 2, 3].map((d) => g.entryCostByDifficulty(d)));
    console.log(`Pots: ${pools.map((p, d) => `${DIFFICULTY[d]} ${ethers.formatEther(p)}/${ethers.formatEther(costs[d])} entry`).join("  ")}`);
    const count = await g.challengeCount();
    console.log(`Challenges: ${count}`);
    for (let id = 1n; id <= count; id++) {
        const c = await g.getChallenge(id);
        console.log(`  #${id} ${STATUS[Number(c.status)]}${Number(c.status) === 5 ? `/${OUTCOME[Number(c.outcome)]}` : ""} [${DIFFICULTY[Number(c.difficulty)]}] ` +
            `entrants ${c.entrants} correct ${c.correct} closes ${c.endTime ? new Date(Number(c.endTime) * 1000).toISOString() : "-"}\n     ${c.riddle.slice(0, 100)}`);
    }
}
main().catch((e) => { console.error(e); process.exit(1); });
