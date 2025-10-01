const hre = require("hardhat");

async function main() {
  const airdropAddress = "0x8345ba8DA61F0192BF421B8A039BC972F3f74d4b";
  const rdlnAddress = "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";
  const ronAddress = "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635";

  console.log("\n🔧 Initializing Airdrop Contract...\n");

  const [signer] = await hre.ethers.getSigners();
  console.log("Signer:", signer.address);

  const Airdrop = await hre.ethers.getContractAt("RiddlenAirdrop", airdropAddress);

  try {
    console.log("Attempting to initialize contract...");
    const tx = await Airdrop.initialize(rdlnAddress, ronAddress, signer.address);
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("✅ Contract initialized!");

  } catch (error) {
    if (error.message.includes("InvalidInitialization") || error.message.includes("Initializable: contract is already initialized")) {
      console.log("✅ Contract is already initialized");

      // If already initialized, let's test a read call
      try {
        console.log("\nTesting contract state...");
        const rdln = await Airdrop.rdlnToken();
        const ron = await Airdrop.ronToken();
        console.log("RDLN Token:", rdln);
        console.log("RON Token:", ron);

        const phase1Active = await Airdrop.phase1Active();
        const phase2Active = await Airdrop.phase2Active();
        console.log("Phase 1 Active:", phase1Active);
        console.log("Phase 2 Active:", phase2Active);

        const stats = await Airdrop.getAirdropStats();
        console.log("\n📊 Stats:");
        console.log("Participants:", stats[0].toString());
        console.log("Remaining:", stats[1].toString());
        console.log("Balance:", hre.ethers.formatEther(stats[2]), "RDLN");

      } catch (readError) {
        console.error("❌ Error reading contract state:", readError.message);
      }

    } else {
      console.error("❌ Error:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });