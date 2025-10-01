const { ethers } = require("hardhat");

async function main() {
    console.log("🎯 Setting up RiddlenAirdrop for testing...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Admin account:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC\n");

    // Contract addresses
    const AIRDROP_ADDRESS = "0x330275259AfCeC8822A861ecbbdfD026dB1B0A13";
    const RDLN_ADDRESS = "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";

    // Connect to contracts
    const airdrop = await ethers.getContractAt("RiddlenAirdrop", AIRDROP_ADDRESS);
    const rdln = await ethers.getContractAt("RDLNUpgradeable", RDLN_ADDRESS);

    console.log("📋 Step 1: Check RDLN balance and allowance");
    const adminBalance = await rdln.balanceOf(deployer.address);
    console.log("Your RDLN balance:", ethers.formatEther(adminBalance), "RDLN");

    // Fund amount for testing (50M required to activate Phase 1)
    const fundAmount = ethers.parseEther("50000000"); // 50M RDLN for Phase 1

    console.log("\n💰 Step 2: Transferring", ethers.formatEther(fundAmount), "RDLN to airdrop contract...");

    if (adminBalance < fundAmount) {
        console.error("❌ Insufficient RDLN balance. You need at least", ethers.formatEther(fundAmount), "RDLN");
        console.log("💡 Mint more RDLN tokens first or reduce test amount");
        process.exit(1);
    }

    const transferTx = await rdln.transfer(AIRDROP_ADDRESS, fundAmount);
    console.log("Transaction hash:", transferTx.hash);
    await transferTx.wait();

    const airdropBalance = await rdln.balanceOf(AIRDROP_ADDRESS);
    console.log("✅ Airdrop contract balance:", ethers.formatEther(airdropBalance), "RDLN");

    console.log("\n👤 Step 3: Granting OPERATOR_ROLE to admin (for testing)...");
    const OPERATOR_ROLE = await airdrop.OPERATOR_ROLE();
    const hasRole = await airdrop.hasRole(OPERATOR_ROLE, deployer.address);

    if (!hasRole) {
        const grantTx = await airdrop.grantRole(OPERATOR_ROLE, deployer.address);
        await grantTx.wait();
        console.log("✅ OPERATOR_ROLE granted to:", deployer.address);
    } else {
        console.log("✅ Already has OPERATOR_ROLE");
    }

    console.log("\n🚀 Step 4: Activating Phase 1...");
    const phase1Active = await airdrop.phase1Active();

    if (!phase1Active) {
        const activateTx = await airdrop.setPhaseActive(1, true);
        await activateTx.wait();
        console.log("✅ Phase 1 activated!");
    } else {
        console.log("✅ Phase 1 already active");
    }

    // Get current stats
    const [participants, remaining, balance] = await airdrop.getAirdropStats();

    console.log("\n📊 Airdrop Status:");
    console.log("================================");
    console.log("Contract Address:", AIRDROP_ADDRESS);
    console.log("RDLN Balance:", ethers.formatEther(balance), "RDLN");
    console.log("Phase 1 Active:", await airdrop.phase1Active());
    console.log("Phase 2 Active:", await airdrop.phase2Active());
    console.log("Participants:", participants.toString());
    console.log("Remaining Slots:", remaining.toString());
    console.log("Snapshot Taken:", await airdrop.snapshotTaken());
    console.log("================================");

    console.log("\n✅ Airdrop is ready for testing!");
    console.log("\n📝 Test Instructions:");
    console.log("1. Submit social proof: airdrop.submitSocialProof('twitterHandle', 'telegramHandle')");
    console.log("2. Verify as operator: airdrop.verifySocialProof(userAddress, true, true, true)");
    console.log("3. Claim Phase 1: airdrop.claimPhase1()");
    console.log("\n🌐 View on Polygonscan:");
    console.log("https://amoy.polygonscan.com/address/" + AIRDROP_ADDRESS);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Setup failed:");
        console.error(error);
        process.exit(1);
    });