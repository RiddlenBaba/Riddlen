const { runPanel, panelModels } = require("./lib");

/**
 * Try the AI panel on a riddle without touching the chain. Useful for authors testing whether
 * their riddle stumps the machines before staking.
 *   RIDDLE="What has keys but no locks?" npx hardhat run scripts/stump/panel-dry-run.js
 */
async function main() {
    const riddle = process.env.RIDDLE;
    if (!riddle) throw new Error("Set RIDDLE");
    console.log(`Panel: ${panelModels().join(", ")}\n${riddle}\n`);
    const { panelAnswers } = await runPanel(riddle);
    console.log(`\nDistinct panel answers (${panelAnswers.length}): ${panelAnswers.join(" | ")}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
