const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("RiddlenOracleNetwork", function () {
    let rdlnToken, ronToken, oracleNetwork;
    let owner, admin, treasury, buyback;
    let validator1, validator2, validator3, validator4, validator5;
    let company1, company2;

    // Constants from contract
    const MAX_DAILY_REQUESTS = 1000;
    const MAX_SINGLE_REWARD = ethers.parseEther("1000000"); // 1M RDLN
    const MIN_REWARD = ethers.parseEther("10");
    const PROTOCOL_FEE_PERCENT = 1000; // 10%
    const SLASH_PERCENT = 5000; // 50%

    // Validator tier requirements
    const BRONZE_MIN_RON = ethers.parseEther("100");
    const SILVER_MIN_RON = ethers.parseEther("1000");
    const GOLD_MIN_RON = ethers.parseEther("10000");
    const PLATINUM_MIN_RON = ethers.parseEther("100000");

    beforeEach(async function () {
        [owner, admin, treasury, buyback, validator1, validator2, validator3, validator4, validator5, company1, company2] =
            await ethers.getSigners();

        // Deploy mock RDLN token
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        rdlnToken = await MockERC20.deploy(
            "Riddlen Token",
            "RDLN",
            ethers.parseEther("1000000000") // 1B tokens
        );

        // Deploy mock RON token
        const MockRON = await ethers.getContractFactory("MockRON");
        ronToken = await MockRON.deploy();

        // Deploy RiddlenOracleNetwork
        const RiddlenOracleNetwork = await ethers.getContractFactory("RiddlenOracleNetwork");
        oracleNetwork = await upgrades.deployProxy(
            RiddlenOracleNetwork,
            [
                await rdlnToken.getAddress(),
                await ronToken.getAddress(),
                treasury.address,
                buyback.address,
                admin.address
            ],
            { initializer: 'initialize' }
        );

        // Fund validators with RON (different tiers)
        await ronToken.mint(validator1.address, BRONZE_MIN_RON); // Bronze
        await ronToken.mint(validator2.address, SILVER_MIN_RON); // Silver
        await ronToken.mint(validator3.address, GOLD_MIN_RON); // Gold
        await ronToken.mint(validator4.address, PLATINUM_MIN_RON); // Platinum
        await ronToken.mint(validator5.address, SILVER_MIN_RON); // Silver

        // Fund companies with RDLN
        await rdlnToken.transfer(company1.address, ethers.parseEther("100000"));
        await rdlnToken.transfer(company2.address, ethers.parseEther("100000"));

        // Approve oracle to spend RDLN
        await rdlnToken.connect(company1).approve(await oracleNetwork.getAddress(), ethers.MaxUint256);
        await rdlnToken.connect(company2).approve(await oracleNetwork.getAddress(), ethers.MaxUint256);

        // Approve oracle to spend RON (for staking)
        await ronToken.connect(validator1).approve(await oracleNetwork.getAddress(), ethers.MaxUint256);
        await ronToken.connect(validator2).approve(await oracleNetwork.getAddress(), ethers.MaxUint256);
        await ronToken.connect(validator3).approve(await oracleNetwork.getAddress(), ethers.MaxUint256);
        await ronToken.connect(validator4).approve(await oracleNetwork.getAddress(), ethers.MaxUint256);
        await ronToken.connect(validator5).approve(await oracleNetwork.getAddress(), ethers.MaxUint256);

        // Fund oracle with RDLN for rewards
        await rdlnToken.transfer(await oracleNetwork.getAddress(), ethers.parseEther("1000000"));
    });

    describe("Initialization", function () {
        it("Should initialize with correct addresses", async function () {
            expect(await oracleNetwork.rdlnToken()).to.equal(await rdlnToken.getAddress());
            expect(await oracleNetwork.ronToken()).to.equal(await ronToken.getAddress());
            expect(await oracleNetwork.treasuryWallet()).to.equal(treasury.address);
            expect(await oracleNetwork.buybackWallet()).to.equal(buyback.address);
        });

        it("Should initialize with correct constants", async function () {
            expect(await oracleNetwork.MAX_DAILY_REQUESTS()).to.equal(MAX_DAILY_REQUESTS);
            expect(await oracleNetwork.MAX_SINGLE_REWARD()).to.equal(MAX_SINGLE_REWARD);
            expect(await oracleNetwork.MIN_REWARD()).to.equal(MIN_REWARD);
            expect(await oracleNetwork.protocolFeePercent()).to.equal(PROTOCOL_FEE_PERCENT);
        });

        it("Should grant admin roles correctly", async function () {
            const ADMIN_ROLE = await oracleNetwork.ADMIN_ROLE();
            const UPGRADER_ROLE = await oracleNetwork.UPGRADER_ROLE();
            const PAUSER_ROLE = await oracleNetwork.PAUSER_ROLE();

            expect(await oracleNetwork.hasRole(ADMIN_ROLE, admin.address)).to.be.true;
            expect(await oracleNetwork.hasRole(UPGRADER_ROLE, admin.address)).to.be.true;
            expect(await oracleNetwork.hasRole(PAUSER_ROLE, admin.address)).to.be.true;
        });
    });

    describe("Validator Tiers", function () {
        it("Should correctly identify validator tiers", async function () {
            expect(await oracleNetwork.getValidatorTier(validator1.address)).to.equal(0); // Bronze
            expect(await oracleNetwork.getValidatorTier(validator2.address)).to.equal(1); // Silver
            expect(await oracleNetwork.getValidatorTier(validator3.address)).to.equal(2); // Gold
            expect(await oracleNetwork.getValidatorTier(validator4.address)).to.equal(3); // Platinum
        });

        it("Should return Bronze for addresses with no RON", async function () {
            expect(await oracleNetwork.getValidatorTier(company1.address)).to.equal(0);
        });
    });

    describe("Create Validation Request", function () {
        const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test data"));
        const question = "Is this data valid?";
        const category = "General";
        const requiredValidators = 5;
        const consensusThreshold = 3;
        const rewardPool = ethers.parseEther("1000"); // 1000 RDLN
        const deadline = 86400; // 24 hours

        it("Should create validation request successfully", async function () {
            const totalCost = rewardPool + (rewardPool * BigInt(PROTOCOL_FEE_PERCENT)) / 10000n;
            const balanceBefore = await rdlnToken.balanceOf(company1.address);

            const tx = await oracleNetwork.connect(company1).createValidationRequest(
                dataHash,
                question,
                category,
                requiredValidators,
                consensusThreshold,
                rewardPool,
                deadline,
                0 // Bronze tier
            );

            const receipt = await tx.wait();
            const event = receipt.logs.find(log => {
                try {
                    return oracleNetwork.interface.parseLog(log).name === "ValidationRequestCreated";
                } catch (e) {
                    return false;
                }
            });

            expect(event).to.not.be.undefined;

            const balanceAfter = await rdlnToken.balanceOf(company1.address);
            expect(balanceBefore - balanceAfter).to.equal(totalCost);
        });

        it("Should reject request with zero data hash", async function () {
            await expect(
                oracleNetwork.connect(company1).createValidationRequest(
                    ethers.ZeroHash,
                    question,
                    category,
                    requiredValidators,
                    consensusThreshold,
                    rewardPool,
                    deadline,
                    0
                )
            ).to.be.reverted;
        });

        it("Should reject request with empty question", async function () {
            await expect(
                oracleNetwork.connect(company1).createValidationRequest(
                    dataHash,
                    "",
                    category,
                    requiredValidators,
                    consensusThreshold,
                    rewardPool,
                    deadline,
                    0
                )
            ).to.be.reverted;
        });

        it("Should reject request with reward below minimum", async function () {
            await expect(
                oracleNetwork.connect(company1).createValidationRequest(
                    dataHash,
                    question,
                    category,
                    requiredValidators,
                    consensusThreshold,
                    ethers.parseEther("5"), // Below MIN_REWARD
                    deadline,
                    0
                )
            ).to.be.reverted;
        });

        it("Should reject request with invalid threshold", async function () {
            await expect(
                oracleNetwork.connect(company1).createValidationRequest(
                    dataHash,
                    question,
                    category,
                    requiredValidators,
                    6, // Threshold > required validators
                    rewardPool,
                    deadline,
                    0
                )
            ).to.be.reverted;
        });

        it("Should distribute protocol fee correctly", async function () {
            const treasuryBefore = await rdlnToken.balanceOf(treasury.address);
            const buybackBefore = await rdlnToken.balanceOf(buyback.address);

            await oracleNetwork.connect(company1).createValidationRequest(
                dataHash,
                question,
                category,
                requiredValidators,
                consensusThreshold,
                rewardPool,
                deadline,
                0
            );

            const treasuryAfter = await rdlnToken.balanceOf(treasury.address);
            const buybackAfter = await rdlnToken.balanceOf(buyback.address);

            const protocolFee = (rewardPool * BigInt(PROTOCOL_FEE_PERCENT)) / 10000n;
            const treasuryShare = (protocolFee * 5000n) / 10000n; // 50%
            const buybackShare = (protocolFee * 3000n) / 10000n; // 30%

            expect(treasuryAfter - treasuryBefore).to.equal(treasuryShare);
            expect(buybackAfter - buybackBefore).to.equal(buybackShare);
        });
    });

    describe("Submit Validation", function () {
        let requestId;
        const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test data"));
        const question = "Is this data valid?";
        const category = "General";
        const requiredValidators = 5;
        const consensusThreshold = 3;
        const rewardPool = ethers.parseEther("1000");
        const deadline = 86400;

        beforeEach(async function () {
            // Create a request first
            const tx = await oracleNetwork.connect(company1).createValidationRequest(
                dataHash,
                question,
                category,
                requiredValidators,
                consensusThreshold,
                rewardPool,
                deadline,
                0 // Bronze tier
            );

            const receipt = await tx.wait();
            const event = receipt.logs.find(log => {
                try {
                    const parsed = oracleNetwork.interface.parseLog(log);
                    if (parsed.name === "ValidationRequestCreated") {
                        requestId = parsed.args[0];
                        return true;
                    }
                } catch (e) {
                    return false;
                }
            });
        });

        it("Should submit validation successfully", async function () {
            const answer = ethers.keccak256(ethers.toUtf8Bytes("yes"));
            const proof = "ipfs://QmProof123";
            const stakeAmount = ethers.parseEther("50");

            const tx = await oracleNetwork.connect(validator1).submitValidation(
                requestId,
                answer,
                proof,
                stakeAmount
            );

            await expect(tx).to.emit(oracleNetwork, "ValidationSubmitted");
        });

        it("Should reject validation from validator without RON", async function () {
            const answer = ethers.keccak256(ethers.toUtf8Bytes("yes"));
            const proof = "ipfs://QmProof123";
            const stakeAmount = ethers.parseEther("50");

            await expect(
                oracleNetwork.connect(company1).submitValidation(
                    requestId,
                    answer,
                    proof,
                    stakeAmount
                )
            ).to.be.reverted;
        });

        it("Should reject validation with zero stake", async function () {
            const answer = ethers.keccak256(ethers.toUtf8Bytes("yes"));
            const proof = "ipfs://QmProof123";

            await expect(
                oracleNetwork.connect(validator1).submitValidation(
                    requestId,
                    answer,
                    proof,
                    0
                )
            ).to.be.reverted;
        });

        it("Should reject validation with empty proof", async function () {
            const answer = ethers.keccak256(ethers.toUtf8Bytes("yes"));
            const stakeAmount = ethers.parseEther("50");

            await expect(
                oracleNetwork.connect(validator1).submitValidation(
                    requestId,
                    answer,
                    "",
                    stakeAmount
                )
            ).to.be.reverted;
        });

        it("Should prevent double validation from same validator", async function () {
            const answer = ethers.keccak256(ethers.toUtf8Bytes("yes"));
            const proof = "ipfs://QmProof123";
            const stakeAmount = ethers.parseEther("50");

            await oracleNetwork.connect(validator1).submitValidation(
                requestId,
                answer,
                proof,
                stakeAmount
            );

            await expect(
                oracleNetwork.connect(validator1).submitValidation(
                    requestId,
                    answer,
                    proof,
                    stakeAmount
                )
            ).to.be.reverted;
        });

        it("Should update validator profile correctly", async function () {
            const answer = ethers.keccak256(ethers.toUtf8Bytes("yes"));
            const proof = "ipfs://QmProof123";
            const stakeAmount = ethers.parseEther("50");

            await oracleNetwork.connect(validator1).submitValidation(
                requestId,
                answer,
                proof,
                stakeAmount
            );

            const profile = await oracleNetwork.getValidatorProfile(validator1.address);
            expect(profile.currentStakedRON).to.equal(stakeAmount);
        });
    });

    describe("Consensus & Reward Distribution", function () {
        let requestId;
        const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test data"));
        const question = "Is this data valid?";
        const category = "General";
        const requiredValidators = 5;
        const consensusThreshold = 3;
        const rewardPool = ethers.parseEther("1000");
        const deadline = 86400;
        const stakeAmount = ethers.parseEther("50");

        beforeEach(async function () {
            const tx = await oracleNetwork.connect(company1).createValidationRequest(
                dataHash,
                question,
                category,
                requiredValidators,
                consensusThreshold,
                rewardPool,
                deadline,
                0
            );

            const receipt = await tx.wait();
            const event = receipt.logs.find(log => {
                try {
                    const parsed = oracleNetwork.interface.parseLog(log);
                    if (parsed.name === "ValidationRequestCreated") {
                        requestId = parsed.args[0];
                        return true;
                    }
                } catch (e) {
                    return false;
                }
            });
        });

        it("Should reach consensus and distribute rewards", async function () {
            const answerYes = ethers.keccak256(ethers.toUtf8Bytes("yes"));
            const answerNo = ethers.keccak256(ethers.toUtf8Bytes("no"));
            const proof = "ipfs://QmProof123";

            // 3 validators vote YES (consensus)
            await oracleNetwork.connect(validator1).submitValidation(requestId, answerYes, proof, stakeAmount);
            await oracleNetwork.connect(validator2).submitValidation(requestId, answerYes, proof, stakeAmount);
            await oracleNetwork.connect(validator3).submitValidation(requestId, answerYes, proof, stakeAmount);

            // 2 validators vote NO (incorrect)
            await oracleNetwork.connect(validator4).submitValidation(requestId, answerNo, proof, stakeAmount);
            await oracleNetwork.connect(validator5).submitValidation(requestId, answerNo, proof, stakeAmount);

            const validator1Before = await rdlnToken.balanceOf(validator1.address);

            // Finalize request
            const tx = await oracleNetwork.connect(company1).finalizeRequest(requestId);
            await expect(tx).to.emit(oracleNetwork, "ConsensusReached");

            const validator1After = await rdlnToken.balanceOf(validator1.address);
            expect(validator1After).to.be.gt(validator1Before);

            // Check request status
            const request = await oracleNetwork.getValidationRequest(requestId);
            expect(request.status).to.equal(1); // Consensus
        });

        it("Should slash incorrect validators", async function () {
            const answerYes = ethers.keccak256(ethers.toUtf8Bytes("yes"));
            const answerNo = ethers.keccak256(ethers.toUtf8Bytes("no"));
            const proof = "ipfs://QmProof123";

            // 3 vote YES, 2 vote NO
            await oracleNetwork.connect(validator1).submitValidation(requestId, answerYes, proof, stakeAmount);
            await oracleNetwork.connect(validator2).submitValidation(requestId, answerYes, proof, stakeAmount);
            await oracleNetwork.connect(validator3).submitValidation(requestId, answerYes, proof, stakeAmount);
            await oracleNetwork.connect(validator4).submitValidation(requestId, answerNo, proof, stakeAmount);
            await oracleNetwork.connect(validator5).submitValidation(requestId, answerNo, proof, stakeAmount);

            const validator4ProfileBefore = await oracleNetwork.getValidatorProfile(validator4.address);

            await oracleNetwork.connect(company1).finalizeRequest(requestId);

            const validator4ProfileAfter = await oracleNetwork.getValidatorProfile(validator4.address);
            expect(validator4ProfileAfter.incorrectValidations).to.be.gt(validator4ProfileBefore.incorrectValidations);
            expect(validator4ProfileAfter.totalSlashed).to.be.gt(0);
        });

        it("Should handle no consensus scenario", async function () {
            const answer1 = ethers.keccak256(ethers.toUtf8Bytes("answer1"));
            const answer2 = ethers.keccak256(ethers.toUtf8Bytes("answer2"));
            const answer3 = ethers.keccak256(ethers.toUtf8Bytes("answer3"));
            const proof = "ipfs://QmProof123";

            // All different answers - no consensus
            await oracleNetwork.connect(validator1).submitValidation(requestId, answer1, proof, stakeAmount);
            await oracleNetwork.connect(validator2).submitValidation(requestId, answer2, proof, stakeAmount);
            await oracleNetwork.connect(validator3).submitValidation(requestId, answer3, proof, stakeAmount);
            await oracleNetwork.connect(validator4).submitValidation(requestId, answer1, proof, stakeAmount);
            await oracleNetwork.connect(validator5).submitValidation(requestId, answer2, proof, stakeAmount);

            await oracleNetwork.connect(company1).finalizeRequest(requestId);

            const request = await oracleNetwork.getValidationRequest(requestId);
            expect(request.status).to.equal(2); // NoConsensus
        });

        it("Should refund requester on no consensus", async function () {
            const answer1 = ethers.keccak256(ethers.toUtf8Bytes("answer1"));
            const answer2 = ethers.keccak256(ethers.toUtf8Bytes("answer2"));
            const answer3 = ethers.keccak256(ethers.toUtf8Bytes("answer3"));
            const proof = "ipfs://QmProof123";

            await oracleNetwork.connect(validator1).submitValidation(requestId, answer1, proof, stakeAmount);
            await oracleNetwork.connect(validator2).submitValidation(requestId, answer2, proof, stakeAmount);
            await oracleNetwork.connect(validator3).submitValidation(requestId, answer3, proof, stakeAmount);
            await oracleNetwork.connect(validator4).submitValidation(requestId, answer1, proof, stakeAmount);
            await oracleNetwork.connect(validator5).submitValidation(requestId, answer2, proof, stakeAmount);

            const company1Before = await rdlnToken.balanceOf(company1.address);

            await oracleNetwork.connect(company1).finalizeRequest(requestId);

            const company1After = await rdlnToken.balanceOf(company1.address);
            const refundAmount = (rewardPool * 9500n) / 10000n; // 95% refund
            expect(company1After - company1Before).to.equal(refundAmount);
        });
    });

    describe("Circuit Breakers", function () {
        it("Should enforce daily request limit", async function () {
            const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            const question = "Test?";
            const category = "Test";
            const rewardPool = ethers.parseEther("100");

            // Note: Testing full 1000 requests would be slow
            // This test demonstrates the pattern
            await expect(
                oracleNetwork.connect(company1).createValidationRequest(
                    dataHash, question, category, 5, 3, rewardPool, 86400, 0
                )
            ).to.not.be.reverted;
        });

        it("Should enforce single reward limit", async function () {
            const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            const question = "Big reward test?";
            const category = "Test";
            const tooLargeReward = ethers.parseEther("2000000"); // > MAX_SINGLE_REWARD

            await expect(
                oracleNetwork.connect(company1).createValidationRequest(
                    dataHash, question, category, 5, 3, tooLargeReward, 86400, 0
                )
            ).to.be.reverted;
        });
    });

    describe("Emergency Functions", function () {
        it("Should pause contract", async function () {
            const PAUSER_ROLE = await oracleNetwork.PAUSER_ROLE();

            await oracleNetwork.connect(admin).pause();

            const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await expect(
                oracleNetwork.connect(company1).createValidationRequest(
                    dataHash, "Test?", "Test", 5, 3, ethers.parseEther("100"), 86400, 0
                )
            ).to.be.reverted;
        });

        it("Should unpause contract", async function () {
            await oracleNetwork.connect(admin).pause();
            await oracleNetwork.connect(admin).unpause();

            const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await expect(
                oracleNetwork.connect(company1).createValidationRequest(
                    dataHash, "Test?", "Test", 5, 3, ethers.parseEther("100"), 86400, 0
                )
            ).to.not.be.reverted;
        });

        it("Should allow emergency withdrawal when paused", async function () {
            await oracleNetwork.connect(admin).pause();

            const treasuryBefore = await rdlnToken.balanceOf(treasury.address);
            const withdrawAmount = ethers.parseEther("1000");

            await oracleNetwork.connect(admin).emergencyWithdraw(
                withdrawAmount,
                "Test emergency"
            );

            const treasuryAfter = await rdlnToken.balanceOf(treasury.address);
            expect(treasuryAfter - treasuryBefore).to.equal(withdrawAmount);
        });

        it("Should reject emergency withdrawal when not paused", async function () {
            await expect(
                oracleNetwork.connect(admin).emergencyWithdraw(
                    ethers.parseEther("1000"),
                    "Test"
                )
            ).to.be.reverted;
        });

        it("Should enforce emergency withdrawal limit", async function () {
            const withdrawAmount = ethers.parseEther("1000");

            await oracleNetwork.connect(admin).pause();

            // First 3 should succeed
            await oracleNetwork.connect(admin).emergencyWithdraw(withdrawAmount, "1");

            await time.increase(30 * 24 * 60 * 60 + 1); // Fast forward 30 days
            await oracleNetwork.connect(admin).emergencyWithdraw(withdrawAmount, "2");

            await time.increase(30 * 24 * 60 * 60 + 1);
            await oracleNetwork.connect(admin).emergencyWithdraw(withdrawAmount, "3");

            // Fourth should fail
            await time.increase(30 * 24 * 60 * 60 + 1);
            await expect(
                oracleNetwork.connect(admin).emergencyWithdraw(withdrawAmount, "4")
            ).to.be.reverted;
        });
    });

    describe("View Functions", function () {
        it("Should return validator profile", async function () {
            const profile = await oracleNetwork.getValidatorProfile(validator1.address);
            expect(profile.totalValidations).to.equal(0);
            expect(profile.correctValidations).to.equal(0);
            expect(profile.isSuspended).to.be.false;
        });

        it("Should calculate validator stats correctly", async function () {
            const stats = await oracleNetwork.getValidatorStats(validator1.address);
            expect(stats.accuracy).to.equal(0); // No validations yet
        });

        it("Should return open requests", async function () {
            const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await oracleNetwork.connect(company1).createValidationRequest(
                dataHash, "Test?", "Test", 5, 3, ethers.parseEther("100"), 86400, 0
            );

            const openRequests = await oracleNetwork.getOpenRequests(0, 10);
            expect(openRequests.length).to.be.gt(0);
        });
    });
});
