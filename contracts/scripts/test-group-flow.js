const { ethers } = require("hardhat");

/**
 * Test Complete Group Flow
 *
 * Steps:
 * 1. Check if test NFT exists, mint if needed
 * 2. Convert NFT to group
 * 3. Have member(s) join group
 * 4. Finalize group
 * 5. Activate group session
 * 6. Make group attempt
 * 7. Verify completion
 */

async function main() {
  console.log("\n🧪 Testing Complete Group Flow...\n");

  const [deployer, member2, member3] = await ethers.getSigners();
  console.log("📝 Test Accounts:");
  console.log("   Creator:", deployer.address);
  console.log("   Member 2:", member2?.address || "N/A");
  console.log("   Member 3:", member3?.address || "N/A");
  console.log();

  // ============ CONTRACT ADDRESSES ============

  const NFT_ADDRESS = "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";
  const GROUP_MANAGER = "0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899";
  const GROUP_VALIDATOR = "0xC058fdB7b4B5062EC844bF97c45bdD28bdcf6CE6";
  const RDLN_TOKEN = "0x133029184EC460F661d05b0dC57BFC916b4AB0eB";

  console.log("📋 Contract Addresses:");
  console.log("   NFT:", NFT_ADDRESS);
  console.log("   GroupManager:", GROUP_MANAGER);
  console.log("   GroupValidator:", GROUP_VALIDATOR);
  console.log("   RDLN:", RDLN_TOKEN);
  console.log();

  // ============ CONNECT TO CONTRACTS ============

  const nft = await ethers.getContractAt("RiddleNFTAdvancedV2", NFT_ADDRESS);
  const groupManager = await ethers.getContractAt("RiddleGroupManager", GROUP_MANAGER);
  const groupValidator = await ethers.getContractAt("GroupCompositionValidator", GROUP_VALIDATOR);
  const rdln = await ethers.getContractAt("IRDLN", RDLN_TOKEN);

  // ============ STEP 0: CHECK PERMISSIONS ============

  console.log("🔍 Step 0: Checking permissions...");

  const NFT_CONTRACT_ROLE = await groupManager.NFT_CONTRACT_ROLE();
  const hasRole = await groupManager.hasRole(NFT_CONTRACT_ROLE, NFT_ADDRESS);

  console.log("   NFT has NFT_CONTRACT_ROLE:", hasRole);

  if (!hasRole) {
    console.log("\n❌ ERROR: NFT doesn't have required role!");
    console.log("   Run: npx hardhat run scripts/grant-nft-role.js --network amoy");
    return;
  }

  console.log("✅ Permissions verified!");
  console.log();

  // ============ STEP 1: CHECK/MINT NFT ============

  console.log("🎫 Step 1: Checking for test NFT...");

  const balance = await nft.balanceOf(deployer.address);
  console.log("   NFT balance:", balance.toString());

  let tokenId;

  if (balance > 0) {
    // Use existing NFT
    tokenId = await nft.tokenOfOwnerByIndex(deployer.address, 0);
    console.log("   Using existing NFT:", tokenId.toString());

    // Check if already a group
    const isGroup = await nft.isNFTGroup(tokenId);
    if (isGroup) {
      console.log("   ⚠️  NFT already converted to group");
      const groupId = await nft.getGroupId(tokenId);
      console.log("   Group ID:", groupId.toString());

      // Show group info
      const state = await groupManager.getGroupState(groupId);
      const members = await groupManager.getGroupMembers(groupId);
      console.log("   State:", ["FORMING", "RESERVED", "ACTIVE", "COMPLETED", "DISBANDED"][state]);
      console.log("   Members:", members.length);
      console.log();
      return;
    }
  } else {
    console.log("\n⚠️  No NFTs found for testing!");
    console.log("   You need to mint an NFT first.");
    console.log("   This requires a riddle session to be active.");
    console.log();
    return;
  }

  console.log("✅ Test NFT ready!");
  console.log();

  // ============ STEP 2: CONVERT TO GROUP ============

  console.log("🔄 Step 2: Converting NFT to group...");

  try {
    const convertTx = await nft.convertToGroupNFT(tokenId);
    console.log("   Transaction:", convertTx.hash);

    const convertReceipt = await convertTx.wait();
    console.log("✅ NFT converted to group!");
    console.log("   Gas used:", convertReceipt.gasUsed.toString());

    // Get group ID
    const groupId = await nft.getGroupId(tokenId);
    console.log("   Group ID:", groupId.toString());
    console.log();

    // ============ STEP 3: CHECK GROUP STATE ============

    console.log("📊 Step 3: Checking group state...");

    const state = await groupManager.getGroupState(groupId);
    const creator = await groupManager.getGroupCreator(groupId);
    const members = await groupManager.getGroupMembers(groupId);
    const costs = await groupManager.getGroupCosts(groupId);

    console.log("   State:", ["FORMING", "RESERVED", "ACTIVE", "COMPLETED", "DISBANDED"][state]);
    console.log("   Creator:", creator);
    console.log("   Members:", members.length);
    console.log("   Era:", costs[0].toString());
    console.log("   Attempt Cost:", ethers.formatEther(costs[1]), "RDLN");
    console.log("✅ Group created successfully!");
    console.log();

    // ============ STEP 4: JOIN GROUP (IF MULTIPLE SIGNERS) ============

    if (member2) {
      console.log("👥 Step 4: Adding member 2...");

      // Approve RDLN for costs
      const attemptCost = costs[3]; // nextAttemptCost
      await rdln.connect(member2).approve(GROUP_MANAGER, attemptCost * BigInt(10));

      const joinTx = await groupManager.connect(member2).joinGroup(groupId, costs[1]);
      await joinTx.wait();

      console.log("✅ Member 2 joined!");
      console.log();
    }

    if (member3) {
      console.log("👥 Step 4b: Adding member 3...");

      const attemptCost = costs[3];
      await rdln.connect(member3).approve(GROUP_MANAGER, attemptCost * BigInt(10));

      const joinTx = await groupManager.connect(member3).joinGroup(groupId, costs[1]);
      await joinTx.wait();

      console.log("✅ Member 3 joined!");
      console.log();
    }

    // ============ STEP 5: FINALIZE GROUP ============

    console.log("🔒 Step 5: Finalizing group...");

    const memberCount = await groupManager.getGroupMemberCount(groupId);
    console.log("   Total members:", memberCount.toString());

    if (memberCount < 3) {
      console.log("\n⚠️  Need minimum 3 members to finalize!");
      console.log("   Current:", memberCount.toString());
      console.log();
      console.log("💡 To complete this test:");
      console.log("   1. Have 2 more accounts join the group");
      console.log("   2. Run: npx hardhat console --network amoy");
      console.log("   3. Execute:");
      console.log("      const gm = await ethers.getContractAt('RiddleGroupManager', '" + GROUP_MANAGER + "')");
      console.log("      await gm.connect(member2).joinGroup(" + groupId + ", '" + costs[1] + "')");
      console.log();
      return;
    }

    const finalizeTx = await groupManager.finalizeGroup(groupId);
    await finalizeTx.wait();

    console.log("✅ Group finalized!");
    console.log();

    // ============ STEP 6: ACTIVATE SESSION ============

    console.log("🚀 Step 6: Activating group session...");

    const activateTx = await nft.activateGroupSession(tokenId);
    await activateTx.wait();

    console.log("✅ Session activated!");
    console.log();

    // ============ STEP 7: GET SESSION INFO ============

    console.log("📊 Step 7: Getting session info...");

    const sessionInfo = await nft.getGroupSessionInfo(tokenId);
    console.log("   Group ID:", sessionInfo[0].toString());
    console.log("   Session ID:", sessionInfo[1].toString());
    console.log("   Is Active:", sessionInfo[2]);
    console.log("   Is Completed:", sessionInfo[3]);
    console.log("   Attempts:", sessionInfo[5].toString());
    console.log("   Members:", sessionInfo[6].toString());
    console.log();

    // ============ SUCCESS ============

    console.log("=" .repeat(60));
    console.log("🎉 GROUP FLOW TEST COMPLETED!");
    console.log("=" .repeat(60));
    console.log();
    console.log("✅ Successfully:");
    console.log("   • Converted NFT to group");
    console.log("   • Added members");
    console.log("   • Finalized group");
    console.log("   • Activated session");
    console.log();
    console.log("📝 Next Steps:");
    console.log("   • Group members can now make attempts");
    console.log("   • Use: await nft.connect(member).makeGroupAttempt(tokenId, answerHash)");
    console.log();

  } catch (error) {
    console.error("\n❌ Error:", error.message);

    if (error.message.includes("Not owner")) {
      console.log("\n💡 This NFT is not owned by the deployer.");
    } else if (error.message.includes("Already group")) {
      console.log("\n💡 This NFT is already a group.");
    } else if (error.message.includes("Has attempts")) {
      console.log("\n💡 This NFT has already been used for attempts.");
      console.log("   Try minting a fresh NFT for testing.");
    }

    console.log();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Fatal Error:", error);
    process.exit(1);
  });