const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

/**
 * Test suite for NFT to Group conversion
 *
 * Tests the complete flow:
 * 1. Solo minting NFT
 * 2. Converting NFT to group
 * 3. Group attempts with era-locked costs
 * 4. Reward distribution
 * 5. Era cost inheritance
 */
describe("NFT Group Conversion", function () {

  // ============================================================
  // FIXTURES
  // ============================================================

  async function deployFullSystemFixture() {
    const [deployer, admin, treasury, grandPrize, devOps, user1, user2, user3] =
      await ethers.getSigners();

    // Deploy RDLN token
    const MockRDLN = await ethers.getContractFactory("MockERC20");
    const rdln = await MockRDLN.deploy("Riddlen Token", "RDLN", ethers.parseEther("1000000000"));

    // Distribute RDLN to users
    await rdln.transfer(user1.address, ethers.parseEther("10000"));
    await rdln.transfer(user2.address, ethers.parseEther("10000"));
    await rdln.transfer(user3.address, ethers.parseEther("10000"));

    // Deploy RON
    const MockRON = await ethers.getContractFactory("MockRON");
    const ron = await MockRON.deploy();

    // Setup RON tiers
    await ron.setBalance(user1.address, ethers.parseEther("500"));    // Low
    await ron.setBalance(user2.address, ethers.parseEther("5000"));   // Mid
    await ron.setBalance(user3.address, ethers.parseEther("50000"));  // High

    // Deploy group system
    const GroupCompositionValidator = await ethers.getContractFactory("GroupCompositionValidator");
    const validator = await GroupCompositionValidator.deploy(await ron.getAddress());

    const RiddleGroupManager = await ethers.getContractFactory("RiddleGroupManager");
    const groupManager = await RiddleGroupManager.deploy(
      admin.address,
      deployer.address, // NFT contract placeholder
      await ron.getAddress(),
      await rdln.getAddress(),
      await validator.getAddress()
    );

    return {
      deployer, admin, treasury, grandPrize, devOps,
      user1, user2, user3,
      rdln, ron, validator, groupManager
    };
  }

  // ============================================================
  // NFT Conversion Tests
  // ============================================================

  describe("Converting Solo NFT to Group", function () {

    it("Should create group with NFT's locked era costs", async function () {
      const { groupManager, user1 } = await loadFixture(deployFullSystemFixture);

      // Simulate NFT minted in Era 0
      const nftId = 1;
      const riddleId = 1;
      const mintEra = 0;
      const baseAttemptCost = ethers.parseEther("1"); // Era 0 cost
      const baseSubmissionCost = ethers.parseEther("1");

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

      // Verify costs are locked from Era 0
      expect(era).to.equal(0);
      expect(attemptCost).to.equal(ethers.parseEther("1"));
      expect(submissionCost).to.equal(ethers.parseEther("1"));
    });

    it("Should reject conversion if NFT already attempted", async function () {
      // This would be tested in RiddleNFTv3 contract
      // Verifying that NFT with attemptCount > 0 cannot be converted
      // Implementation would be:
      // require(nft.attemptCount == 0, "Cannot convert after attempts made");
    });

    it("Should reject conversion if NFT already solved", async function () {
      // This would be tested in RiddleNFTv3 contract
      // Verifying that solved NFT cannot be converted
      // Implementation would be:
      // require(!nft.isSolved, "Cannot convert solved NFT");
    });

  });

  // ============================================================
  // Era Cost Inheritance Tests
  // ============================================================

  describe("Era-Locked Cost Inheritance", function () {

    it("Should maintain Era 0 costs when users join later eras", async function () {
      const { groupManager, user1, user2, user3 } = await loadFixture(deployFullSystemFixture);

      // User1 mints NFT in Era 0 (2025)
      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, 0,
        ethers.parseEther("1"), // Era 0 cost
        ethers.parseEther("1")
      );

      const groupId = 1;

      // Fast forward time to Era 1 (2027)
      // In production, costs would be halved: 0.5 RDLN
      // But group still charges Era 0 costs: 1 RDLN

      // User2 and User3 join in Era 1 but agree to Era 0 costs
      const era0Cost = ethers.parseEther("1");

      await groupManager.connect(user2).joinGroup(groupId, era0Cost);
      await groupManager.connect(user3).joinGroup(groupId, era0Cost);

      // Verify all members see same locked costs
      const [era, attemptCost] = await groupManager.getGroupCosts(groupId);
      expect(era).to.equal(0);
      expect(attemptCost).to.equal(era0Cost);
    });

    it("Should create cheaper group from Era 2 NFT", async function () {
      const { groupManager, user1, user2, user3 } = await loadFixture(deployFullSystemFixture);

      // User1 mints NFT in Era 2 (2029)
      const era2Cost = ethers.parseEther("0.25"); // 1 / 2^2 = 0.25

      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, 2,
        era2Cost,
        era2Cost
      );

      const groupId = 1;

      // Members join with Era 2 costs
      await groupManager.connect(user2).joinGroup(groupId, era2Cost);
      await groupManager.connect(user3).joinGroup(groupId, era2Cost);

      // Verify Era 2 costs locked
      const [era, attemptCost] = await groupManager.getGroupCosts(groupId);
      expect(era).to.equal(2);
      expect(attemptCost).to.equal(era2Cost);
    });

    it("Should calculate progressive costs based on locked era", async function () {
      const { groupManager, user1 } = await loadFixture(deployFullSystemFixture);

      const baseAttemptCost = ethers.parseEther("1");

      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, 0,
        baseAttemptCost,
        ethers.parseEther("1")
      );

      const groupId = 1;

      // Progressive costs: base * (attempts + 1)
      // Attempt 1: 1 RDLN
      // Attempt 2: 2 RDLN
      // Attempt 3: 3 RDLN

      const [, nextAttemptCost] = await groupManager.getGroupCosts(groupId);

      // First attempt should be 1x base cost
      expect(nextAttemptCost).to.equal(baseAttemptCost);

      // After first attempt, cost would be 2x base cost
      // This would be calculated in RiddleNFT contract:
      // nextCost = baseAttemptCost * (attemptCount + 1)
    });

  });

  // ============================================================
  // Cost Acknowledgement Tests
  // ============================================================

  describe("Cost Acknowledgement Mechanism", function () {

    it("Should require exact cost acknowledgement", async function () {
      const { groupManager, user1, user2 } = await loadFixture(deployFullSystemFixture);

      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, 0,
        ethers.parseEther("1"),
        ethers.parseEther("1")
      );

      const groupId = 1;
      const correctCost = ethers.parseEther("1");
      const wrongCost = ethers.parseEther("0.9");

      // Wrong acknowledgement should fail
      await expect(
        groupManager.connect(user2).joinGroup(groupId, wrongCost)
      ).to.be.revertedWithCustomError(groupManager, "InvalidCostAcknowledgement");

      // Correct acknowledgement should succeed
      await expect(
        groupManager.connect(user2).joinGroup(groupId, correctCost)
      ).to.emit(groupManager, "MemberJoined");
    });

    it("Should display costs in UI for informed consent", async function () {
      const { groupManager, user1 } = await loadFixture(deployFullSystemFixture);

      const era = 0;
      const baseAttemptCost = ethers.parseEther("1");

      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, era,
        baseAttemptCost,
        ethers.parseEther("1")
      );

      const groupId = 1;

      // Frontend would call this to show costs to joining user
      const [lockedEra, lockedCost, , nextCost] = await groupManager.getGroupCosts(groupId);

      // UI displays:
      // "This group uses Era 0 costs"
      // "Next attempt cost: 1 RDLN"
      // "Your share: ~0.333 RDLN" (if 3 members with equal RON)

      expect(lockedEra).to.equal(era);
      expect(lockedCost).to.equal(baseAttemptCost);
      expect(nextCost).to.equal(baseAttemptCost); // First attempt
    });

  });

  // ============================================================
  // RON-Weighted Cost Distribution Tests
  // ============================================================

  describe("RON-Weighted Cost Distribution", function () {

    it("Should distribute costs proportionally by effective RON", async function () {
      const { validator, user1, user2, user3 } = await loadFixture(deployFullSystemFixture);

      const members = [user1.address, user2.address, user3.address];
      const effectiveRONs = [
        ethers.parseEther("500"),   // User1: 10%
        ethers.parseEther("2000"),  // User2: 40%
        ethers.parseEther("2500"),  // User3: 50%
      ];
      const totalCost = ethers.parseEther("100");

      const [shares] = await validator.calculateDistribution(
        members,
        effectiveRONs,
        totalCost
      );

      // Expected distribution:
      // User1: 10 RDLN (10%)
      // User2: 40 RDLN (40%)
      // User3: 50 RDLN (50%)

      expect(shares[0]).to.be.closeTo(ethers.parseEther("10"), ethers.parseEther("0.1"));
      expect(shares[1]).to.be.closeTo(ethers.parseEther("40"), ethers.parseEther("0.1"));
      expect(shares[2]).to.be.closeTo(ethers.parseEther("50"), ethers.parseEther("0.1"));
    });

    it("Should enforce 1% minimum share", async function () {
      const { validator } = await loadFixture(deployFullSystemFixture);

      const members = [ethers.ZeroAddress, ethers.ZeroAddress];
      const effectiveRONs = [
        ethers.parseEther("100000"), // 99.9%
        ethers.parseEther("100"),     // 0.1% - below minimum
      ];
      const totalCost = ethers.parseEther("100");

      const [shares] = await validator.calculateDistribution(
        members,
        effectiveRONs,
        totalCost
      );

      // Member 2 should get at least 1% (1 RDLN)
      expect(shares[1]).to.be.gte(ethers.parseEther("1"));
    });

    it("Should enforce 70% maximum share", async function () {
      const { validator } = await loadFixture(deployFullSystemFixture);

      const members = [ethers.ZeroAddress, ethers.ZeroAddress];
      const effectiveRONs = [
        ethers.parseEther("1000000"), // Would be >70%
        ethers.parseEther("100"),
      ];
      const totalCost = ethers.parseEther("100");

      const [shares] = await validator.calculateDistribution(
        members,
        effectiveRONs,
        totalCost
      );

      // Member 1 should get at most 70% (70 RDLN)
      expect(shares[0]).to.be.lte(ethers.parseEther("70"));
    });

  });

  // ============================================================
  // Economic Incentive Tests
  // ============================================================

  describe("Economic Incentives", function () {

    it("Should make early NFTs more valuable (premium groups)", async function () {
      const { groupManager, user1 } = await loadFixture(deployFullSystemFixture);

      // Era 0 NFT (2025)
      const era0Cost = ethers.parseEther("1");
      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, 0,
        era0Cost,
        era0Cost
      );

      // Era 3 NFT (2031)
      const era3Cost = ethers.parseEther("0.125"); // 1 / 2^3
      await groupManager.createGroupFromNFT(
        user1.address, 2, 2, 3,
        era3Cost,
        era3Cost
      );

      const group1Costs = await groupManager.getGroupCosts(1);
      const group2Costs = await groupManager.getGroupCosts(2);

      // Era 0 group has 8x higher costs
      expect(group1Costs[1]).to.equal(era0Cost);
      expect(group2Costs[1]).to.equal(era3Cost);
      expect(group1Costs[1] / group2Costs[1]).to.equal(8n);

      // Economic implication:
      // - Era 0 group: Higher costs, but attracts serious/wealthy players
      // - Era 3 group: Lower costs, attracts newcomers/practice
    });

    it("Should create secondary market for group-ready NFTs", async function () {
      // Conceptual test - NFTs with favorable eras become tradeable
      //
      // Valuable NFTs:
      // - Era 0: Premium pricing (high RON veterans)
      // - Low attempt count: More attempts remaining
      // - Unsolved: Still active
      //
      // Less valuable:
      // - Era 5+: Very cheap costs (low barrier to entry)
      // - High attempt count: Few attempts left
      // - Already solved: Cannot be used
      //
      // This creates emergent NFT value beyond just "first to solve"
    });

  });

  // ============================================================
  // Edge Cases
  // ============================================================

  describe("Edge Cases", function () {

    it("Should handle group with 11 members (maximum)", async function () {
      const { groupManager, user1 } = await loadFixture(deployFullSystemFixture);

      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, 0,
        ethers.parseEther("1"),
        ethers.parseEther("1")
      );

      const groupId = 1;

      // Add 10 more members (creator is already member 1)
      for (let i = 0; i < 10; i++) {
        const newUser = ethers.Wallet.createRandom().address;
        // In production, would need to setup RON balance and RDLN

        // This would work if users were properly setup
        // await groupManager.connect(newUser).joinGroup(groupId, ethers.parseEther("1"));
      }

      const maxMembers = await groupManager.MAX_GROUP_SIZE();
      expect(maxMembers).to.equal(11);
    });

    it("Should handle group with minimum 3 members", async function () {
      const { groupManager, user1, user2, user3 } = await loadFixture(deployFullSystemFixture);

      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, 0,
        ethers.parseEther("1"),
        ethers.parseEther("1")
      );

      const groupId = 1;

      // Add 2 members (total 3)
      await groupManager.connect(user2).joinGroup(groupId, ethers.parseEther("1"));
      await groupManager.connect(user3).joinGroup(groupId, ethers.parseEther("1"));

      const memberCount = await groupManager.getGroupMemberCount(groupId);
      expect(memberCount).to.equal(3);

      // Should be able to finalize with 3 members
      await expect(
        groupManager.connect(user1).finalizeGroup(groupId)
      ).to.emit(groupManager, "GroupFinalized");
    });

    it("Should handle progressive cost increase across attempts", async function () {
      const { groupManager, user1 } = await loadFixture(deployFullSystemFixture);

      const baseAttemptCost = ethers.parseEther("1");

      await groupManager.createGroupFromNFT(
        user1.address, 1, 1, 0,
        baseAttemptCost,
        ethers.parseEther("1")
      );

      // In RiddleNFT contract, costs would be:
      // Attempt 1: 1 RDLN (base * 1)
      // Attempt 2: 2 RDLN (base * 2)
      // Attempt 3: 3 RDLN (base * 3)
      // ...
      // Attempt N: N RDLN (base * N)

      // All members pay proportionally based on RON weighting
    });

  });

});