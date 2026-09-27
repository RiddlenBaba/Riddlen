const { ethers, upgrades, network } = require("hardhat");
const { gameAddress, saveAddress } = require("./lib");

/**
 * Upgrade the StumpTheMachine proxy to the current source. Validates the storage layout
 * against the OpenZeppelin manifest first (contracts/.openzeppelin/, gitignored).
 *   npx hardhat run scripts/stump/upgrade.js --network amoy             # validate only
 *   CONFIRM=yes npx hardhat run scripts/stump/upgrade.js --network amoy
 */
async function main() {
    const proxy = gameAddress();
    const factory = await ethers.getContractFactory("StumpTheMachine");
    const before = await upgrades.erc1967.getImplementationAddress(proxy);
    const game = await ethers.getContractAt("StumpTheMachine", proxy);
    const snapshot = { count: await game.challengeCount(), reserved: await game.reserved(), rdln: await game.rdln() };
    console.log(`${network.name} proxy ${proxy}  impl ${before}  challenges ${snapshot.count}  reserved ${ethers.formatEther(snapshot.reserved)}`);
    await upgrades.validateUpgrade(proxy, factory, { kind: "uups" });
    console.log("Storage layout validated.");
    if (process.env.CONFIRM !== "yes") { console.log("Dry run. Set CONFIRM=yes to upgrade."); return; }
    const upgraded = await upgrades.upgradeProxy(proxy, factory, { kind: "uups" });
    await upgraded.waitForDeployment();
    const after = await upgrades.erc1967.getImplementationAddress(proxy);
    const check = { count: await game.challengeCount(), reserved: await game.reserved(), rdln: await game.rdln() };
    if (check.count !== snapshot.count || check.reserved !== snapshot.reserved || check.rdln !== snapshot.rdln) {
        throw new Error("State changed across the upgrade; investigate before doing anything else");
    }
    console.log(`Upgraded: impl ${before} -> ${after}. MAX_ANSWERS = ${await game.MAX_ANSWERS()}. State unchanged.`);
    saveAddress({ implementation: after, upgradedAt: new Date().toISOString() });
}
main().catch((e) => { console.error(e); process.exit(1); });
