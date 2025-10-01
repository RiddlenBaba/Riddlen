const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RDLN Token", function () {
  let rdln;
  let owner, treasury, liquidity, airdrop, gameContract, user1, user2;

  beforeEach(async function () {
    [owner, treasury, liquidity, airdrop, gameContract, user1, user2, grandPrize] = await ethers.getSigners();

    const RDLN = await ethers.getContractFactory("RDLN");
    rdln = await RDLN.deploy(
      owner.address,
      treasury.address,
      liquidity.address,
      airdrop.address,
      grandPrize.address
    );
    await rdln.waitForDeployment();

    // Grant GAME_ROLE to gameContract for testing
    const GAME_ROLE = await rdln.GAME_ROLE();
    await rdln.grantRole(GAME_ROLE, gameContract.address);
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await rdln.name()).to.equal("Riddlen");
      expect(await rdln.symbol()).to.equal("RDLN");
    });

    it("Should set the correct allocations", async function () {
      expect(await rdln.TOTAL_SUPPLY()).to.equal(ethers.parseEther("1000000000")); // 1B
      expect(await rdln.PRIZE_POOL_ALLOCATION()).to.equal(ethers.parseEther("700000000")); // 700M
      expect(await rdln.TREASURY_ALLOCATION()).to.equal(ethers.parseEther("100000000")); // 100M
      expect(await rdln.AIRDROP_ALLOCATION()).to.equal(ethers.parseEther("100000000")); // 100M
      expect(await rdln.LIQUIDITY_ALLOCATION()).to.equal(ethers.parseEther("100000000")); // 100M
    });

    it("Should mint 1M tokens to admin on deployment", async function () {
      expect(await rdln.balanceOf(owner.address)).to.equal(ethers.parseEther("1000000"));
    });

    it("Should set the correct wallet addresses", async function () {
      expect(await rdln.treasuryWallet()).to.equal(treasury.address);
      expect(await rdln.liquidityWallet()).to.equal(liquidity.address);
      expect(await rdln.airdropWallet()).to.equal(airdrop.address);
    });
  });

  describe("Allocation Minting", function () {
    it("Should mint prize pool tokens correctly", async function () {
      const amount = ethers.parseEther("1000000"); // 1M tokens
      await rdln.mintPrizePool(user1.address, amount);

      expect(await rdln.balanceOf(user1.address)).to.equal(amount);
      expect(await rdln.prizePoolMinted()).to.equal(amount);
    });

    it("Should revert when exceeding prize pool allocation", async function () {
      const amount = ethers.parseEther("700000001"); // Exceed 700M limit
      await expect(rdln.mintPrizePool(user1.address, amount))
        .to.be.revertedWithCustomError(rdln, "AllocationExceeded");
    });

    it("Should mint treasury tokens correctly", async function () {
      const amount = ethers.parseEther("50000000"); // 50M tokens
      await rdln.mintTreasury(treasury.address, amount);

      expect(await rdln.balanceOf(treasury.address)).to.equal(amount);
      expect(await rdln.treasuryMinted()).to.equal(amount);
    });

    it("Should mint airdrop tokens correctly", async function () {
      const amount = ethers.parseEther("10000000"); // 10M tokens
      await rdln.mintAirdrop(airdrop.address, amount);

      expect(await rdln.balanceOf(airdrop.address)).to.equal(amount);
      expect(await rdln.airdropMinted()).to.equal(amount);
    });

    it("Should mint liquidity tokens correctly", async function () {
      const amount = ethers.parseEther("25000000"); // 25M tokens
      await rdln.mintLiquidity(liquidity.address, amount);

      expect(await rdln.balanceOf(liquidity.address)).to.equal(amount);
      expect(await rdln.liquidityMinted()).to.equal(amount);
    });
  });

  describe("Game Mechanics", function () {
    beforeEach(async function () {
      // Give user1 some tokens for testing burns
      await rdln.mintPrizePool(user1.address, ethers.parseEther("1000"));
    });

    it("Should burn tokens for failed attempts with progressive cost", async function () {
      const initialBalance = await rdln.balanceOf(user1.address);

      // First failed attempt: 1 RDLN
      await rdln.connect(gameContract).burnFailedAttempt(user1.address);
      expect(await rdln.balanceOf(user1.address)).to.equal(initialBalance - ethers.parseEther("1"));
      expect(await rdln.failedAttempts(user1.address)).to.equal(1);

      // Second failed attempt: 2 RDLN
      await rdln.connect(gameContract).burnFailedAttempt(user1.address);
      expect(await rdln.balanceOf(user1.address)).to.equal(initialBalance - ethers.parseEther("3")); // 1 + 2
      expect(await rdln.failedAttempts(user1.address)).to.equal(2);
    });

    it("Should burn tokens for question submissions with progressive cost", async function () {
      const initialBalance = await rdln.balanceOf(user1.address);

      // First question: 1 RDLN
      await rdln.connect(gameContract).burnQuestionSubmission(user1.address);
      expect(await rdln.balanceOf(user1.address)).to.equal(initialBalance - ethers.parseEther("1"));
      expect(await rdln.questionsSubmitted(user1.address)).to.equal(1);

      // Second question: 2 RDLN
      await rdln.connect(gameContract).burnQuestionSubmission(user1.address);
      expect(await rdln.balanceOf(user1.address)).to.equal(initialBalance - ethers.parseEther("3")); // 1 + 2
      expect(await rdln.questionsSubmitted(user1.address)).to.equal(2);
    });

    it("Should burn tokens for NFT minting", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await rdln.balanceOf(user1.address);

      await rdln.connect(gameContract).burnNFTMint(user1.address, burnAmount);
      expect(await rdln.balanceOf(user1.address)).to.equal(initialBalance - burnAmount);
    });

    it("Should revert burns when user has insufficient balance", async function () {
      const largeAmount = ethers.parseEther("10000"); // More than user1 has
      await expect(rdln.connect(gameContract).burnNFTMint(user1.address, largeAmount))
        .to.be.revertedWithCustomError(rdln, "InsufficientBalance");
    });

    it("Should only allow game contracts to burn tokens", async function () {
      await expect(rdln.connect(user1).burnFailedAttempt(user1.address))
        .to.be.reverted;
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await rdln.mintPrizePool(user1.address, ethers.parseEther("1000"));
      await rdln.connect(gameContract).burnFailedAttempt(user1.address);
      await rdln.connect(gameContract).burnQuestionSubmission(user1.address);
    });

    it("Should return correct remaining allocations", async function () {
      const minted = ethers.parseEther("1000");
      const [prizePool, treasury, airdrop, liquidity] = await rdln.getRemainingAllocations();

      expect(prizePool).to.equal(ethers.parseEther("700000000") - minted);
      expect(treasury).to.equal(ethers.parseEther("100000000"));
      expect(airdrop).to.equal(ethers.parseEther("100000000"));
      expect(liquidity).to.equal(ethers.parseEther("100000000"));
    });

    it("Should return correct burn statistics", async function () {
      const [totalBurned, gameplayBurned, transferBurned, currentSupply] = await rdln.getBurnStats();

      expect(gameplayBurned).to.equal(ethers.parseEther("1")); // 1 from burns above
      expect(totalBurned).to.equal(ethers.parseEther("1"));
      expect(transferBurned).to.equal(0);
    });

    it("Should return correct user statistics", async function () {
      const [failedAttempts, questionsSubmitted, balance] = await rdln.getUserStats(user1.address);

      expect(failedAttempts).to.equal(1);
      expect(questionsSubmitted).to.equal(1);
      expect(balance).to.equal(ethers.parseEther("998")); // 1000 - 1 - 1
    });

    it("Should calculate next burn costs correctly", async function () {
      expect(await rdln.getNextFailedAttemptCost(user1.address)).to.equal(ethers.parseEther("2"));
      expect(await rdln.getNextQuestionCost(user1.address)).to.equal(ethers.parseEther("2"));
    });
  });

  describe("Access Control", function () {
    it("Should allow admin to grant roles", async function () {
      const MINTER_ROLE = await rdln.MINTER_ROLE();
      await rdln.grantRole(MINTER_ROLE, user1.address);
      expect(await rdln.hasRole(MINTER_ROLE, user1.address)).to.be.true;
    });

    it("Should not allow non-admin to grant roles", async function () {
      const MINTER_ROLE = await rdln.MINTER_ROLE();
      await expect(rdln.connect(user1).grantRole(MINTER_ROLE, user2.address))
        .to.be.reverted;
    });
  });
});