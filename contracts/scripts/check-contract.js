const hre = require("hardhat");

async function main() {
  const address = "0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040";

  console.log("Checking contract at:", address);

  // Check if contract exists
  const code = await hre.ethers.provider.getCode(address);
  console.log("\nContract code length:", code.length);
  console.log("Has code:", code !== "0x");

  if (code === "0x") {
    console.log("❌ No contract deployed at this address!");
    return;
  }

  // Try to call some basic view functions
  try {
    const [signer] = await hre.ethers.getSigners();
    console.log("\nSigner address:", signer.address);

    const RiddlenAirdrop = await hre.ethers.getContractFactory("RiddlenAirdrop");
    const airdrop = RiddlenAirdrop.attach(address);

    // Try basic view functions
    console.log("\nTrying to read contract state...");

    const phase1Active = await airdrop.phase1Active();
    console.log("Phase 1 Active:", phase1Active);

    const phase2Active = await airdrop.phase2Active();
    console.log("Phase 2 Active:", phase2Active);

    const participants = await airdrop.phase1Participants();
    console.log("Phase 1 Participants:", participants.toString());

    const rdlnAddress = await airdrop.rdlnToken();
    console.log("RDLN Token:", rdlnAddress);

    const ronAddress = await airdrop.ronToken();
    console.log("RON Token:", ronAddress);

  } catch (error) {
    console.log("❌ Error reading contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });