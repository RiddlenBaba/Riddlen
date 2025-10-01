const hre = require("hardhat");

async function main() {
  const airdropAddress = "0x8345ba8DA61F0192BF421B8A039BC972F3f74d4b";
  const rdlnAddress = "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";

  console.log("\n🚀 Activating Airdrop Contract...\n");

  const [signer] = await hre.ethers.getSigners();
  console.log("Signer:", signer.address);
  console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(signer.address)), "MATIC");

  // Get contracts
  const Airdrop = await hre.ethers.getContractAt("RiddlenAirdrop", airdropAddress);
  const RDLN = await hre.ethers.getContractAt("RDLN", rdlnAddress);

  console.log("\n📊 Current Status:");

  try {
    // Check if initialized
    const rdlnToken = await Airdrop.rdlnToken();
    const ronToken = await Airdrop.ronToken();
    console.log("RDLN Token:", rdlnToken);
    console.log("RON Token:", ronToken);

    const phase1Active = await Airdrop.phase1Active();
    const phase2Active = await Airdrop.phase2Active();
    console.log("Phase 1 Active:", phase1Active);
    console.log("Phase 2 Active:", phase2Active);

    // Check contract balance
    const contractBalance = await RDLN.balanceOf(airdropAddress);
    console.log("Contract RDLN Balance:", hre.ethers.formatEther(contractBalance), "RDLN");

    // Check signer balance
    const signerBalance = await RDLN.balanceOf(signer.address);
    console.log("Your RDLN Balance:", hre.ethers.formatEther(signerBalance), "RDLN");

    // Step 1: Fund the contract if needed
    if (contractBalance < hre.ethers.parseEther("100000000")) {
      console.log("\n💰 Funding airdrop contract with 100M RDLN...");
      const fundAmount = hre.ethers.parseEther("100000000");

      const fundTx = await RDLN.transfer(airdropAddress, fundAmount);
      console.log("Transaction sent:", fundTx.hash);
      await fundTx.wait();
      console.log("✅ Contract funded!");

      const newBalance = await RDLN.balanceOf(airdropAddress);
      console.log("New Contract Balance:", hre.ethers.formatEther(newBalance), "RDLN");
    } else {
      console.log("✅ Contract already has sufficient RDLN");
    }

    // Step 2: Activate Phase 1 if not active
    if (!phase1Active) {
      console.log("\n🎯 Activating Phase 1...");
      const activateTx = await Airdrop.setPhaseActive(1, true);
      console.log("Transaction sent:", activateTx.hash);
      await activateTx.wait();
      console.log("✅ Phase 1 activated!");
    } else {
      console.log("✅ Phase 1 already active");
    }

    // Final status
    console.log("\n📈 Final Status:");
    const stats = await Airdrop.getAirdropStats();
    console.log("Phase 1 Participants:", stats[0].toString());
    console.log("Phase 1 Remaining:", stats[1].toString());
    console.log("Contract Balance:", hre.ethers.formatEther(stats[2]), "RDLN");

    const perWallet = await Airdrop.PHASE1_PER_WALLET();
    console.log("Per Wallet Amount:", hre.ethers.formatEther(perWallet), "RDLN");

    console.log("\n✅ Airdrop is ready to accept claims!");
    console.log("\n📝 Users can now:");
    console.log("1. Submit social proof (Twitter + Telegram handles)");
    console.log("2. Wait for operator verification");
    console.log("3. Claim 10,000 RDLN tokens");

  } catch (error) {
    console.error("\n❌ Error:", error.message);

    if (error.message.includes("execution reverted")) {
      console.log("\n🔍 Possible issues:");
      console.log("- Contract might not be initialized");
      console.log("- You might not have admin/operator role");
      console.log("- Contract might be paused");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });