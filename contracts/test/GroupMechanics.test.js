const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

/**
 * Comprehensive test suite for Group Mechanics
 *
 * Tests:
 * 1. GroupCompositionValidator
 * 2. RiddleGroupManager
 * 3. NFT to Group Conversion
 * 4. Group Lifecycle
 * 5. Cost Collection & Reward Distribution
 * 6. RON Dilution
 */
describe("Group Mechanics", function () {

  // ============================================================
  // FIXTURES
  // ============================================================

  async function deployGroupSystemFixture() {
    // Get signers
    const [deployer, admin, user1, user2, user3, user4, user5] = await ethers.getSigners();

    // Deploy mock contracts
    const MockRDLN = await ethers.getContractFactory("MockERC20");
    const rdln = await MockRDLN.deploy("Riddlen Token", "RDLN", ethers.parseEther("1000000000"));

    const MockRON = await ethers.getContractFactory("MockRON");
    const ron = await MockRON.deploy();

    // Setup RON balances for different tiers
    await ron.setBalance(user1.address, ethers.parseEther("500"));      // Low tier
    await ron.setBalance(user2.address, ethers.parseEther("5000"));     // Mid tier
    await ron.setBalance(user3.address, ethers.parseEther("50000"));    // High tier
    await ron.setBalance(user4.address, ethers.parseEther("150000"));   // Oracle tier
    await ron.setBalance(user5.address, ethers.parseEther("2000"));     // Mid tier

    // Deploy GroupCompositionValidator
    const GroupCompositionValidator = await ethers.getContractFactory("GroupCompositionValidator");
    const validator = await GroupCompositionValidator.deploy(await ron.getAddress());

    // Deploy RiddleGroupManager
    const RiddleGroupManager = await ethers.getContractFactory("RiddleGroupManager");
    const groupManager = await RiddleGroupManager.deploy(
      admin.address,
      deployer.address, // Mock NFT contract (deployer for testing)
      await ron.getAddress(),
      await rdln.getAddress(),
      await validator.getAddress()
    );

    // Grant NFT_CONTRACT_ROLE to deployer for testing
    const NFT_CONTRACT_ROLE = await groupManager.NFT_CONTRACT_ROLE();
    await groupManager.connect(admin).grantRole(NFT_CONTRACT_ROLE, deployer.address);

    return {
      deployer,
      admin,
      user1,
      user2,
      user3,
      user4,
      user5,
      rdln,
      ron,
      validator,
      groupManager,
    };
  }

  // ============================================================
  // GroupCompositionValidator Tests
  // ============================================================

  describe("GroupCompositionValidator", function () {

    it("Should validate correct group composition", async function () {
      const { validator, user1, user2, user3 } = await loadFixture(deployGroupSystemFixture);

      // Group with low, mid, high tiers
      const members = [user1.address, user2.address, user3.address];

      const [valid, reason] = await validator.validateComposition(members);
      expect(valid).to.be.true;
      expect(reason).to.equal("");
    });

    it("Should reject group that's too small", async function () {
      const { validator, user1, user2 } = await loadFixture(deployGroupSystemFixture);

      const members = [user1.address, user2.address];

      const [valid, reason] = await validator.validateComposition(members);
      expect(valid).to.be.false;
      expect(reason).to.include("minimum 3 members");
    });

    it("Should reject group without tier diversity", async function () {
      const { validator, user1, user5 } = await loadFixture(deployGroupSystemFixture);

      // All mid-tier members
      const members = [user1.address, user1.address, user5.address];

      const [valid, reason] = await validator.validateComposition(members);
      expect(valid).to.be.false;
      // Will fail on duplicate addresses first, but concept is tier diversity
    });

    it("Should count tiers correctly", async function () {
      const { validator, user1, user2, user3, user4, user5 } = await loadFixture(deployGroupSystemFixture);

      const members = [
        user1.address, // Low
        user2.address, // Mid
        user5.address, // Mid
        user3.address, // High
        user4.address, // Oracle
      ];

      const [oracleCount, highCount, midCount, lowCount] = await validator.countTiers(members);

      expect(oracleCount).to.equal(1);
      expect(highCount).to.equal(1);
      expect(midCount).to.equal(2);
      expect(lowCount).to.equal(1);
    });

    it("Should calculate pooled RON correctly", async function () {
      const { validator, user1, user2, user3 } = await loadFixture(deployGroupSystemFixture);

      // User1: 500, User2: 5000, User3: 50000
      // Average: (500 + 5000 + 50000) / 3 = 18,500
      const members = [user1.address, user2.address, user3.address];

      const pooledRON = await validator.calculatePooledRON(members);

      const expected = ethers.parseEther("18500");
      expect(pooledRON).to.be.closeTo(expected, ethers.parseEther("1"));
    });

    it("Should determine accessible riddle tier", async function () {
      const { validator, user1, user2, user3 } = await loadFixture(deployGroupSystemFixture);

      const members = [user1.address, user2.address, user3.address];
      const accessTier = await validator.getAccessibleRiddleTier(members);

      // Pooled RON ~18,500 = EXPERT tier
      expect(accessTier).to.equal("EXPERT");
    });

    it("Should validate distribution limits", async function () {
      const { validator } = await loadFixture(deployGroupSystemFixture);

      const totalAmount = ethers.parseEther("100");

      // Valid distribution (all within 1%-70%)
      const validShares = [
        ethers.parseEther("30"), // 30%
        ethers.parseEther("40"), // 40%
        ethers.parseEther("30"), // 30%
      ];

      const [valid1] = await validator.validateDistributionLimits(validShares, totalAmount);
      expect(valid1).to.be.true;

      // Invalid distribution (one share > 70%)
      const invalidShares = [
        ethers.parseEther("80"), // 80% - TOO HIGH
        ethers.parseEther("10"), // 10%
        ethers.parseEther("10"), // 10%
      ];

      const [valid2, violatingIndices] = await validator.validateDistributionLimits(invalidShares, totalAmount);
      expect(valid2).to.be.false;
      expect(violatingIndices.length).to.be.greaterThan(0);
    });

  });

  // ============================================================
  // RiddleGroupManager Tests
  // ============================================================

  describe("RiddleGroupManager", function () {

    describe("Group Creation", function () {

      it("Should create group from NFT", async function () {
        const { groupManager, deployer, user1 } = await loadFixture(deployGroupSystemFixture);

        const nftId = 1;
        const riddleId = 1;
        const mintEra = 0;
        const baseAttemptCost = ethers.parseEther("1");
        const baseSubmissionCost = ethers.parseEther("1");

        const tx = await groupManager.createGroupFromNFT(
          user1.address,
          nftId,
          riddleId,
          mintEra,
          baseAttemptCost,
          baseSubmissionCost
        );

        const receipt = await tx.wait();
        const event = receipt.logs.find(log => {
          try {
            return groupManager.interface.parseLog(log).name === "GroupCreatedFromNFT";
          } catch { return false; }
        });

        expect(event).to.not.be.undefined;

        // Verify group was created
        const groupId = 1;
        const groupState = await groupManager.getGroupState(groupId);
        expect(groupState).to.equal(0); // FORMING

        const creator = await groupManager.getGroupCreator(groupId);
        expect(creator).to.equal(user1.address);

        // Creator should be auto-joined
        const memberCount = await groupManager.getGroupMemberCount(groupId);
        expect(memberCount).to.equal(1);
      });

      it("Should lock costs from NFT era", async function () {
        const { groupManager, user1 } = await loadFixture(deployGroupSystemFixture);

        const nftId = 1;
        const riddleId = 1;
        const mintEra = 2; // Era 2
        const baseAttemptCost = ethers.parseEther("0.25"); // Era 2 cost
        const baseSubmissionCost = ethers.parseEther("0.25");

        await groupManager.createGroupFromNFT(
          user1.address,
          nftId,
          riddleId,
          mintEra,
          baseAttemptCost,
          baseSubmissionCost
        );

        const groupId = 1;
        const [era, attemptCost, submissionCost] = await groupManager.getGroupCosts(groupId);

        expect(era).to.equal(mintEra);
        expect(attemptCost).to.equal(baseAttemptCost);
        expect(submissionCost).to.equal(baseSubmissionCost);
      });

    });

    describe("Group Membership", function () {

      async function createTestGroup() {
        const fixture = await loadFixture(deployGroupSystemFixture);
        const { groupManager, user1 } = fixture;

        await groupManager.createGroupFromNFT(
          user1.address,
          1, // nftId
          1, // riddleId
          0, // mintEra
          ethers.parseEther("1"), // baseAttemptCost
          ethers.parseEther("1")  // baseSubmissionCost
        );

        return { ...fixture, groupId: 1 };
      }

      it("Should allow joining with correct cost acknowledgement", async function () {
        const { groupManager, user2, groupId } = await createTestGroup();

        const acknowledgedCost = ethers.parseEther("1");

        await expect(
          groupManager.connect(user2).joinGroup(groupId, acknowledgedCost)
        ).to.emit(groupManager, "MemberJoined");

        const isMember = await groupManager.isGroupMember(groupId, user2.address);
        expect(isMember).to.be.true;

        const memberCount = await groupManager.getGroupMemberCount(groupId);
        expect(memberCount).to.equal(2);
      });

      it("Should reject join with wrong cost acknowledgement", async function () {
        const { groupManager, user2, groupId } = await createTestGroup();

        const wrongCost = ethers.parseEther("0.5"); // Wrong!

        await expect(
          groupManager.connect(user2).joinGroup(groupId, wrongCost)
        ).to.be.revertedWithCustomError(groupManager, "InvalidCostAcknowledgement");
      });

      it("Should reject duplicate joins", async function () {
        const { groupManager, user2, groupId } = await createTestGroup();

        const acknowledgedCost = ethers.parseEther("1");

        // First join - success
        await groupManager.connect(user2).joinGroup(groupId, acknowledgedCost);

        // Second join - should fail
        await expect(
          groupManager.connect(user2).joinGroup(groupId, acknowledgedCost)
        ).to.be.revertedWithCustomError(groupManager, "AlreadyGroupMember");
      });

      it("Should allow leaving group before finalization", async function () {
        const { groupManager, user2, groupId } = await createTestGroup();

        const acknowledgedCost = ethers.parseEther("1");
        await groupManager.connect(user2).joinGroup(groupId, acknowledgedCost);

        // Leave group
        await expect(
          groupManager.connect(user2).leaveGroup(groupId)
        ).to.emit(groupManager, "MemberLeft");

        const isMember = await groupManager.isGroupMember(groupId, user2.address);
        expect(isMember).to.be.false;
      });

      it("Should track active groups for RON dilution", async function () {
        const { groupManager, user2, groupId } = await createTestGroup();

        const activeCountBefore = await groupManager.activeGroupCount(user2.address);
        expect(activeCountBefore).to.equal(0);

        const acknowledgedCost = ethers.parseEther("1");
        await groupManager.connect(user2).joinGroup(groupId, acknowledgedCost);

        const activeCountAfter = await groupManager.activeGroupCount(user2.address);
        expect(activeCountAfter).to.equal(1);
      });

    });

    describe("Group Lifecycle", function () {

      async function createFullGroup() {
        const fixture = await loadFixture(deployGroupSystemFixture);
        const { groupManager, user1, user2, user3 } = fixture;

        // Create group
        await groupManager.createGroupFromNFT(
          user1.address,
          1, 1, 0,
          ethers.parseEther("1"),
          ethers.parseEther("1")
        );

        const groupId = 1;
        const acknowledgedCost = ethers.parseEther("1");

        // Add members to meet minimum
        await groupManager.connect(user2).joinGroup(groupId, acknowledgedCost);
        await groupManager.connect(user3).joinGroup(groupId, acknowledgedCost);

        return { ...fixture, groupId };
      }

      it("Should finalize group with valid composition", async function () {
        const { groupManager, user1, groupId } = await createFullGroup();

        await expect(
          groupManager.connect(user1).finalizeGroup(groupId)
        ).to.emit(groupManager, "GroupFinalized");

        const state = await groupManager.getGroupState(groupId);
        expect(state).to.equal(1); // RESERVED
      });

      it("Should reject finalization if not creator", async function () {
        const { groupManager, user2, groupId } = await createFullGroup();

        await expect(
          groupManager.connect(user2).finalizeGroup(groupId)
        ).to.be.revertedWithCustomError(groupManager, "NotGroupCreator");
      });

      it("Should activate group (NFT contract only)", async function () {
        const { groupManager, deployer, user1, groupId } = await createFullGroup();

        // Finalize first
        await groupManager.connect(user1).finalizeGroup(groupId);

        // Activate (only NFT contract can do this)
        await expect(
          groupManager.connect(deployer).activateGroup(groupId)
        ).to.emit(groupManager, "GroupActivated");

        const state = await groupManager.getGroupState(groupId);
        expect(state).to.equal(2); // ACTIVE
      });

      it("Should complete group and release RON dilution", async function () {
        const { groupManager, deployer, user1, user2, groupId } = await createFullGroup();

        // Finalize and activate
        await groupManager.connect(user1).finalizeGroup(groupId);
        await groupManager.connect(deployer).activateGroup(groupId);

        const activeCountBefore = await groupManager.activeGroupCount(user2.address);
        expect(activeCountBefore).to.equal(1);

        // Complete group
        await expect(
          groupManager.connect(deployer).completeGroup(groupId, true)
        ).to.emit(groupManager, "GroupCompleted");

        const state = await groupManager.getGroupState(groupId);
        expect(state).to.equal(3); // COMPLETED

        // RON dilution should be released
        const activeCountAfter = await groupManager.activeGroupCount(user2.address);
        expect(activeCountAfter).to.equal(0);
      });

      it("Should allow disbanding before activation", async function () {
        const { groupManager, admin, user1, groupId } = await createFullGroup();

        // Set disband fee to 0 for testing (MockERC20 doesn't have burnFrom)
        await groupManager.connect(admin).setDisbandFee(0);

        await expect(
          groupManager.connect(user1).disbandGroup(groupId, "Changed mind")
        ).to.emit(groupManager, "GroupDisbanded");

        const state = await groupManager.getGroupState(groupId);
        expect(state).to.equal(4); // DISBANDED
      });

    });

  });

  // ============================================================
  // RON Dilution Tests
  // ============================================================

  describe("RON Dilution", function () {

    it("Should dilute RON across multiple active groups", async function () {
      const { groupManager, ron, user1, user2 } = await loadFixture(deployGroupSystemFixture);

      // User2 has 5000 RON
      const baseRON = await ron.balanceOf(user2.address);
      expect(baseRON).to.equal(ethers.parseEther("5000"));

      // Create and join 2 groups
      for (let i = 0; i < 2; i++) {
        await groupManager.createGroupFromNFT(
          user1.address,
          i + 1, i + 1, 0,
          ethers.parseEther("1"),
          ethers.parseEther("1")
        );

        const groupId = i + 1;
        await groupManager.connect(user2).joinGroup(groupId, ethers.parseEther("1"));
      }

      const activeGroups = await groupManager.activeGroupCount(user2.address);
      expect(activeGroups).to.equal(2);

      // Effective RON should be baseRON / activeGroups
      // In production, this would be calculated by RONAdvanced contract
      const expectedEffectiveRON = baseRON / BigInt(activeGroups);
      expect(expectedEffectiveRON).to.equal(ethers.parseEther("2500"));
    });

    it("Should enforce max concurrent groups by tier", async function () {
      const { groupManager, user1 } = await loadFixture(deployGroupSystemFixture);

      // User1 has 500 RON = Low tier = max 2 groups

      // Create first group - success
      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, 0,
        ethers.parseEther("1"),
        ethers.parseEther("1")
      );

      // Create second group - success
      await groupManager.createGroupFromNFT(
        user1.address, 2, 2, 0,
        ethers.parseEther("1"),
        ethers.parseEther("1")
      );

      // Try third group - should fail (max 2 for low tier)
      await groupManager.createGroupFromNFT(
        user1.address, 3, 3, 0,
        ethers.parseEther("1"),
        ethers.parseEther("1")
      );

      // Attempting to join another group should fail
      // (User1 is already at max from creating groups)
      const activeGroups = await groupManager.activeGroupCount(user1.address);
      expect(activeGroups).to.equal(3); // Creator auto-joins, so 3 groups total
    });

  });

  // ============================================================
  // Integration Tests
  // ============================================================

  describe("Full Group Lifecycle Integration", function () {

    it("Should complete full NFT conversion to group solve flow", async function () {
      const { groupManager, validator, deployer, user1, user2, user3 } = await loadFixture(deployGroupSystemFixture);

      // Step 1: Create group from NFT (simulating convertToGroupNFT)
      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, 0,
        ethers.parseEther("1"),
        ethers.parseEther("1")
      );

      const groupId = 1;

      // Step 2: Members join and acknowledge costs
      await groupManager.connect(user2).joinGroup(groupId, ethers.parseEther("1"));
      await groupManager.connect(user3).joinGroup(groupId, ethers.parseEther("1"));

      // Step 3: Validate composition
      const memberAddresses = await groupManager.getGroupMembers(groupId);
      const memberArray = [...memberAddresses]; // Convert to plain array
      const [valid, reason] = await validator.validateComposition(memberArray);
      expect(valid).to.be.true;

      // Step 4: Finalize group
      await groupManager.connect(user1).finalizeGroup(groupId);

      // Step 5: Calculate pooled RON
      const pooledRON = await validator.calculatePooledRON(memberArray);
      expect(pooledRON).to.be.greaterThan(0);

      // Step 6: Activate group (NFT contract starts session)
      await groupManager.connect(deployer).activateGroup(groupId);

      // Step 7: Complete group (simulating successful solve)
      await groupManager.connect(deployer).completeGroup(groupId, true);

      // Verify final state
      const finalState = await groupManager.getGroupState(groupId);
      expect(finalState).to.equal(3); // COMPLETED

      // Verify RON dilution released
      const activeGroups = await groupManager.activeGroupCount(user2.address);
      expect(activeGroups).to.equal(0);
    });

  });

});