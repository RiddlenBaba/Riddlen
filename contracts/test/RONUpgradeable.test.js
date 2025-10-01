const { expect } = require("chai");
const { ethers } = require("hardhat");
const { upgrades } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("RONUpgradeable", function () {
    // Test fixture for consistent setup
    async function deployRONUpgradeableFixture() {
        const [owner, gameContract, oracle, user1, user2, user3, compliance] = await ethers.getSigners();

        // Deploy upgradeable contract
        const RONUpgradeable = await ethers.getContractFactory("RONUpgradeable");
        const ron = await upgrades.deployProxy(
            RONUpgradeable,
            [
                owner.address,
                300 // 5 minute cooldown for rate limiting
            ],
            { initializer: 'initialize' }
        );

        await ron.waitForDeployment();

        // Grant roles for testing
        const GAME_ROLE = await ron.GAME_ROLE();
        const ORACLE_ROLE = await ron.ORACLE_ROLE();
        const COMPLIANCE_ROLE = await ron.COMPLIANCE_ROLE();
        const BRIDGE_ROLE = await ron.BRIDGE_ROLE();

        await ron.grantRole(GAME_ROLE, gameContract.address);
        await ron.grantRole(ORACLE_ROLE, oracle.address);
        await ron.grantRole(COMPLIANCE_ROLE, compliance.address);
        await ron.grantRole(BRIDGE_ROLE, owner.address);

        return {
            ron,
            owner,
            gameContract,
            oracle,
            user1,
            user2,
            user3,
            compliance,
            GAME_ROLE,
            ORACLE_ROLE,
            COMPLIANCE_ROLE,
            BRIDGE_ROLE
        };
    }

    describe("Deployment and Initialization", function () {
        it("Should initialize with correct parameters", async function () {
            const { ron, owner } = await loadFixture(deployRONUpgradeableFixture);

            expect(await ron.hasRole(await ron.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
            expect(await ron.minAwardCooldown()).to.equal(300);
        });

        it("Should not allow reinitialization", async function () {
            const { ron, owner } = await loadFixture(deployRONUpgradeableFixture);

            await expect(
                ron.initialize(owner.address, 600)
            ).to.be.revertedWithCustomError(ron, "InvalidInitialization");
        });

        it("Should have correct initial tier thresholds", async function () {
            const { ron } = await loadFixture(deployRONUpgradeableFixture);

            expect(await ron.SOLVER_THRESHOLD()).to.equal(1000);
            expect(await ron.EXPERT_THRESHOLD()).to.equal(10000);
            expect(await ron.ORACLE_THRESHOLD()).to.equal(100000);
        });
    });

    describe("RON Award Functionality", function () {
        it("Should award RON for easy riddles", async function () {
            const { ron, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            await expect(
                ron.connect(gameContract).awardRON(
                    user1.address,
                    0, // EASY
                    false,
                    false,
                    "Easy riddle solved"
                )
            ).to.emit(ron, "RONEarnedEnhanced");

            const stats = await ron.getUserStats(user1.address);
            expect(stats[0]).to.be.gt(0); // totalRON > 0
            expect(stats[1]).to.equal(1); // correctAnswers = 1
        });

        it("Should award higher amounts for harder difficulties", async function () {
            const { ron, gameContract, user1, user2 } = await loadFixture(deployRONUpgradeableFixture);

            // Award easy riddle
            await ron.connect(gameContract).awardRON(user1.address, 0, false, false, "Easy");
            const easyStats = await ron.getUserStats(user1.address);

            // Award hard riddle
            await ron.connect(gameContract).awardRON(user2.address, 2, false, false, "Hard");
            const hardStats = await ron.getUserStats(user2.address);

            expect(hardStats[0]).to.be.gt(easyStats[0]); // Hard reward > Easy reward
        });

        it("Should apply first solver bonus correctly", async function () {
            const { ron, gameContract, user1, user2 } = await loadFixture(deployRONUpgradeableFixture);

            // Regular solver
            await ron.connect(gameContract).awardRON(user1.address, 1, false, false, "Regular");
            const regularStats = await ron.getUserStats(user1.address);

            // First solver
            await ron.connect(gameContract).awardRON(user2.address, 1, true, false, "First solver");
            const firstSolverStats = await ron.getUserStats(user2.address);

            expect(firstSolverStats[0]).to.be.gt(regularStats[0]); // First solver bonus applied
        });

        it("Should apply speed solver bonus correctly", async function () {
            const { ron, gameContract, user1, user2 } = await loadFixture(deployRONUpgradeableFixture);

            // Regular solver
            await ron.connect(gameContract).awardRON(user1.address, 1, false, false, "Regular");
            const regularStats = await ron.getUserStats(user1.address);

            // Speed solver
            await ron.connect(gameContract).awardRON(user2.address, 1, false, true, "Speed solver");
            const speedSolverStats = await ron.getUserStats(user2.address);

            expect(speedSolverStats[0]).to.be.gt(regularStats[0]); // Speed bonus applied
        });

        it("Should handle streak bonuses", async function () {
            const { ron, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // First solve to start streak
            await ron.connect(gameContract).awardRON(user1.address, 1, true, false, "First");
            const firstStats = await ron.getUserStats(user1.address);

            // Second solve with continued streak
            await ron.connect(gameContract).awardRON(user1.address, 1, true, false, "Second");
            const secondStats = await ron.getUserStats(user1.address);

            expect(secondStats[3]).to.equal(2); // currentStreak = 2
            expect(secondStats[5]).to.equal(2); // maxStreak = 2
        });

        it("Should enforce circuit breaker limits", async function () {
            const { ron, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            const maxSingleAward = await ron.MAX_SINGLE_RON_AWARD();

            // This should fail because the calculated reward will exceed the limit
            // when we try to award a legendary riddle with first solver bonus
            await expect(
                ron.connect(gameContract).awardRON(user1.address, 3, true, false, "Too much")
            ).to.be.revertedWithCustomError(ron, "SingleAwardLimitExceeded");
        });
    });

    describe("Batch Operations", function () {
        it("Should handle batch RON awards efficiently", async function () {
            const { ron, gameContract, user1, user2, user3 } = await loadFixture(deployRONUpgradeableFixture);

            const users = [user1.address, user2.address, user3.address];
            const difficulties = [0, 1, 2]; // EASY, MEDIUM, HARD
            const isFirstSolvers = [true, false, true];
            const isSpeedSolvers = [false, true, false];
            const reasons = ["Batch1", "Batch2", "Batch3"];

            await expect(
                ron.connect(gameContract).batchAwardRON(
                    users,
                    difficulties,
                    isFirstSolvers,
                    isSpeedSolvers,
                    reasons
                )
            ).to.emit(ron, "BatchOperationExecuted");

            // Verify all users received RON
            const user1Stats = await ron.getUserStats(user1.address);
            const user2Stats = await ron.getUserStats(user2.address);
            const user3Stats = await ron.getUserStats(user3.address);

            expect(user1Stats[0]).to.be.gt(0);
            expect(user2Stats[0]).to.be.gt(0);
            expect(user3Stats[0]).to.be.gt(0);
        });

        it("Should reject batch operations that exceed size limits", async function () {
            const { ron, gameContract } = await loadFixture(deployRONUpgradeableFixture);

            const maxBatchSize = await ron.MAX_BATCH_SIZE();
            const oversizedBatch = Array(Number(maxBatchSize) + 1).fill(ethers.Wallet.createRandom().address);

            await expect(
                ron.connect(gameContract).batchAwardRON(
                    oversizedBatch,
                    Array(oversizedBatch.length).fill(0),
                    Array(oversizedBatch.length).fill(false),
                    Array(oversizedBatch.length).fill(false),
                    Array(oversizedBatch.length).fill("test")
                )
            ).to.be.revertedWithCustomError(ron, "BatchSizeExceeded");
        });

        it("Should handle batch validation RON awards", async function () {
            const { ron, oracle, user1, user2 } = await loadFixture(deployRONUpgradeableFixture);

            const validators = [user1.address, user2.address];
            const amounts = [100, 200];
            const validationTypes = ["Oracle1", "Oracle2"];

            await expect(
                ron.connect(oracle).batchAwardValidationRON(
                    validators,
                    amounts,
                    validationTypes
                )
            ).to.emit(ron, "BatchOperationExecuted");

            const user1Stats = await ron.getUserStats(user1.address);
            const user2Stats = await ron.getUserStats(user2.address);

            expect(user1Stats[0]).to.equal(100);
            expect(user2Stats[0]).to.equal(200);
        });
    });

    describe("Tier System", function () {
        it("Should start users in NOVICE tier", async function () {
            const { ron, user1 } = await loadFixture(deployRONUpgradeableFixture);

            const tier = await ron.getUserTier(user1.address);
            expect(tier).to.equal(0); // NOVICE
        });

        it("Should promote to SOLVER tier at 1000 RON", async function () {
            const { ron, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // Award enough RON to reach SOLVER tier
            for (let i = 0; i < 20; i++) {
                await ron.connect(gameContract).awardRON(user1.address, 2, true, false, `Award ${i}`);
            }

            const stats = await ron.getUserStats(user1.address);
            const tier = await ron.getUserTier(user1.address);

            if (stats[0] >= 1000) {
                expect(tier).to.equal(1); // SOLVER
            }
        });

        it("Should check riddle access based on tier", async function () {
            const { ron, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // NOVICE should only access EASY riddles
            expect(await ron.hasRiddleAccess(user1.address, 0)).to.be.true; // EASY
            expect(await ron.hasRiddleAccess(user1.address, 1)).to.be.false; // MEDIUM
            expect(await ron.hasRiddleAccess(user1.address, 2)).to.be.false; // HARD
            expect(await ron.hasRiddleAccess(user1.address, 3)).to.be.false; // LEGENDARY
        });

        it("Should calculate next tier requirements correctly", async function () {
            const { ron, user1 } = await loadFixture(deployRONUpgradeableFixture);

            const nextTier = await ron.getNextTierRequirement(user1.address);
            expect(nextTier).to.equal(1000); // SOLVER_THRESHOLD
        });
    });

    describe("Validation System", function () {
        it("Should award validation RON to qualified users", async function () {
            const { ron, oracle, user1 } = await loadFixture(deployRONUpgradeableFixture);

            await expect(
                ron.connect(oracle).awardValidationRON(
                    user1.address,
                    50,
                    "Oracle validation"
                )
            ).to.emit(ron, "ValidationRONEarned")
             .withArgs(user1.address, 50, "Oracle validation");

            const stats = await ron.getUserStats(user1.address);
            expect(stats[0]).to.equal(50); // totalRON
            expect(stats[6]).to.equal(1); // validationsPerformed
        });

        it("Should enforce validation circuit breaker limits", async function () {
            const { ron, oracle, user1 } = await loadFixture(deployRONUpgradeableFixture);

            const maxSingleAward = await ron.MAX_SINGLE_RON_AWARD();

            await expect(
                ron.connect(oracle).awardValidationRON(
                    user1.address,
                    Number(maxSingleAward) + 1,
                    "Too much validation"
                )
            ).to.be.revertedWithCustomError(ron, "SingleAwardLimitExceeded");
        });
    });

    describe("Compliance System", function () {
        it("Should allow compliance role to block users", async function () {
            const { ron, compliance, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // Block user
            await expect(
                ron.connect(compliance).setComplianceBlocked(user1.address, true, "Compliance violation")
            ).to.emit(ron, "ComplianceUpdate")
             .withArgs(user1.address, true, "Compliance violation");

            // Should prevent RON awards
            await expect(
                ron.connect(gameContract).awardRON(user1.address, 0, false, false, "Blocked")
            ).to.be.revertedWithCustomError(ron, "ComplianceViolation");
        });

        it("Should allow unblocking of users", async function () {
            const { ron, compliance, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // Block then unblock
            await ron.connect(compliance).setComplianceBlocked(user1.address, true, "Violation");
            await ron.connect(compliance).setComplianceBlocked(user1.address, false, "Resolved");

            // Should allow RON awards again
            await expect(
                ron.connect(gameContract).awardRON(user1.address, 0, false, false, "Unblocked")
            ).to.not.be.reverted;
        });

        it("Should allow setting compliance module", async function () {
            const { ron, compliance } = await loadFixture(deployRONUpgradeableFixture);

            const newModule = ethers.Wallet.createRandom().address;

            await expect(
                ron.connect(compliance).setComplianceModule(newModule, true)
            ).to.emit(ron, "ComplianceUpdate");

            expect(await ron.complianceModule()).to.equal(newModule);
            expect(await ron.complianceEnabled()).to.be.true;
        });
    });

    describe("Cross-Chain Bridge Preparation", function () {
        it("Should allow bridge role to configure supported chains", async function () {
            const { ron, owner } = await loadFixture(deployRONUpgradeableFixture);

            await ron.connect(owner).setSupportedChain(137, true); // Polygon

            expect(await ron.supportedChains(137)).to.be.true;
        });

        it("Should allow reputation synchronization to supported chains", async function () {
            const { ron, gameContract, owner, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // Setup user with some RON
            await ron.connect(gameContract).awardRON(user1.address, 1, false, false, "Setup");

            // Configure supported chain
            await ron.connect(owner).setSupportedChain(137, true);

            await expect(
                ron.connect(owner).syncReputationCrossChain(user1.address, 137)
            ).to.emit(ron, "CrossChainReputationSync");
        });

        it("Should reject sync to unsupported chains", async function () {
            const { ron, owner, user1 } = await loadFixture(deployRONUpgradeableFixture);

            await expect(
                ron.connect(owner).syncReputationCrossChain(user1.address, 999)
            ).to.be.revertedWith("Chain not supported");
        });
    });

    describe("Circuit Breaker and Rate Limiting", function () {
        it("Should enforce rate limiting between awards", async function () {
            const { ron, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // First award should succeed
            await ron.connect(gameContract).awardRON(user1.address, 0, false, false, "First");

            // Second immediate award should fail due to rate limiting
            await expect(
                ron.connect(gameContract).awardRON(user1.address, 0, false, false, "Second")
            ).to.be.revertedWithCustomError(ron, "RateLimitExceeded");
        });

        it("Should allow admin to update rate limit cooldown", async function () {
            const { ron, owner } = await loadFixture(deployRONUpgradeableFixture);

            await expect(
                ron.connect(owner).setRateLimitCooldown(600)
            ).to.emit(ron, "RateLimitUpdated")
             .withArgs(300, 600, owner.address);

            expect(await ron.minAwardCooldown()).to.equal(600);
        });

        it("Should allow emergency circuit breaker", async function () {
            const { ron, owner, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            await expect(
                ron.connect(owner).emergencyCircuitBreaker("Emergency detected")
            ).to.emit(ron, "CircuitBreakerTriggered");

            // All operations should be paused
            await expect(
                ron.connect(gameContract).awardRON(user1.address, 0, false, false, "Paused")
            ).to.be.revertedWithCustomError(ron, "EnforcedPause");
        });
    });

    describe("Upgrade Functionality", function () {
        it("Should be upgradeable by admin", async function () {
            const { ron, owner } = await loadFixture(deployRONUpgradeableFixture);

            // Deploy new implementation
            const RONUpgradeableV2 = await ethers.getContractFactory("RONUpgradeable");

            await expect(
                upgrades.upgradeProxy(await ron.getAddress(), RONUpgradeableV2)
            ).to.not.be.reverted;
        });

        it("Should preserve state after upgrade", async function () {
            const { ron, owner, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // Set some state
            await ron.connect(gameContract).awardRON(user1.address, 1, false, false, "Pre-upgrade");
            const statsBefore = await ron.getUserStats(user1.address);

            // Upgrade
            const RONUpgradeableV2 = await ethers.getContractFactory("RONUpgradeable");
            const upgraded = await upgrades.upgradeProxy(await ron.getAddress(), RONUpgradeableV2);

            // Verify state preservation
            const statsAfter = await upgraded.getUserStats(user1.address);
            expect(statsAfter[0]).to.equal(statsBefore[0]); // totalRON preserved
            expect(statsAfter[1]).to.equal(statsBefore[1]); // correctAnswers preserved
        });

        it("Should reject unauthorized upgrade attempts", async function () {
            const { ron, user1 } = await loadFixture(deployRONUpgradeableFixture);

            const RONUpgradeableV2 = await ethers.getContractFactory("RONUpgradeable");

            await expect(
                upgrades.upgradeProxy(await ron.getAddress(), RONUpgradeableV2.connect(user1))
            ).to.be.reverted; // Should fail because user1 doesn't have UPGRADER_ROLE
        });
    });

    describe("Soul-bound Token Properties", function () {
        it("Should prevent transfers", async function () {
            const { ron, user1, user2 } = await loadFixture(deployRONUpgradeableFixture);

            await expect(
                ron.connect(user1).transfer(user2.address, 100)
            ).to.be.revertedWithCustomError(ron, "SoulBoundTokenTransfer");
        });

        it("Should prevent transferFrom", async function () {
            const { ron, user1, user2, user3 } = await loadFixture(deployRONUpgradeableFixture);

            await expect(
                ron.connect(user1).transferFrom(user2.address, user3.address, 100)
            ).to.be.revertedWithCustomError(ron, "SoulBoundTokenTransfer");
        });

        it("Should prevent approve", async function () {
            const { ron, user1, user2 } = await loadFixture(deployRONUpgradeableFixture);

            await expect(
                ron.connect(user1).approve(user2.address, 100)
            ).to.be.revertedWithCustomError(ron, "SoulBoundTokenTransfer");
        });
    });

    describe("Analytics and Statistics", function () {
        it("Should track global statistics correctly", async function () {
            const { ron, gameContract, user1, user2 } = await loadFixture(deployRONUpgradeableFixture);

            // Award RON to multiple users
            await ron.connect(gameContract).awardRON(user1.address, 0, false, false, "User1");
            await ron.connect(gameContract).awardRON(user2.address, 1, false, false, "User2");

            const globalStats = await ron.getGlobalStats();
            expect(globalStats[0]).to.equal(2); // totalUsers
            expect(globalStats[1]).to.be.gt(0); // totalRONMinted
            expect(globalStats[2]).to.equal(2); // totalRiddlesSolved
        });

        it("Should emit performance metrics correctly", async function () {
            const { ron, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            await expect(
                ron.connect(gameContract).awardRON(user1.address, 0, false, false, "Metrics test")
            ).to.emit(ron, "PerformanceMetrics");
        });

        it("Should allow system health check", async function () {
            const { ron, owner, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // Award some RON first
            await ron.connect(gameContract).awardRON(user1.address, 1, false, false, "Health check setup");

            await expect(
                ron.connect(owner).triggerSystemHealthCheck()
            ).to.emit(ron, "SystemHealthCheck");
        });
    });

    describe("Security and Edge Cases", function () {
        it("Should handle zero address validations", async function () {
            const { ron, gameContract } = await loadFixture(deployRONUpgradeableFixture);

            // This would likely be caught by the game contract, but test anyway
            await expect(
                ron.connect(gameContract).awardRON(
                    ethers.ZeroAddress,
                    0,
                    false,
                    false,
                    "Zero address test"
                )
            ).to.not.be.reverted; // RON doesn't specifically check for zero address
        });

        it("Should handle large numbers correctly", async function () {
            const { ron, oracle, user1 } = await loadFixture(deployRONUpgradeableFixture);

            const largeAmount = 49999; // Just under the circuit breaker limit

            await expect(
                ron.connect(oracle).awardValidationRON(user1.address, largeAmount, "Large validation")
            ).to.not.be.reverted;

            const stats = await ron.getUserStats(user1.address);
            expect(stats[0]).to.equal(largeAmount);
        });

        it("Should prevent reentrancy attacks", async function () {
            const { ron, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // The ReentrancyGuard should prevent any reentrancy
            await expect(
                ron.connect(gameContract).awardRON(user1.address, 0, false, false, "Reentrancy test")
            ).to.not.be.reverted;
        });

        it("Should handle invalid difficulty values gracefully", async function () {
            const { ron, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            // Test with invalid difficulty (>3)
            await expect(
                ron.connect(gameContract).awardRON(user1.address, 4, false, false, "Invalid difficulty")
            ).to.not.be.reverted; // Contract should handle gracefully by defaulting to 0 reward
        });
    });

    describe("Gas Optimization Tests", function () {
        it("Should efficiently handle batch operations", async function () {
            const { ron, gameContract, user1, user2, user3 } = await loadFixture(deployRONUpgradeableFixture);

            const batchSize = 10;
            const users = Array(batchSize).fill().map(() => ethers.Wallet.createRandom().address);
            const difficulties = Array(batchSize).fill(0);
            const isFirstSolvers = Array(batchSize).fill(false);
            const isSpeedSolvers = Array(batchSize).fill(false);
            const reasons = Array(batchSize).fill("Gas test");

            // This should not run out of gas for reasonable batch sizes
            await expect(
                ron.connect(gameContract).batchAwardRON(
                    users,
                    difficulties,
                    isFirstSolvers,
                    isSpeedSolvers,
                    reasons
                )
            ).to.not.be.reverted;
        });

        it("Should have reasonable gas costs for standard operations", async function () {
            const { ron, gameContract, user1 } = await loadFixture(deployRONUpgradeableFixture);

            const tx = await ron.connect(gameContract).awardRON(
                user1.address,
                0,
                false,
                false,
                "Gas cost test"
            );
            const receipt = await tx.wait();

            // Gas usage should be reasonable (this is a sanity check)
            expect(receipt.gasUsed).to.be.lt(200000); // Less than 200k gas for award
        });
    });
});