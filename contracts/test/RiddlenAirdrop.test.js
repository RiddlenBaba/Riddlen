const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("RiddlenAirdrop", function () {
    let rdlnToken, ronToken, oracleNetwork, airdrop;
    let owner, admin, operator, user1, user2, user3, user4, user5;
    let users = [];

    // Updated constants for v6.0
    const PHASE1_PER_WALLET = ethers.parseEther("5000"); // 5K RDLN
    const PHASE1_MAX_PARTICIPANTS = 6600;
    const PHASE1_ALLOCATION = ethers.parseEther("33000000"); // 33M RDLN
    const PHASE2_ALLOCATION = ethers.parseEther("33000000"); // 33M RDLN
    const PHASE3_ALLOCATION = ethers.parseEther("34000000"); // 34M RDLN
    const TOTAL_ALLOCATION = ethers.parseEther("100000000"); // 100M RDLN
    const MAX_TOTAL_PER_WALLET = ethers.parseEther("15000"); // 15K RDLN max across all phases

    // Phase 2 rewards (updated)
    const TIER1_REWARD = ethers.parseEther("2000");   // 2K RDLN
    const TIER2_REWARD = ethers.parseEther("3000");   // 3K RDLN
    const TIER3_REWARD = ethers.parseEther("4000");   // 4K RDLN
    const TIER4_REWARD = ethers.parseEther("5000");   // 5K RDLN

    // Phase 3 constants
    const PHASE3_REWARD_PER_VALIDATION = ethers.parseEther("500"); // 500 RDLN
    const PHASE3_MAX_PER_PHASE = ethers.parseEther("5000"); // 5K RDLN max
    const PHASE3_MIN_VALIDATIONS = 3;
    const PHASE3_BONUS_THRESHOLD = 10;

    beforeEach(async function () {
        [owner, admin, operator, user1, user2, user3, user4, user5, ...users] =
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

        // Deploy mock Oracle Network
        const MockOracleNetwork = await ethers.getContractFactory("MockOracleNetwork");
        oracleNetwork = await MockOracleNetwork.deploy();

        // Deploy airdrop contract with oracle network
        const RiddlenAirdrop = await ethers.getContractFactory("RiddlenAirdrop");
        airdrop = await upgrades.deployProxy(RiddlenAirdrop, [
            await rdlnToken.getAddress(),
            await ronToken.getAddress(),
            await oracleNetwork.getAddress(),
            admin.address
        ], { initializer: 'initialize' });

        // Fund the airdrop contract
        await rdlnToken.transfer(await airdrop.getAddress(), TOTAL_ALLOCATION);

        // Grant operator role
        const OPERATOR_ROLE = await airdrop.OPERATOR_ROLE();
        await airdrop.connect(admin).grantRole(OPERATOR_ROLE, operator.address);
    });

    describe("Deployment", function () {
        it("Should set the correct initial values", async function () {
            expect(await airdrop.rdlnToken()).to.equal(await rdlnToken.getAddress());
            expect(await airdrop.ronToken()).to.equal(await ronToken.getAddress());
            expect(await airdrop.oracleNetwork()).to.equal(await oracleNetwork.getAddress());
            expect(await airdrop.phase1Active()).to.be.false;
            expect(await airdrop.phase2Active()).to.be.false;
            expect(await airdrop.phase3Active()).to.be.false;
            expect(await airdrop.phase1Participants()).to.equal(0);
        });

        it("Should grant correct roles", async function () {
            const UPGRADER_ROLE = await airdrop.UPGRADER_ROLE();
            const PAUSER_ROLE = await airdrop.PAUSER_ROLE();
            const OPERATOR_ROLE = await airdrop.OPERATOR_ROLE();

            expect(await airdrop.hasRole(UPGRADER_ROLE, admin.address)).to.be.true;
            expect(await airdrop.hasRole(PAUSER_ROLE, admin.address)).to.be.true;
            expect(await airdrop.hasRole(OPERATOR_ROLE, operator.address)).to.be.true;
        });

        it("Should have correct allocation constants", async function () {
            expect(await airdrop.PHASE1_ALLOCATION()).to.equal(PHASE1_ALLOCATION);
            expect(await airdrop.PHASE2_ALLOCATION()).to.equal(PHASE2_ALLOCATION);
            expect(await airdrop.PHASE3_ALLOCATION()).to.equal(PHASE3_ALLOCATION);
            expect(await airdrop.PHASE1_PER_WALLET()).to.equal(PHASE1_PER_WALLET);
            expect(await airdrop.PHASE1_MAX_PARTICIPANTS()).to.equal(PHASE1_MAX_PARTICIPANTS);
            expect(await airdrop.MAX_TOTAL_PER_WALLET()).to.equal(MAX_TOTAL_PER_WALLET);
        });
    });

    describe("Phase 1 - Social Proof & Early Adoption", function () {
        beforeEach(async function () {
            // Activate Phase 1
            await airdrop.connect(admin).setPhaseActive(1, true);
        });

        describe("Phase 1 Claims", function () {
            beforeEach(async function () {
                // Setup verified users
                await airdrop.connect(user1).submitSocialProof("riddlenuser1", "riddlenuser1");
                await airdrop.connect(operator).verifySocialProof(user1.address, true, true, true);
            });

            it("Should allow verified users to claim Phase 1 airdrop", async function () {
                const initialBalance = await rdlnToken.balanceOf(user1.address);

                await expect(airdrop.connect(user1).claimPhase1())
                    .to.emit(airdrop, "Phase1Claimed")
                    .withArgs(user1.address, PHASE1_PER_WALLET, 1);

                const finalBalance = await rdlnToken.balanceOf(user1.address);
                expect(finalBalance - initialBalance).to.equal(PHASE1_PER_WALLET);
                expect(await airdrop.phase1Claimed(user1.address)).to.be.true;
                expect(await airdrop.phase1Participants()).to.equal(1);
            });

            it("Should enforce global 15K limit on Phase 1 claim", async function () {
                await airdrop.connect(user1).claimPhase1();
                const totalClaimed = await airdrop.getTotalClaimed(user1.address);
                expect(totalClaimed).to.equal(PHASE1_PER_WALLET);
                expect(totalClaimed).to.be.lte(MAX_TOTAL_PER_WALLET);
            });
        });
    });

    describe("Phase 2 - Merit-Based RON Airdrop", function () {
        beforeEach(async function () {
            // Activate Phase 2
            await airdrop.connect(admin).setPhaseActive(2, true);
        });

        describe("RON Tier Calculations", function () {
            it("Should calculate correct rewards for each tier", async function () {
                // Tier 1: 1,000-4,999 RON = 2,000 RDLN
                let [reward, tier] = await airdrop.calculatePhase2Reward(1000);
                expect(reward).to.equal(TIER1_REWARD);
                expect(tier).to.equal(1);

                // Tier 2: 5,000-9,999 RON = 3,000 RDLN
                [reward, tier] = await airdrop.calculatePhase2Reward(5000);
                expect(reward).to.equal(TIER2_REWARD);
                expect(tier).to.equal(2);

                // Tier 3: 10,000-24,999 RON = 4,000 RDLN
                [reward, tier] = await airdrop.calculatePhase2Reward(10000);
                expect(reward).to.equal(TIER3_REWARD);
                expect(tier).to.equal(3);

                // Tier 4: 25,000+ RON = 5,000 RDLN
                [reward, tier] = await airdrop.calculatePhase2Reward(25000);
                expect(reward).to.equal(TIER4_REWARD);
                expect(tier).to.equal(4);
            });
        });

        describe("Phase 2 Claims with Global Limit", function () {
            it("Should cap Phase 2 reward to respect 15K global limit", async function () {
                // User already claimed Phase 1 (5K)
                await airdrop.connect(admin).setPhaseActive(1, true);
                await airdrop.connect(user1).submitSocialProof("user1", "user1");
                await airdrop.connect(operator).verifySocialProof(user1.address, true, true, true);
                await airdrop.connect(user1).claimPhase1();

                // Now try Phase 2 (user qualifies for 5K tier 4)
                await ronToken.setBalance(user1.address, 25000);
                await airdrop.connect(operator).takeRONSnapshot([user1.address]);

                const totalBefore = await airdrop.getTotalClaimed(user1.address);
                expect(totalBefore).to.equal(PHASE1_PER_WALLET); // 5K

                await airdrop.connect(user1).claimPhase2();

                const totalAfter = await airdrop.getTotalClaimed(user1.address);
                expect(totalAfter).to.equal(ethers.parseEther("10000")); // 5K + 5K = 10K (capped)
                expect(totalAfter).to.be.lte(MAX_TOTAL_PER_WALLET);
            });
        });
    });

    describe("Phase 3 - Validation-Based Earning", function () {
        beforeEach(async function () {
            // Activate Phase 3
            await airdrop.connect(admin).setPhaseActive(3, true);
        });

        describe("Basic Phase 3 Claims", function () {
            it("Should allow users with validations to claim Phase 3", async function () {
                // Give user1 sufficient RON for Phase 3 (requires 1,000+)
                await ronToken.setBalance(user1.address, 1500);

                // Set user1 to have 5 validations in oracle
                await oracleNetwork.setValidatorProfile(
                    user1.address,
                    0, // tier
                    5, // totalValidations
                    5, // correctValidations
                    10000, // accuracy
                    0, // totalEarned
                    0, // totalSlashed
                    false // isSuspended
                );

                const initialBalance = await rdlnToken.balanceOf(user1.address);

                await expect(airdrop.connect(user1).claimPhase3())
                    .to.emit(airdrop, "Phase3Claimed");

                const finalBalance = await rdlnToken.balanceOf(user1.address);
                const expectedReward = PHASE3_REWARD_PER_VALIDATION * BigInt(5); // 500 * 5 = 2500 RDLN
                expect(finalBalance - initialBalance).to.equal(expectedReward);
            });

            it("Should reject claims with insufficient validations", async function () {
                // Give user1 sufficient RON
                await ronToken.setBalance(user1.address, 1500);

                // Set user1 to have only 2 validations (< min of 3)
                await oracleNetwork.setValidatorProfile(
                    user1.address,
                    0, 2, 2, 10000, 0, 0, false
                );

                await expect(
                    airdrop.connect(user1).claimPhase3()
                ).to.be.revertedWithCustomError(airdrop, "InsufficientRON");
            });

            it("Should reject suspended validators", async function () {
                // Give user1 sufficient RON
                await ronToken.setBalance(user1.address, 1500);

                await oracleNetwork.setValidatorProfile(
                    user1.address,
                    0, 10, 10, 10000, 0, 0, true // suspended
                );

                await expect(
                    airdrop.connect(user1).claimPhase3()
                ).to.be.revertedWithCustomError(airdrop, "SocialProofNotVerified");
            });

            it("Should allow multiple claims as validations increase", async function () {
                // Give user1 sufficient RON
                await ronToken.setBalance(user1.address, 1500);

                // First claim with 5 validations
                await oracleNetwork.setValidatorProfile(
                    user1.address, 0, 5, 5, 10000, 0, 0, false
                );
                await airdrop.connect(user1).claimPhase3();

                let claimed = await airdrop.phase3TotalClaimed(user1.address);
                expect(claimed).to.equal(ethers.parseEther("2500")); // 500 * 5

                // Increment validations to 10
                await oracleNetwork.incrementValidations(user1.address, 5);

                // Second claim (should get bonus now for 10+ validations)
                await airdrop.connect(user1).claimPhase3();

                claimed = await airdrop.phase3TotalClaimed(user1.address);
                // 5 new validations * 500 = 2500, + 25% bonus = 3125
                // Total = 2500 + 3125 = 5625, but capped at 5000 max
                expect(claimed).to.equal(PHASE3_MAX_PER_PHASE);
            });

            it("Should apply 25% bonus for 10+ total validations", async function () {
                // Give user1 sufficient RON
                await ronToken.setBalance(user1.address, 1500);

                await oracleNetwork.setValidatorProfile(
                    user1.address, 0, 12, 12, 10000, 0, 0, false
                );

                await airdrop.connect(user1).claimPhase3();

                const claimed = await airdrop.phase3TotalClaimed(user1.address);
                // 12 validations * 500 = 6000, + 25% = 7500, but capped at 5000
                expect(claimed).to.equal(PHASE3_MAX_PER_PHASE);
            });

            it("Should reject claims with no new validations", async function () {
                // Give user1 sufficient RON
                await ronToken.setBalance(user1.address, 1500);

                await oracleNetwork.setValidatorProfile(
                    user1.address, 0, 5, 5, 10000, 0, 0, false
                );
                await airdrop.connect(user1).claimPhase3();

                // Try to claim again without new validations
                await expect(
                    airdrop.connect(user1).claimPhase3()
                ).to.be.revertedWithCustomError(airdrop, "NoNewValidations");
            });
        });

        describe("Phase 3 Global Limit Enforcement", function () {
            it("Should enforce 15K global limit across all phases", async function () {
                // Claim Phase 1 (5K)
                await airdrop.connect(admin).setPhaseActive(1, true);
                await airdrop.connect(user1).submitSocialProof("user1", "user1");
                await airdrop.connect(operator).verifySocialProof(user1.address, true, true, true);
                await airdrop.connect(user1).claimPhase1();

                // Claim Phase 2 (5K for tier 4) - Set RON to 25,000 for Tier 4
                await airdrop.connect(admin).setPhaseActive(2, true);
                await ronToken.setBalance(user1.address, 25000);
                await airdrop.connect(operator).takeRONSnapshot([user1.address]);
                await airdrop.connect(user1).claimPhase2();

                let totalClaimed = await airdrop.getTotalClaimed(user1.address);
                expect(totalClaimed).to.equal(ethers.parseEther("10000")); // 5K + 5K

                // Give user1 MORE RON for Phase 3 requirement (1,000+)
                await ronToken.setBalance(user1.address, 1500);

                // Try Phase 3 (user has 15 validations = 7500 base + bonus)
                await oracleNetwork.setValidatorProfile(
                    user1.address, 0, 15, 15, 10000, 0, 0, false
                );
                await airdrop.connect(user1).claimPhase3();

                totalClaimed = await airdrop.getTotalClaimed(user1.address);
                expect(totalClaimed).to.equal(MAX_TOTAL_PER_WALLET); // Capped at 15K

                const remaining = await airdrop.getRemainingClaimable(user1.address);
                expect(remaining).to.equal(0);
            });

            it("Should correctly calculate remaining claimable", async function () {
                // User starts with 0
                let remaining = await airdrop.getRemainingClaimable(user1.address);
                expect(remaining).to.equal(MAX_TOTAL_PER_WALLET);

                // Claim Phase 1 (5K)
                await airdrop.connect(admin).setPhaseActive(1, true);
                await airdrop.connect(user1).submitSocialProof("user1", "user1");
                await airdrop.connect(operator).verifySocialProof(user1.address, true, true, true);
                await airdrop.connect(user1).claimPhase1();

                remaining = await airdrop.getRemainingClaimable(user1.address);
                expect(remaining).to.equal(ethers.parseEther("10000")); // 15K - 5K = 10K remaining
            });
        });

        describe("Phase 3 View Functions", function () {
            it("Should return correct Phase 3 status", async function () {
                await ronToken.setBalance(user1.address, 1500);
                await oracleNetwork.setValidatorProfile(
                    user1.address, 0, 8, 8, 10000, 0, 0, false
                );

                const [eligible, totalValidations, newValidations, estimatedReward, totalClaimed, remainingPhase3] =
                    await airdrop.getPhase3Status(user1.address);

                expect(eligible).to.be.true;
                expect(totalValidations).to.equal(8);
                expect(newValidations).to.equal(8);
                expect(estimatedReward).to.equal(ethers.parseEther("4000")); // 8 * 500
                expect(totalClaimed).to.equal(0);
                expect(remainingPhase3).to.equal(PHASE3_MAX_PER_PHASE);
            });
        });
    });

    describe("Admin Functions", function () {
        it("Should allow activating Phase 3", async function () {
            await expect(airdrop.connect(admin).setPhaseActive(3, true))
                .to.emit(airdrop, "PhaseActivated")
                .withArgs(3, true);

            expect(await airdrop.phase3Active()).to.be.true;
        });

        it("Should allow all three phases to run simultaneously", async function () {
            await airdrop.connect(admin).setPhaseActive(1, true);
            await airdrop.connect(admin).setPhaseActive(2, true);
            await airdrop.connect(admin).setPhaseActive(3, true);

            expect(await airdrop.phase1Active()).to.be.true;
            expect(await airdrop.phase2Active()).to.be.true;
            expect(await airdrop.phase3Active()).to.be.true;
        });
    });

    describe("View Functions", function () {
        it("Should return correct airdrop statistics including Phase 3", async function () {
            const [participants, remaining, phase3Distributed, balance] = await airdrop.getAirdropStats();
            expect(participants).to.equal(0);
            expect(remaining).to.equal(PHASE1_MAX_PARTICIPANTS);
            expect(phase3Distributed).to.equal(0);
            expect(balance).to.equal(TOTAL_ALLOCATION);
        });

        it("Should track total claimed across all phases", async function () {
            // Enable all phases
            await airdrop.connect(admin).setPhaseActive(1, true);
            await airdrop.connect(admin).setPhaseActive(2, true);
            await airdrop.connect(admin).setPhaseActive(3, true);

            // Claim Phase 1
            await airdrop.connect(user1).submitSocialProof("user1", "user1");
            await airdrop.connect(operator).verifySocialProof(user1.address, true, true, true);
            await airdrop.connect(user1).claimPhase1();

            // Claim Phase 2
            await ronToken.setBalance(user1.address, 5000);
            await airdrop.connect(operator).takeRONSnapshot([user1.address]);
            await airdrop.connect(user1).claimPhase2();

            // Claim Phase 3
            await oracleNetwork.setValidatorProfile(user1.address, 0, 5, 5, 10000, 0, 0, false);
            await airdrop.connect(user1).claimPhase3();

            const totalClaimed = await airdrop.getTotalClaimed(user1.address);
            // 5K (Phase1) + 3K (Phase2 Tier2) + 2.5K (Phase3) = 10.5K
            expect(totalClaimed).to.equal(ethers.parseEther("10500"));
        });
    });
});
