const { ethers, network } = require("hardhat");
const { house, DIFFICULTY } = require("./lib");

// Read-only overview of the hunt: funding, roles, commitments and every riddle.
//   npx hardhat run scripts/hunt/status.js --network amoy
async function main() {
    const { hunt, nft, commitments, address } = await house();
    const roleAbi = ["function hasRole(bytes32,address) view returns (bool)", "function GAME_ROLE() view returns (bytes32)"];
    const rdln = await ethers.getContractAt(roleAbi, await hunt.rdln());
    const ron = await ethers.getContractAt(roleAbi, await hunt.ron());
    console.log(`RiddlenHunt ${address} on ${network.name}   NFT ${await nft.getAddress()}   commitments ${await commitments.getAddress()}`);
    console.log(`Available RDLN ${ethers.formatEther(await hunt.available())}   reserved ${ethers.formatEther(await hunt.reserved())}   mint price now ${ethers.formatEther(await hunt.mintPrice())}`);
    console.log(`RDLN GAME_ROLE ${await rdln.hasRole(await rdln.GAME_ROLE(), address)}   RON GAME_ROLE ${await ron.hasRole(await ron.GAME_ROLE(), address)}   NFT minter ${await nft.hasRole(await nft.MINTER_ROLE(), address)}`);
    console.log(`Commitments: mapRoot ${await commitments.mapRoot()}  prize ${await commitments.prizeCommitment()}  total ${await commitments.totalRiddles()}  launch ${new Date(Number(await commitments.launchAt()) * 1000).toISOString()}`);
    const pots = await Promise.all([0, 1, 2, 3].map((d) => hunt.potByDifficulty(d)));
    console.log(`Pots ${pots.map((p, d) => `${DIFFICULTY[d]} ${ethers.formatEther(p)}`).join("  ")}   claim fee ${ethers.formatEther(await hunt.claimFee())}   step ${ethers.formatEther(await hunt.attemptStep())}   first ${await hunt.firstFinderBps()} bps   window ${Number(await hunt.finisherWindow()) / 86400}d`);
    const count = Number(await hunt.riddleCount());
    console.log(`Riddles ${count}   tokens minted ${Number(await nft.nextId()) - 1}`);
    for (let id = 1; id <= count; id++) {
        const r = await hunt.getRiddle(id);
        const state = !r.opened ? "released" : r.settled ? "settled" : r.firstClaimAt ? "found" : "open";
        console.log(`  #${id} ${state} [${DIFFICULTY[Number(r.difficulty)]}] pot ${ethers.formatEther(r.pot)}  nfts ${r.minted}/${r.nftCount}  claims ${r.claimCount} (${r.finisherCount} in window)  cache ${r.cacheSigner}\n     ${r.text.slice(0, 100)}`);
    }
}
main().catch((e) => { console.error(e); process.exit(1); });
