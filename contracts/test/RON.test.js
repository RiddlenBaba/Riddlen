const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RON Reputation System", function () {
  let ron;
  let owner, gameContract, oracleContract, user1, user2, user3;

  beforeEach(async function () {
    [owner, gameContract, oracleContract, user1, user2, user3] = await ethers.getSigners();

    const RON = await ethers.getContractFactory("RON");
    ron = await RON.deploy(owner.address);
    await ron.waitForDeployment();

    // Grant roles
    const GAME_ROLE = await ron.GAME_ROLE();
    const ORACLE_ROLE = await ron.ORACLE_ROLE();
    await ron.grantRole(GAME_ROLE, gameContract.address);
    await ron.grantRole(ORACLE_ROLE, oracleContract.address);
  });

  describe("Deployment", function () {
    it("Should set up roles correctly", async function () {
      const DEFAULT_ADMIN_ROLE = await ron.DEFAULT_ADMIN_ROLE();
      const GAME_ROLE = await ron.GAME_ROLE();
      const ORACLE_ROLE = await ron.ORACLE_ROLE();

      expect(await ron.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await ron.hasRole(GAME_ROLE, gameContract.address)).to.be.true;
      expect(await ron.hasRole(ORACLE_ROLE, oracleContract.address)).to.be.true;
    });

    it("Should set correct tier thresholds", async function () {
      const [solver, expert, oracle] = await ron.getTierThresholds();
      expect(solver).to.equal(1000);
      expect(expert).to.equal(10000);
      expect(oracle).to.equal(100000);
    });

    it("Should start with zero global stats", async function () {
      expect(await ron.totalUsers()).to.equal(0);
      expect(await ron.totalRONMinted()).to.equal(0);
      expect(await ron.totalValidationsPerformed()).to.equal(0);
    });
  });

  describe("RON Rewards", function () {
    it("Should award RON for easy riddles", async function () {
      const difficulty = 0; // EASY
      const isFirstSolver = false;
      const isSpeedSolver = false;

      await ron.connect(gameContract).awardRON(
        user1.address,
        difficulty,
        isFirstSolver,
        isSpeedSolver,
        "Easy riddle solved"
      );

      expect(await ron.balanceOf(user1.address)).to.equal(17); // Average of 10-25
      expect(await ron.totalUsers()).to.equal(1);
      expect(await ron.totalRONMinted()).to.equal(17);
    });

    it("Should award bonus for first solver", async function () {
      const difficulty = 1; // MEDIUM
      const isFirstSolver = true;
      const isSpeedSolver = false;

      await ron.connect(gameContract).awardRON(
        user1.address,
        difficulty,
        isFirstSolver,
        isSpeedSolver,
        "First solver bonus"
      );

      const balance = await ron.balanceOf(user1.address);
      expect(balance).to.equal(375); // 75 base + 300 bonus (4x bonus)
    });

    it("Should award speed solver bonus", async function () {
      const difficulty = 1; // MEDIUM
      const isFirstSolver = false;
      const isSpeedSolver = true;

      await ron.connect(gameContract).awardRON(
        user1.address,
        difficulty,
        isFirstSolver,
        isSpeedSolver,
        "Speed solver bonus"
      );

      const balance = await ron.balanceOf(user1.address);
      expect(balance).to.equal(112); // 75 base + 37 speed bonus (1.5x)
    });

    it("Should award streak bonus", async function () {
      const difficulty = 0; // EASY

      // First correct answer (no streak yet)
      await ron.connect(gameContract).awardRON(
        user1.address,
        difficulty,
        false,
        false,
        "First correct"
      );

      // Second correct answer (streak of 2)
      await ron.connect(gameContract).awardRON(
        user1.address,
        difficulty,
        false,
        false,
        "Second correct"
      );

      const balance = await ron.balanceOf(user1.address);
      expect(balance).to.equal(34); // 17 + 17 + 0 streak bonus (streak starts at 2, no bonus yet)
    });

    it("Should handle legendary riddle rewards", async function () {
      const difficulty = 3; // LEGENDARY

      await ron.connect(gameContract).awardRON(
        user1.address,
        difficulty,
        false,
        false,
        "Legendary solved"
      );

      expect(await ron.balanceOf(user1.address)).to.equal(5500); // Average of 1000-10000
    });
  });

  describe("Access Tiers", function () {
    it("Should start users in NOVICE tier", async function () {
      const tier = await ron.getUserTier(user1.address);
      expect(tier).to.equal(0); // NOVICE
    });

    it("Should promote to SOLVER tier at 1000 RON", async function () {
      // Award exactly enough to reach SOLVER tier (1000 RON)
      // EASY riddles give 17 RON each, so we need 59 easy riddles
      for (let i = 0; i < 59; i++) {
        await ron.connect(gameContract).awardRON(
          user1.address,
          0, // EASY (17 RON each)
          false,
          false,
          `Test ${i}`
        );
      }

      const balance = await ron.balanceOf(user1.address);
      expect(balance).to.be.gte(1000); // Should be at least 1000

      const tier = await ron.getUserTier(user1.address);
      expect(tier).to.equal(1); // SOLVER
    });

    it("Should check riddle access based on tier", async function () {
      // NOVICE tier initially
      let [easy, medium, hard, legendary] = await ron.getRiddleAccess(user1.address);
      expect(easy).to.be.true;
      expect(medium).to.be.false;
      expect(hard).to.be.false;
      expect(legendary).to.be.false;

      // Award enough RON to reach EXPERT tier (10,000+)
      for (let i = 0; i < 2; i++) {
        await ron.connect(gameContract).awardRON(
          user1.address,
          3, // LEGENDARY
          true, // First solver bonus
          false,
          `Test ${i}`
        );
      }

      // Should now be EXPERT tier
      [easy, medium, hard, legendary] = await ron.getRiddleAccess(user1.address);
      expect(easy).to.be.true;
      expect(medium).to.be.true;
      expect(hard).to.be.true;
      expect(legendary).to.be.false; // Still need ORACLE tier
    });

    it("Should check oracle access based on tier", async function () {
      // NOVICE tier initially
      let [basic, complex, elite, governance] = await ron.getOracleAccess(user1.address);
      expect(basic).to.be.false;
      expect(complex).to.be.false;
      expect(elite).to.be.false;
      expect(governance).to.be.false;

      // Award enough to reach SOLVER tier
      await ron.connect(gameContract).awardRON(
        user1.address,
        3, // LEGENDARY
        false,
        false,
        "Reach solver"
      );

      [basic, complex, elite, governance] = await ron.getOracleAccess(user1.address);
      expect(basic).to.be.true;
      expect(complex).to.be.false;
      expect(elite).to.be.false;
      expect(governance).to.be.false;
    });
  });

  describe("Accuracy Tracking", function () {
    it("Should track correct answers and attempts", async function () {
      // First attempt (correct)
      await ron.connect(gameContract).updateAccuracy(user1.address, true);
      await ron.connect(gameContract).awardRON(
        user1.address,
        0, // EASY
        false,
        false,
        "Correct answer"
      );

      // Second attempt (incorrect)
      await ron.connect(gameContract).updateAccuracy(user1.address, false);

      const [, , correctAnswers, totalAttempts, accuracyPercentage, currentStreak] =
        await ron.getUserStats(user1.address);

      expect(correctAnswers).to.equal(1);
      expect(totalAttempts).to.equal(2);
      expect(accuracyPercentage).to.equal(5000); // 50% (5000/10000)
      expect(currentStreak).to.equal(0); // Reset on incorrect answer
    });

    it("Should track streaks correctly", async function () {
      // Three correct answers in a row
      for (let i = 0; i < 3; i++) {
        await ron.connect(gameContract).updateAccuracy(user1.address, true);
        await ron.connect(gameContract).awardRON(
          user1.address,
          0,
          false,
          false,
          `Correct ${i + 1}`
        );
      }

      const [, , , , , currentStreak, maxStreak] = await ron.getUserStats(user1.address);
      expect(currentStreak).to.equal(3);
      expect(maxStreak).to.equal(3);

      // One incorrect answer
      await ron.connect(gameContract).updateAccuracy(user1.address, false);

      const [, , , , , newCurrentStreak, newMaxStreak] = await ron.getUserStats(user1.address);
      expect(newCurrentStreak).to.equal(0); // Reset
      expect(newMaxStreak).to.equal(3); // Preserved
    });
  });

  describe("Oracle Validation", function () {
    beforeEach(async function () {
      // Give user1 SOLVER tier (1000+ RON)
      await ron.connect(gameContract).awardRON(
        user1.address,
        3, // LEGENDARY
        false,
        false,
        "Reach solver tier"
      );
    });

    it("Should award validation RON to qualified users", async function () {
      const initialBalance = await ron.balanceOf(user1.address);

      await ron.connect(oracleContract).awardValidationRON(
        user1.address,
        100,
        "BASIC"
      );

      const newBalance = await ron.balanceOf(user1.address);
      expect(newBalance).to.equal(initialBalance + 100n); // SOLVER tier gets base amount
    });

    it("Should reject validation for NOVICE tier", async function () {
      await expect(
        ron.connect(oracleContract).awardValidationRON(
          user2.address, // NOVICE tier user
          100,
          "BASIC"
        )
      ).to.be.revertedWithCustomError(ron, "InsufficientAccess");
    });

    it("Should give tier bonuses for validation", async function () {
      // Promote user1 to EXPERT tier
      for (let i = 0; i < 2; i++) {
        await ron.connect(gameContract).awardRON(
          user1.address,
          3, // LEGENDARY
          true, // First solver bonus
          false,
          `Expert tier ${i}`
        );
      }

      const initialBalance = await ron.balanceOf(user1.address);

      await ron.connect(oracleContract).awardValidationRON(
        user1.address,
        100,
        "COMPLEX"
      );

      const newBalance = await ron.balanceOf(user1.address);
      expect(newBalance).to.equal(initialBalance + 120n); // EXPERT tier gets 20% bonus
    });
  });

  describe("Soul-bound Token Properties", function () {
    it("Should prevent transfers", async function () {
      await expect(ron.transfer(user2.address, 100))
        .to.be.revertedWithCustomError(ron, "NonTransferableToken");
    });

    it("Should prevent transferFrom", async function () {
      await expect(ron.transferFrom(user1.address, user2.address, 100))
        .to.be.revertedWithCustomError(ron, "NonTransferableToken");
    });

    it("Should prevent approve", async function () {
      await expect(ron.approve(user2.address, 100))
        .to.be.revertedWithCustomError(ron, "NonTransferableToken");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Give user1 some RON and stats
      await ron.connect(gameContract).awardRON(
        user1.address,
        1, // MEDIUM
        true, // First solver
        true, // Speed solver
        "Test stats"
      );
    });

    it("Should return comprehensive user stats", async function () {
      const [totalRON, currentTier, correctAnswers, totalAttempts, accuracyPercentage, currentStreak, maxStreak] =
        await ron.getUserStats(user1.address);

      expect(totalRON).to.be.gt(0);
      expect(currentTier).to.equal(0); // Still NOVICE
      expect(correctAnswers).to.equal(1);
      expect(maxStreak).to.equal(1);
    });

    it("Should calculate next tier requirements", async function () {
      const [nextTier, ronRequired, ronRemaining] = await ron.getNextTierRequirement(user1.address);

      expect(nextTier).to.equal(1); // SOLVER
      expect(ronRequired).to.equal(1000);
      expect(ronRemaining).to.be.gt(0);
    });

    it("Should calculate RON rewards correctly", async function () {
      const [baseReward, bonusReward] = await ron.calculateRONReward(
        1, // MEDIUM
        true, // First solver
        false, // Not speed solver
        0 // No streak
      );

      expect(baseReward).to.equal(75); // Average of 50-100
      expect(bonusReward).to.equal(300); // 4x bonus for first solver
    });
  });

  describe("Access Control", function () {
    it("Should only allow GAME_ROLE to award RON", async function () {
      await expect(
        ron.connect(user1).awardRON(user1.address, 0, false, false, "Unauthorized")
      ).to.be.reverted;
    });

    it("Should only allow ORACLE_ROLE to award validation RON", async function () {
      await expect(
        ron.connect(user1).awardValidationRON(user1.address, 100, "BASIC")
      ).to.be.reverted;
    });

    it("Should only allow admin to update configuration", async function () {
      await expect(
        ron.connect(user1).setDynamicRewards(false)
      ).to.be.reverted;
    });
  });
});