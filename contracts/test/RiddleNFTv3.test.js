const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("RiddleNFTv3 - Biennial Halving System", function () {
    let nftContract, rdlnToken;
    let owner, player1, player2, operator;

    const INITIAL_NFT_COST = ethers.parseEther("1000");
    const INITIAL_ATTEMPT_BASE = ethers.parseEther("1");
    const INITIAL_SUBMISSION_BASE = ethers.parseEther("1");
    const ERA_DURATION = 2 * 365 * 24 * 60 * 60; // 2 years in seconds

    beforeEach(async function () {
        [owner, player1, player2, operator] = await ethers.getSigners();

        // Deploy RDLN token
        const RDLN = await ethers.getContractFactory("RDLN");
        rdlnToken = await RDLN.deploy(
            owner.address,
            owner.address,
            owner.address,
            owner.address,
            owner.address
        );
        await rdlnToken.waitForDeployment();

        // Deploy a mock RON token for testing
        const MockRON = await ethers.getContractFactory("RDLN"); // Using RDLN as mock
        const ronToken = await MockRON.deploy(
            owner.address,
            owner.address,
            owner.address,
            owner.address,
            owner.address
        );
        await ronToken.waitForDeployment();

        // Deploy RiddleNFTv3
        const RiddleNFT = await ethers.getContractFactory("RiddleNFTv3");
        nftContract = await RiddleNFT.deploy(
            await rdlnToken.getAddress(),
            await ronToken.getAddress(),
            owner.address,  // grandPrizeWallet
            owner.address,  // devOpsWallet
            owner.address,  // admin
            "https://api.riddlen.com/metadata/"  // baseURI
        );
        await nftContract.waitForDeployment();

        // Grant roles
        const OPERATOR_ROLE = await nftContract.OPERATOR_ROLE();
        await nftContract.grantRole(OPERATOR_ROLE, operator.address);

        // Give players tokens
        await rdlnToken.mintPrizePool(player1.address, ethers.parseEther("100000"));
        await rdlnToken.mintPrizePool(player2.address, ethers.parseEther("100000"));

        // Approve NFT contract
        await rdlnToken.connect(player1).approve(await nftContract.getAddress(), ethers.parseEther("100000"));
        await rdlnToken.connect(player2).approve(await nftContract.getAddress(), ethers.parseEther("100000"));
    });

    describe("Era System", function () {
        it("Should start in Era 0", async function () {
            expect(await nftContract.getCurrentEra()).to.equal(0);
        });

        it("Should calculate era correctly", async function () {
            const deployTime = await time.latest();

            // Era 0: 2025-2026
            expect(await nftContract.getCurrentEra()).to.equal(0);

            // Fast forward 2 years to Era 1: 2027-2028
            await time.increaseTo(deployTime + ERA_DURATION);
            expect(await nftContract.getCurrentEra()).to.equal(1);

            // Fast forward another 2 years to Era 2: 2029-2030
            await time.increaseTo(deployTime + ERA_DURATION * 2);
            expect(await nftContract.getCurrentEra()).to.equal(2);
        });

        it("Should return correct era costs", async function () {
            const [nftCost0, attemptCost0, submissionCost0] = await nftContract.getEraCosts(0);
            expect(nftCost0).to.equal(INITIAL_NFT_COST);
            expect(attemptCost0).to.equal(INITIAL_ATTEMPT_BASE);
            expect(submissionCost0).to.equal(INITIAL_SUBMISSION_BASE);

            const [nftCost1, attemptCost1, submissionCost1] = await nftContract.getEraCosts(1);
            expect(nftCost1).to.equal(INITIAL_NFT_COST / 2n);
            expect(attemptCost1).to.equal(INITIAL_ATTEMPT_BASE / 2n);
            expect(submissionCost1).to.equal(INITIAL_SUBMISSION_BASE / 2n);

            const [nftCost2, attemptCost2, submissionCost2] = await nftContract.getEraCosts(2);
            expect(nftCost2).to.equal(INITIAL_NFT_COST / 4n);
            expect(attemptCost2).to.equal(INITIAL_ATTEMPT_BASE / 4n);
            expect(submissionCost2).to.equal(INITIAL_SUBMISSION_BASE / 4n);
        });
    });

    describe("NFT Minting with Era Locking", function () {
        it("Should mint NFT with Era 0 costs", async function () {
            await expect(nftContract.connect(player1).mintNFT())
                .to.emit(nftContract, "Transfer")
                .withArgs(ethers.ZeroAddress, player1.address, 1);

            const nftEra = await nftContract.getNFTEra(1);
            expect(nftEra).to.equal(0);

            const [nftCost, attemptBase, submissionBase] = await nftContract.getNFTCosts(1);
            expect(nftCost).to.equal(INITIAL_NFT_COST);
            expect(attemptBase).to.equal(INITIAL_ATTEMPT_BASE);
            expect(submissionBase).to.equal(INITIAL_SUBMISSION_BASE);
        });

        it("Should mint NFT with Era 1 costs after 2 years", async function () {
            const deployTime = await time.latest();
            await time.increaseTo(deployTime + ERA_DURATION);

            await expect(nftContract.connect(player1).mintNFT())
                .to.emit(nftContract, "Transfer")
                .withArgs(ethers.ZeroAddress, player1.address, 1);

            const nftEra = await nftContract.getNFTEra(1);
            expect(nftEra).to.equal(1);

            const [nftCost, attemptBase, submissionBase] = await nftContract.getNFTCosts(1);
            expect(nftCost).to.equal(INITIAL_NFT_COST / 2n);
            expect(attemptBase).to.equal(INITIAL_ATTEMPT_BASE / 2n);
            expect(submissionBase).to.equal(INITIAL_SUBMISSION_BASE / 2n);
        });

        it("Should charge correct mint cost based on current era", async function () {
            const initialBalance = await rdlnToken.balanceOf(player1.address);

            // Mint in Era 0
            await nftContract.connect(player1).mintNFT();
            expect(await rdlnToken.balanceOf(player1.address)).to.equal(initialBalance - INITIAL_NFT_COST);

            // Fast forward to Era 1
            const deployTime = await time.latest();
            await time.increaseTo(deployTime + ERA_DURATION);

            // Mint in Era 1 (should cost half)
            const balanceAfterFirst = await rdlnToken.balanceOf(player1.address);
            await nftContract.connect(player1).mintNFT();
            expect(await rdlnToken.balanceOf(player1.address)).to.equal(balanceAfterFirst - (INITIAL_NFT_COST / 2n));
        });
    });

    describe("Era-Locked Cost Persistence", function () {
        let tokenId;

        beforeEach(async function () {
            await nftContract.connect(player1).mintNFT();
            tokenId = 1;
        });

        it("Should preserve NFT era costs after global era changes", async function () {
            // Verify initial Era 0 costs
            const [nftCost, attemptBase, submissionBase] = await nftContract.getNFTCosts(tokenId);
            expect(nftCost).to.equal(INITIAL_NFT_COST);
            expect(attemptBase).to.equal(INITIAL_ATTEMPT_BASE);
            expect(submissionBase).to.equal(INITIAL_SUBMISSION_BASE);

            // Fast forward to Era 2
            const deployTime = await time.latest();
            await time.increaseTo(deployTime + ERA_DURATION * 2);
            expect(await nftContract.getCurrentEra()).to.equal(2);

            // NFT should still have Era 0 costs
            const [nftCost2, attemptBase2, submissionBase2] = await nftContract.getNFTCosts(tokenId);
            expect(nftCost2).to.equal(INITIAL_NFT_COST);
            expect(attemptBase2).to.equal(INITIAL_ATTEMPT_BASE);
            expect(submissionBase2).to.equal(INITIAL_SUBMISSION_BASE);
        });

        it("Should preserve era costs through transfers", async function () {
            // Transfer NFT to player2
            await nftContract.connect(player1).transferFrom(player1.address, player2.address, tokenId);
            expect(await nftContract.ownerOf(tokenId)).to.equal(player2.address);

            // Era and costs should remain the same
            expect(await nftContract.getNFTEra(tokenId)).to.equal(0);
            const [nftCost, attemptBase, submissionBase] = await nftContract.getNFTCosts(tokenId);
            expect(nftCost).to.equal(INITIAL_NFT_COST);
            expect(attemptBase).to.equal(INITIAL_ATTEMPT_BASE);
            expect(submissionBase).to.equal(INITIAL_SUBMISSION_BASE);
        });

        it("Should preserve era costs through marketplace sales", async function () {
            // Approve and transfer (simulating marketplace sale)
            await nftContract.connect(player1).approve(player2.address, tokenId);
            await nftContract.connect(player2).transferFrom(player1.address, player2.address, tokenId);

            // Era and costs should remain locked
            expect(await nftContract.getNFTEra(tokenId)).to.equal(0);
            const [nftCost, attemptBase, submissionBase] = await nftContract.getNFTCosts(tokenId);
            expect(nftCost).to.equal(INITIAL_NFT_COST);
            expect(attemptBase).to.equal(INITIAL_ATTEMPT_BASE);
            expect(submissionBase).to.equal(INITIAL_SUBMISSION_BASE);
        });
    });

    describe("Progressive Attempt Cost Calculation", function () {
        let tokenId;

        beforeEach(async function () {
            await nftContract.connect(player1).mintNFT();
            tokenId = 1;
        });

        it("Should calculate progressive attempt costs correctly for Era 0 NFT", async function () {
            // First attempt: 1 * (0 + 1) = 1 RDLN
            expect(await nftContract.calculateAttemptCost(tokenId)).to.equal(INITIAL_ATTEMPT_BASE);

            // Make an attempt to increase count
            await nftContract.connect(operator).recordAttempt(tokenId, false);

            // Second attempt: 1 * (1 + 1) = 2 RDLN
            expect(await nftContract.calculateAttemptCost(tokenId)).to.equal(INITIAL_ATTEMPT_BASE * 2n);

            // Make more attempts
            await nftContract.connect(operator).recordAttempt(tokenId, false);
            await nftContract.connect(operator).recordAttempt(tokenId, false);
            await nftContract.connect(operator).recordAttempt(tokenId, false);

            // Fifth attempt: 1 * (4 + 1) = 5 RDLN
            expect(await nftContract.calculateAttemptCost(tokenId)).to.equal(INITIAL_ATTEMPT_BASE * 5n);
        });

        it("Should calculate progressive submission costs correctly for Era 0 NFT", async function () {
            // First submission: 1 * (0 + 1) = 1 RDLN
            expect(await nftContract.calculateSubmissionCost(tokenId)).to.equal(INITIAL_SUBMISSION_BASE);

            // Make a submission to increase count
            await nftContract.connect(operator).recordSubmission(tokenId, "test question 1");

            // Second submission: 1 * (1 + 1) = 2 RDLN
            expect(await nftContract.calculateSubmissionCost(tokenId)).to.equal(INITIAL_SUBMISSION_BASE * 2n);

            // Make another submission
            await nftContract.connect(operator).recordSubmission(tokenId, "test question 2");

            // Third submission: 1 * (2 + 1) = 3 RDLN
            expect(await nftContract.calculateSubmissionCost(tokenId)).to.equal(INITIAL_SUBMISSION_BASE * 3n);
        });
    });

    describe("Era 1 NFT Cost Mechanics", function () {
        let era1TokenId;

        beforeEach(async function () {
            // Fast forward to Era 1
            const deployTime = await time.latest();
            await time.increaseTo(deployTime + ERA_DURATION);

            await nftContract.connect(player1).mintNFT();
            era1TokenId = 1;
        });

        it("Should calculate halved progressive costs for Era 1 NFT", async function () {
            const halfAttemptBase = INITIAL_ATTEMPT_BASE / 2n;
            const halfSubmissionBase = INITIAL_SUBMISSION_BASE / 2n;

            // First attempt: 0.5 * (0 + 1) = 0.5 RDLN
            expect(await nftContract.calculateAttemptCost(era1TokenId)).to.equal(halfAttemptBase);

            // Make an attempt and check next cost
            await nftContract.connect(operator).recordAttempt(era1TokenId, false);
            expect(await nftContract.calculateAttemptCost(era1TokenId)).to.equal(halfAttemptBase * 2n);

            // First submission: 0.5 * (0 + 1) = 0.5 RDLN
            expect(await nftContract.calculateSubmissionCost(era1TokenId)).to.equal(halfSubmissionBase);

            // Make a submission and check next cost
            await nftContract.connect(operator).recordSubmission(era1TokenId, "test");
            expect(await nftContract.calculateSubmissionCost(era1TokenId)).to.equal(halfSubmissionBase * 2n);
        });

        it("Should maintain Era 1 costs even after advancing to Era 2", async function () {
            // Fast forward to Era 2
            const currentTime = await time.latest();
            await time.increaseTo(currentTime + ERA_DURATION);
            expect(await nftContract.getCurrentEra()).to.equal(2);

            // Era 1 NFT should still use Era 1 costs
            const halfAttemptBase = INITIAL_ATTEMPT_BASE / 2n;
            expect(await nftContract.calculateAttemptCost(era1TokenId)).to.equal(halfAttemptBase);

            // Make an attempt and verify progression still uses Era 1 base
            await nftContract.connect(operator).recordAttempt(era1TokenId, false);
            expect(await nftContract.calculateAttemptCost(era1TokenId)).to.equal(halfAttemptBase * 2n);
        });
    });

    describe("Mixed Era NFTs", function () {
        let era0TokenId, era1TokenId, era2TokenId;

        it("Should handle multiple NFTs from different eras correctly", async function () {
            // Mint Era 0 NFT
            await nftContract.connect(player1).mintNFT();
            era0TokenId = 1;

            // Advance to Era 1 and mint
            const deployTime = await time.latest();
            await time.increaseTo(deployTime + ERA_DURATION);
            await nftContract.connect(player1).mintNFT();
            era1TokenId = 2;

            // Advance to Era 2 and mint
            await time.increaseTo(deployTime + ERA_DURATION * 2);
            await nftContract.connect(player1).mintNFT();
            era2TokenId = 3;

            // Verify each NFT maintains its era-specific costs
            expect(await nftContract.calculateAttemptCost(era0TokenId)).to.equal(INITIAL_ATTEMPT_BASE);
            expect(await nftContract.calculateAttemptCost(era1TokenId)).to.equal(INITIAL_ATTEMPT_BASE / 2n);
            expect(await nftContract.calculateAttemptCost(era2TokenId)).to.equal(INITIAL_ATTEMPT_BASE / 4n);

            // Make 2 attempts on each NFT to test progression
            await nftContract.connect(operator).recordAttempt(era0TokenId, false);
            await nftContract.connect(operator).recordAttempt(era0TokenId, false);
            await nftContract.connect(operator).recordAttempt(era1TokenId, false);
            await nftContract.connect(operator).recordAttempt(era1TokenId, false);
            await nftContract.connect(operator).recordAttempt(era2TokenId, false);
            await nftContract.connect(operator).recordAttempt(era2TokenId, false);

            // Verify progressive scaling works for each era (3rd attempt)
            expect(await nftContract.calculateAttemptCost(era0TokenId)).to.equal(INITIAL_ATTEMPT_BASE * 3n);
            expect(await nftContract.calculateAttemptCost(era1TokenId)).to.equal((INITIAL_ATTEMPT_BASE / 2n) * 3n);
            expect(await nftContract.calculateAttemptCost(era2TokenId)).to.equal((INITIAL_ATTEMPT_BASE / 4n) * 3n);
        });
    });

    describe("Game Integration", function () {
        let tokenId;

        beforeEach(async function () {
            await nftContract.connect(player1).mintNFT();
            tokenId = 1;

            // Mock some attempts and submissions
            await nftContract.connect(operator).recordAttempt(tokenId, false);
            await nftContract.connect(operator).recordAttempt(tokenId, false);
            await nftContract.connect(operator).recordSubmission(tokenId, "test question");
        });

        it("Should track attempts and submissions correctly", async function () {
            expect(await nftContract.getAttemptCount(tokenId)).to.equal(2);
            expect(await nftContract.getSubmissionCount(tokenId)).to.equal(1);
        });

        it("Should calculate next attempt cost based on current count", async function () {
            // Next attempt would be the 3rd (index 2), so cost = 1 * (2 + 1) = 3 RDLN
            const nextCost = await nftContract.getNextAttemptCost(tokenId);
            expect(nextCost).to.equal(INITIAL_ATTEMPT_BASE * 3n);
        });

        it("Should calculate next submission cost based on current count", async function () {
            // Next submission would be the 2nd (index 1), so cost = 1 * (1 + 1) = 2 RDLN
            const nextCost = await nftContract.getNextSubmissionCost(tokenId);
            expect(nextCost).to.equal(INITIAL_SUBMISSION_BASE * 2n);
        });
    });

    describe("Economic Simulation", function () {
        it("Should demonstrate cost reduction over eras", async function () {
            const deployTime = await time.latest();

            // Era 0 costs
            console.log("Era 0 Economics:");
            console.log(`  NFT Cost: ${ethers.formatEther(INITIAL_NFT_COST)} RDLN`);
            console.log(`  1st Attempt: ${ethers.formatEther(INITIAL_ATTEMPT_BASE)} RDLN`);
            console.log(`  5th Attempt: ${ethers.formatEther(INITIAL_ATTEMPT_BASE * 5n)} RDLN`);

            // Era 1 costs (after 2 years)
            await time.increaseTo(deployTime + ERA_DURATION);
            const [era1Nft, era1Attempt] = await nftContract.getEraCosts(1);
            console.log("Era 1 Economics:");
            console.log(`  NFT Cost: ${ethers.formatEther(era1Nft)} RDLN`);
            console.log(`  1st Attempt: ${ethers.formatEther(era1Attempt)} RDLN`);
            console.log(`  5th Attempt: ${ethers.formatEther(era1Attempt * 5n)} RDLN`);

            // Era 2 costs (after 4 years)
            await time.increaseTo(deployTime + ERA_DURATION * 2);
            const [era2Nft, era2Attempt] = await nftContract.getEraCosts(2);
            console.log("Era 2 Economics:");
            console.log(`  NFT Cost: ${ethers.formatEther(era2Nft)} RDLN`);
            console.log(`  1st Attempt: ${ethers.formatEther(era2Attempt)} RDLN`);
            console.log(`  5th Attempt: ${ethers.formatEther(era2Attempt * 5n)} RDLN`);

            // Verify the halving works
            expect(era1Nft).to.equal(INITIAL_NFT_COST / 2n);
            expect(era1Attempt).to.equal(INITIAL_ATTEMPT_BASE / 2n);
            expect(era2Nft).to.equal(INITIAL_NFT_COST / 4n);
            expect(era2Attempt).to.equal(INITIAL_ATTEMPT_BASE / 4n);
        });
    });

    describe("View Functions", function () {
        it("Should return correct NFT metadata", async function () {
            await nftContract.connect(player1).mintNFT();
            const tokenId = 1;

            const uri = await nftContract.tokenURI(tokenId);
            expect(uri).to.equal("https://api.riddlen.com/metadata/1");

            expect(await nftContract.totalSupply()).to.equal(1);
            expect(await nftContract.tokenByIndex(0)).to.equal(tokenId);
            expect(await nftContract.tokenOfOwnerByIndex(player1.address, 0)).to.equal(tokenId);
        });

        it("Should return correct contract state", async function () {
            expect(await nftContract.name()).to.equal("Riddlen Challenge NFT");
            expect(await nftContract.symbol()).to.equal("RCNFT");
            expect(await nftContract.rdlnToken()).to.equal(await rdlnToken.getAddress());
        });
    });

    describe("Error Conditions", function () {
        it("Should revert when querying non-existent NFT", async function () {
            await expect(nftContract.getNFTEra(999))
                .to.be.revertedWithCustomError(nftContract, "ERC721NonexistentToken");

            await expect(nftContract.getNFTCosts(999))
                .to.be.revertedWithCustomError(nftContract, "ERC721NonexistentToken");
        });

        it("Should revert mint when insufficient balance", async function () {
            // Use all tokens
            await rdlnToken.connect(player1).transfer(owner.address, ethers.parseEther("99999"));

            await expect(nftContract.connect(player1).mintNFT())
                .to.be.revertedWithCustomError(rdlnToken, "ERC20InsufficientBalance");
        });

        it("Should revert operations when paused", async function () {
            await nftContract.pause();

            await expect(nftContract.connect(player1).mintNFT())
                .to.be.revertedWithCustomError(nftContract, "EnforcedPause");
        });

        it("Should only allow operators to record game events", async function () {
            await nftContract.connect(player1).mintNFT();
            const tokenId = 1;

            await expect(nftContract.connect(player1).recordAttempt(tokenId, false))
                .to.be.reverted;

            await expect(nftContract.connect(player1).recordSubmission(tokenId, "test"))
                .to.be.reverted;
        });
    });
});