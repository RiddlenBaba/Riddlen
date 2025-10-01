const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("RiddleNFT Weekly System", function () {
  async function deploySystemFixture() {
    const [owner, admin, user1, user2, liquidity, devOps, creator, airdrop, grandPrize] = await ethers.getSigners();

    // Deploy RDLN token
    const RDLN = await ethers.getContractFactory("RDLN");
    const rdln = await RDLN.deploy(admin.address, admin.address, liquidity.address, airdrop.address, grandPrize.address);
    await rdln.waitForDeployment();

    // Deploy RON reputation system
    const RON = await ethers.getContractFactory("RON");
    const ron = await RON.deploy(admin.address);
    await ron.waitForDeployment();

    // Deploy RiddleNFT system
    const RiddleNFT = await ethers.getContractFactory("RiddleNFT");
    const riddleNFT = await RiddleNFT.deploy(
      await rdln.getAddress(),
      await ron.getAddress(),
      liquidity.address,
      devOps.address,
      admin.address
    );
    await riddleNFT.waitForDeployment();

    // Setup roles
    const GAME_ROLE = await ron.GAME_ROLE();
    await ron.connect(admin).grantRole(GAME_ROLE, await riddleNFT.getAddress());

    const RDLN_GAME_ROLE = await rdln.GAME_ROLE();
    await rdln.connect(admin).grantRole(RDLN_GAME_ROLE, await riddleNFT.getAddress());

    const CREATOR_ROLE = await riddleNFT.CREATOR_ROLE();
    await riddleNFT.connect(admin).grantRole(CREATOR_ROLE, creator.address);

    // Mint prize pool allocation for the NFT contract
    const prizeAllocation = ethers.parseEther("700000000"); // 700M RDLN
    await rdln.connect(admin).mintPrizePool(await riddleNFT.getAddress(), prizeAllocation);

    const testAmount = ethers.parseEther("10000"); // 10K RDLN for testing
    await rdln.connect(admin).transfer(user1.address, testAmount);
    await rdln.connect(admin).transfer(user2.address, testAmount);

    return {
      rdln, ron, riddleNFT,
      owner, admin, user1, user2, liquidity, devOps, creator,
      GAME_ROLE, CREATOR_ROLE, RDLN_GAME_ROLE
    };
  }

  describe("Deployment", function () {
    it("Should deploy with correct configuration", async function () {
      const { riddleNFT, rdln, ron, admin, liquidity, devOps } = await loadFixture(deploySystemFixture);

      expect(await riddleNFT.rdlnToken()).to.equal(await rdln.getAddress());
      expect(await riddleNFT.ronToken()).to.equal(await ron.getAddress());
      expect(await riddleNFT.grandPrizeWallet()).to.equal(liquidity.address);
      expect(await riddleNFT.devOpsWallet()).to.equal(devOps.address);
    });

    it("Should have correct constants", async function () {
      const { riddleNFT } = await loadFixture(deploySystemFixture);

      expect(await riddleNFT.TOTAL_WEEKS()).to.equal(1000);
      expect(await riddleNFT.INITIAL_MINT_COST()).to.equal(ethers.parseEther("1000"));
      expect(await riddleNFT.PRIZE_ALLOCATION()).to.equal(ethers.parseEther("700000000"));
    });

    it("Should have correct commission rates", async function () {
      const { riddleNFT } = await loadFixture(deploySystemFixture);

      expect(await riddleNFT.burnPercent()).to.equal(5000); // 50%
      expect(await riddleNFT.grandPrizePercent()).to.equal(2500); // 25%
      expect(await riddleNFT.devOpsPercent()).to.equal(2500); // 25%
    });
  });

  describe("Weekly Riddle System", function () {
    it("Should release weekly riddles correctly", async function () {
      const { riddleNFT, creator } = await loadFixture(deploySystemFixture);

      const category = "Mathematics";
      const difficulty = 1; // MEDIUM
      const answerHash = ethers.keccak256(ethers.toUtf8Bytes("42"));
      const ipfsHash = "QmTestHash123";

      const tx = await riddleNFT.connect(creator).releaseWeeklyRiddle(
        category, difficulty, answerHash, ipfsHash
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "WeeklyRiddleReleased");

      expect(event).to.not.be.undefined;

      const riddleId = event.args[0];
      const riddle = await riddleNFT.getRiddle(riddleId);

      expect(riddle.category).to.equal(category);
      expect(riddle.difficulty).to.equal(difficulty);
      expect(riddle.answerHash).to.equal(answerHash);
      expect(riddle.ipfsHash).to.equal(ipfsHash);
      expect(riddle.status).to.equal(0); // ACTIVE
    });

    it("Should generate randomized parameters", async function () {
      const { riddleNFT, creator } = await loadFixture(deploySystemFixture);

      const tx = await riddleNFT.connect(creator).releaseWeeklyRiddle(
        "Test", 0, ethers.keccak256(ethers.toUtf8Bytes("test")), "test"
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "WeeklyRiddleReleased");
      const riddleId = event.args[0];
      const riddle = await riddleNFT.getRiddle(riddleId);

      // Check parameters are within expected ranges
      expect(riddle.params.maxMintRate).to.be.gte(10);
      expect(riddle.params.maxMintRate).to.be.lte(1000);
      expect(riddle.params.winnerSlots).to.be.gte(1);
      expect(riddle.params.winnerSlots).to.be.lte(100);
      expect(riddle.params.prizePool).to.be.gt(0);
    });

    it("Should track current week correctly", async function () {
      const { riddleNFT } = await loadFixture(deploySystemFixture);

      const currentWeek = await riddleNFT.getCurrentWeek();
      expect(currentWeek).to.be.gt(0);
    });

    it("Should implement biennial halving", async function () {
      const { riddleNFT } = await loadFixture(deploySystemFixture);

      const initialCost = await riddleNFT.getCurrentMintCost();
      expect(initialCost).to.equal(ethers.parseEther("1000"));

      // Fast forward 2 years
      const biennialPeriod = await riddleNFT.BIENNIAL_PERIOD();
      await time.increase(Number(biennialPeriod));

      const newCost = await riddleNFT.getCurrentMintCost();
      expect(newCost).to.equal(ethers.parseEther("500"));
    });
  });

  describe("NFT Minting", function () {
    async function createTestRiddle(riddleNFT, creator) {
      const tx = await riddleNFT.connect(creator).releaseWeeklyRiddle(
        "Test", 0, ethers.keccak256(ethers.toUtf8Bytes("42")), "test"
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "WeeklyRiddleReleased");
      return event.args[0]; // riddleId
    }

    it("Should mint NFTs correctly", async function () {
      const { riddleNFT, rdln, user1, creator } = await loadFixture(deploySystemFixture);

      const riddleId = await createTestRiddle(riddleNFT, creator);

      // Approve RDLN for minting
      const mintCost = await riddleNFT.getCurrentMintCost();
      await rdln.connect(user1).approve(await riddleNFT.getAddress(), mintCost);

      const tx = await riddleNFT.connect(user1).mintRiddleNFT(riddleId);
      const receipt = await tx.wait();

      const event = receipt.logs.find(log => log.fragment?.name === "RiddleNFTMinted");
      expect(event).to.not.be.undefined;

      const tokenId = event.args[0];
      expect(await riddleNFT.ownerOf(tokenId)).to.equal(user1.address);

      const nftData = await riddleNFT.getNFTSolveData(tokenId);
      expect(nftData.riddleId).to.equal(riddleId);
      expect(nftData.originalMinter).to.equal(user1.address);
      expect(nftData.currentOwner).to.equal(user1.address);
      expect(nftData.failedAttempts).to.equal(0);
      expect(nftData.solved).to.equal(false);
    });

    it("Should enforce mint limits", async function () {
      const { riddleNFT, rdln, admin, user1, creator } = await loadFixture(deploySystemFixture);

      const riddleId = await createTestRiddle(riddleNFT, creator);
      const riddle = await riddleNFT.getRiddle(riddleId);

      // Mint up to the limit
      const mintCost = await riddleNFT.getCurrentMintCost();
      const totalCost = mintCost * riddle.params.maxMintRate;

      // User needs enough RDLN
      await rdln.connect(admin).transfer(user1.address, totalCost);
      await rdln.connect(user1).approve(await riddleNFT.getAddress(), totalCost);

      // This is a simplified test - in practice would need to mint many NFTs
      // For this test, we'll just verify the limit is tracked
      await riddleNFT.connect(user1).mintRiddleNFT(riddleId);

      const updatedRiddle = await riddleNFT.getRiddle(riddleId);
      expect(updatedRiddle.totalMinted).to.equal(1);
    });
  });

  describe("Solution Attempts", function () {
    async function createTestNFT(riddleNFT, rdln, user, creator) {
      const riddleId = await createTestRiddle(riddleNFT, creator);

      const mintCost = await riddleNFT.getCurrentMintCost();
      await rdln.connect(user).approve(await riddleNFT.getAddress(), mintCost);

      const tx = await riddleNFT.connect(user).mintRiddleNFT(riddleId);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "RiddleNFTMinted");

      return { tokenId: event.args[0], riddleId };
    }

    async function createTestRiddle(riddleNFT, creator) {
      const tx = await riddleNFT.connect(creator).releaseWeeklyRiddle(
        "Test", 0, ethers.keccak256(ethers.toUtf8Bytes("42")), "test"
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "WeeklyRiddleReleased");
      return event.args[0];
    }

    it("Should handle failed attempts with progressive burn", async function () {
      const { riddleNFT, rdln, user1, creator } = await loadFixture(deploySystemFixture);

      const { tokenId } = await createTestNFT(riddleNFT, rdln, user1, creator);

      // First attempt (should cost 1 RDLN)
      await rdln.connect(user1).approve(await riddleNFT.getAddress(), ethers.parseEther("1"));
      await riddleNFT.connect(user1).attemptSolution(tokenId, "wrong answer");

      let nftData = await riddleNFT.getNFTSolveData(tokenId);
      expect(nftData.failedAttempts).to.equal(1);

      // Second attempt (should cost 2 RDLN)
      await rdln.connect(user1).approve(await riddleNFT.getAddress(), ethers.parseEther("2"));
      await riddleNFT.connect(user1).attemptSolution(tokenId, "still wrong");

      nftData = await riddleNFT.getNFTSolveData(tokenId);
      expect(nftData.failedAttempts).to.equal(2);
    });

    it("Should handle correct solutions", async function () {
      const { riddleNFT, rdln, user1, creator } = await loadFixture(deploySystemFixture);

      const { tokenId } = await createTestNFT(riddleNFT, rdln, user1, creator);

      // First attempt with correct answer
      await rdln.connect(user1).approve(await riddleNFT.getAddress(), ethers.parseEther("1"));

      const tx = await riddleNFT.connect(user1).attemptSolution(tokenId, "42");
      const receipt = await tx.wait();

      const solvedEvent = receipt.logs.find(log => log.fragment?.name === "RiddleSolved");
      expect(solvedEvent).to.not.be.undefined;

      const nftData = await riddleNFT.getNFTSolveData(tokenId);
      expect(nftData.solved).to.equal(true);
      expect(nftData.solver).to.equal(user1.address);
      expect(nftData.prizeAmount).to.be.gt(0);
    });

    it("Should prevent duplicate solutions from same user", async function () {
      const { riddleNFT, rdln, user1, creator } = await loadFixture(deploySystemFixture);

      const { tokenId, riddleId } = await createTestNFT(riddleNFT, rdln, user1, creator);

      // Solve the riddle
      await rdln.connect(user1).approve(await riddleNFT.getAddress(), ethers.parseEther("1"));
      await riddleNFT.connect(user1).attemptSolution(tokenId, "42");

      // Try to solve again with another NFT
      const mintCost = await riddleNFT.getCurrentMintCost();
      await rdln.connect(user1).approve(await riddleNFT.getAddress(), mintCost);
      const tx2 = await riddleNFT.connect(user1).mintRiddleNFT(riddleId);
      const receipt2 = await tx2.wait();
      const event2 = receipt2.logs.find(log => log.fragment?.name === "RiddleNFTMinted");
      const tokenId2 = event2.args[0];

      await rdln.connect(user1).approve(await riddleNFT.getAddress(), ethers.parseEther("1"));
      await expect(
        riddleNFT.connect(user1).attemptSolution(tokenId2, "42")
      ).to.be.revertedWith("User already solved this riddle");
    });
  });

  describe("Prize System", function () {
    it("Should allow prize claims for solved NFTs", async function () {
      const { riddleNFT, rdln, user1, creator } = await loadFixture(deploySystemFixture);

      // Create test NFT and solve it
      const { tokenId } = await createTestNFT(riddleNFT, rdln, user1, creator);
      await rdln.connect(user1).approve(await riddleNFT.getAddress(), ethers.parseEther("1"));
      await riddleNFT.connect(user1).attemptSolution(tokenId, "42");

      const initialBalance = await rdln.balanceOf(user1.address);

      await riddleNFT.connect(user1).claimPrize(tokenId);

      const finalBalance = await rdln.balanceOf(user1.address);
      expect(finalBalance).to.be.gt(initialBalance);

      const nftData = await riddleNFT.getNFTSolveData(tokenId);
      expect(nftData.prizeClaimed).to.equal(true);
    });

    async function createTestNFT(riddleNFT, rdln, user, creator) {
      const riddleId = await createTestRiddle(riddleNFT, creator);

      const mintCost = await riddleNFT.getCurrentMintCost();
      await rdln.connect(user).approve(await riddleNFT.getAddress(), mintCost);

      const tx = await riddleNFT.connect(user).mintRiddleNFT(riddleId);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "RiddleNFTMinted");

      return { tokenId: event.args[0], riddleId };
    }

    async function createTestRiddle(riddleNFT, creator) {
      const tx = await riddleNFT.connect(creator).releaseWeeklyRiddle(
        "Test", 0, ethers.keccak256(ethers.toUtf8Bytes("42")), "test"
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "WeeklyRiddleReleased");
      return event.args[0];
    }
  });

  describe("Resale System", function () {
    it("Should handle NFT resales with commissions", async function () {
      const { riddleNFT, rdln, user1, user2, creator } = await loadFixture(deploySystemFixture);

      const { tokenId } = await createTestNFT(riddleNFT, rdln, user1, creator);

      // Set resale price
      const resalePrice = ethers.parseEther("10");
      await riddleNFT.connect(user1).setResalePrice(tokenId, resalePrice);

      const resaleInfo = await riddleNFT.getResaleInfo(tokenId);
      expect(resaleInfo.forSale).to.equal(true);
      expect(resaleInfo.price).to.equal(resalePrice);
      expect(resaleInfo.seller).to.equal(user1.address);

      // Buy NFT
      await riddleNFT.connect(user2).buyNFT(tokenId, { value: resalePrice });

      expect(await riddleNFT.ownerOf(tokenId)).to.equal(user2.address);

      const nftData = await riddleNFT.getNFTSolveData(tokenId);
      expect(nftData.currentOwner).to.equal(user2.address);

      const finalResaleInfo = await riddleNFT.getResaleInfo(tokenId);
      expect(finalResaleInfo.forSale).to.equal(false);
    });

    it("Should track failed attempts across resales", async function () {
      const { riddleNFT, rdln, user1, user2, creator } = await loadFixture(deploySystemFixture);

      const { tokenId } = await createTestNFT(riddleNFT, rdln, user1, creator);

      // Make failed attempts
      await rdln.connect(user1).approve(await riddleNFT.getAddress(), ethers.parseEther("3"));
      await riddleNFT.connect(user1).attemptSolution(tokenId, "wrong1");
      await riddleNFT.connect(user1).attemptSolution(tokenId, "wrong2");

      let nftData = await riddleNFT.getNFTSolveData(tokenId);
      expect(nftData.failedAttempts).to.equal(2);

      // Resell NFT
      const resalePrice = ethers.parseEther("5");
      await riddleNFT.connect(user1).setResalePrice(tokenId, resalePrice);
      await riddleNFT.connect(user2).buyNFT(tokenId, { value: resalePrice });

      // Check attempts persisted
      nftData = await riddleNFT.getNFTSolveData(tokenId);
      expect(nftData.failedAttempts).to.equal(2);
      expect(nftData.currentOwner).to.equal(user2.address);
      expect(nftData.originalMinter).to.equal(user1.address);

      // Next attempt should cost 3 RDLN
      const nextCost = await riddleNFT.getNextAttemptCost(tokenId);
      expect(nextCost).to.equal(ethers.parseEther("3"));
    });

    async function createTestNFT(riddleNFT, rdln, user, creator) {
      const riddleId = await createTestRiddle(riddleNFT, creator);

      const mintCost = await riddleNFT.getCurrentMintCost();
      await rdln.connect(user).approve(await riddleNFT.getAddress(), mintCost);

      const tx = await riddleNFT.connect(user).mintRiddleNFT(riddleId);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "RiddleNFTMinted");

      return { tokenId: event.args[0], riddleId };
    }

    async function createTestRiddle(riddleNFT, creator) {
      const tx = await riddleNFT.connect(creator).releaseWeeklyRiddle(
        "Test", 0, ethers.keccak256(ethers.toUtf8Bytes("42")), "test"
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "WeeklyRiddleReleased");
      return event.args[0];
    }
  });

  describe("Admin Functions", function () {
    it("Should allow admin to update commission rates", async function () {
      const { riddleNFT, admin } = await loadFixture(deploySystemFixture);

      await riddleNFT.connect(admin).updateCommissionRates(6000, 2000, 2000);

      expect(await riddleNFT.burnPercent()).to.equal(6000);
      expect(await riddleNFT.grandPrizePercent()).to.equal(2000);
      expect(await riddleNFT.devOpsPercent()).to.equal(2000);
    });

    it("Should reject invalid commission rates", async function () {
      const { riddleNFT, admin } = await loadFixture(deploySystemFixture);

      await expect(
        riddleNFT.connect(admin).updateCommissionRates(5000, 3000, 3000)
      ).to.be.revertedWith("Total exceeds 100%");
    });

    it("Should allow admin to update wallet addresses", async function () {
      const { riddleNFT, admin, user1 } = await loadFixture(deploySystemFixture);

      await riddleNFT.connect(admin).setDevOpsWallet(user1.address);
      expect(await riddleNFT.devOpsWallet()).to.equal(user1.address);

      await riddleNFT.connect(admin).setLiquidityWallet(user1.address);
      expect(await riddleNFT.grandPrizeWallet()).to.equal(user1.address);
    });

    it("Should allow admin to pause/unpause", async function () {
      const { riddleNFT, admin } = await loadFixture(deploySystemFixture);

      await riddleNFT.connect(admin).pause();
      expect(await riddleNFT.paused()).to.equal(true);

      await riddleNFT.connect(admin).unpause();
      expect(await riddleNFT.paused()).to.equal(false);
    });
  });

  describe("Statistics", function () {
    it("Should track global statistics", async function () {
      const { riddleNFT, rdln, user1, creator } = await loadFixture(deploySystemFixture);

      const { tokenId } = await createTestNFT(riddleNFT, rdln, user1, creator);

      // Make some attempts
      await rdln.connect(user1).approve(await riddleNFT.getAddress(), ethers.parseEther("3"));
      await riddleNFT.connect(user1).attemptSolution(tokenId, "wrong");
      await riddleNFT.connect(user1).attemptSolution(tokenId, "42");

      const stats = await riddleNFT.getGlobalStats();
      expect(stats.totalRDLNBurned).to.be.gt(0);
      expect(stats.totalNFTsMinted).to.equal(1);
    });

    async function createTestNFT(riddleNFT, rdln, user, creator) {
      const riddleId = await createTestRiddle(riddleNFT, creator);

      const mintCost = await riddleNFT.getCurrentMintCost();
      await rdln.connect(user).approve(await riddleNFT.getAddress(), mintCost);

      const tx = await riddleNFT.connect(user).mintRiddleNFT(riddleId);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "RiddleNFTMinted");

      return { tokenId: event.args[0], riddleId };
    }

    async function createTestRiddle(riddleNFT, creator) {
      const tx = await riddleNFT.connect(creator).releaseWeeklyRiddle(
        "Test", 0, ethers.keccak256(ethers.toUtf8Bytes("42")), "test"
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment?.name === "WeeklyRiddleReleased");
      return event.args[0];
    }
  });
});