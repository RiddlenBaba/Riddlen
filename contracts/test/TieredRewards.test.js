const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tiered Reward System", function () {
    let nftContract;
    let owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        // Deploy a mock RDLN token for testing
        const RDLN = await ethers.getContractFactory("RDLN");
        const rdlnToken = await RDLN.deploy(
            owner.address,
            owner.address,
            owner.address,
            owner.address,
            owner.address
        );
        await rdlnToken.waitForDeployment();

        // Deploy RiddleNFTv3
        const RiddleNFT = await ethers.getContractFactory("RiddleNFTv3");
        nftContract = await RiddleNFT.deploy(
            await rdlnToken.getAddress(),
            await rdlnToken.getAddress(), // Using RDLN as mock RON
            owner.address,  // grandPrizeWallet
            owner.address,  // devOpsWallet
            owner.address,  // admin
            "https://api.riddlen.com/metadata/"  // baseURI
        );
        await nftContract.waitForDeployment();
    });

    describe("Tier Boundary Calculations", function () {
        it("Should calculate correct tier boundaries for 20 winners", async function () {
            const [tier1Boundary, tier2Boundary, tier1Size, tier2Size, tier3Size] =
                await nftContract.getTierInfo(20);

            expect(tier1Boundary).to.equal(5);  // 25% of 20 = 5
            expect(tier2Boundary).to.equal(15); // 75% of 20 = 15
            expect(tier1Size).to.equal(5);      // Positions 1-5
            expect(tier2Size).to.equal(10);     // Positions 6-15
            expect(tier3Size).to.equal(5);      // Positions 16-20
        });

        it("Should calculate correct tier boundaries for 100 winners", async function () {
            const [tier1Boundary, tier2Boundary, tier1Size, tier2Size, tier3Size] =
                await nftContract.getTierInfo(100);

            expect(tier1Boundary).to.equal(25);  // 25% of 100 = 25
            expect(tier2Boundary).to.equal(75);  // 75% of 100 = 75
            expect(tier1Size).to.equal(25);      // Positions 1-25
            expect(tier2Size).to.equal(50);      // Positions 26-75
            expect(tier3Size).to.equal(25);      // Positions 76-100
        });

        it("Should handle small winner counts (4 winners)", async function () {
            const [tier1Boundary, tier2Boundary, tier1Size, tier2Size, tier3Size] =
                await nftContract.getTierInfo(4);

            expect(tier1Boundary).to.equal(1);   // Minimum 1 person in tier 1
            expect(tier2Boundary).to.equal(3);   // Adjusted to ensure proper distribution
            expect(tier1Size).to.equal(1);       // Position 1
            expect(tier2Size).to.equal(2);       // Positions 2-3
            expect(tier3Size).to.equal(1);       // Position 4
        });

        it("Should handle edge case of 1 winner", async function () {
            const [tier1Boundary, tier2Boundary, tier1Size, tier2Size, tier3Size] =
                await nftContract.getTierInfo(1);

            expect(tier1Boundary).to.equal(1);   // Single winner gets tier 1
            expect(tier2Boundary).to.equal(1);   // Boundary adjusted
            expect(tier1Size).to.equal(1);       // Position 1
            expect(tier2Size).to.equal(0);       // No tier 2
            expect(tier3Size).to.equal(0);       // No tier 3
        });

        it("Should handle edge case of 2 winners", async function () {
            const [tier1Boundary, tier2Boundary, tier1Size, tier2Size, tier3Size] =
                await nftContract.getTierInfo(2);

            expect(tier1Boundary).to.equal(1);   // First winner
            expect(tier2Boundary).to.equal(1);   // Boundary capped at tier1
            expect(tier1Size).to.equal(1);       // Position 1
            expect(tier2Size).to.equal(0);       // No tier 2
            expect(tier3Size).to.equal(1);       // Position 2 (gets tier 3)
        });
    });

    describe("Tiered Reward Calculations", function () {
        const PRIZE_POOL = ethers.parseEther("1000000"); // 1M RDLN

        it("Should calculate correct rewards for 20 winners example", async function () {
            // Total units: (5 * 2) + (10 * 1) + (5 * 0.5) = 10 + 10 + 2.5 = 22.5
            // Base unit: 1M / 22.5 = 44,444.44 RDLN

            // Tier 1 rewards (2x multiplier)
            const tier1Reward = await nftContract.previewTieredReward(PRIZE_POOL, 20, 1);
            const tier1Expected = PRIZE_POOL * 200n / 2250n; // 2x out of 22.5 total units
            expect(tier1Reward).to.be.closeTo(tier1Expected, ethers.parseEther("1")); // 1 RDLN tolerance

            // Tier 2 rewards (1x multiplier)
            const tier2Reward = await nftContract.previewTieredReward(PRIZE_POOL, 20, 10);
            const tier2Expected = PRIZE_POOL * 100n / 2250n; // 1x out of 22.5 total units
            expect(tier2Reward).to.be.closeTo(tier2Expected, ethers.parseEther("1"));

            // Tier 3 rewards (0.5x multiplier)
            const tier3Reward = await nftContract.previewTieredReward(PRIZE_POOL, 20, 18);
            const tier3Expected = PRIZE_POOL * 50n / 2250n; // 0.5x out of 22.5 total units
            expect(tier3Reward).to.be.closeTo(tier3Expected, ethers.parseEther("1"));

            // Verify tier 1 is approximately 2x tier 2 (convert to numbers)
            const ratio1 = Number(tier1Reward) / Number(tier2Reward);
            const ratio2 = Number(tier2Reward) / Number(tier3Reward);
            expect(ratio1).to.be.closeTo(2, 0.1);
            expect(ratio2).to.be.closeTo(2, 0.1);
        });

        it("Should distribute total prize pool correctly", async function () {
            const winners = 20;
            let totalDistributed = 0n;

            // Calculate rewards for all solve positions
            for (let position = 1; position <= winners; position++) {
                const reward = await nftContract.previewTieredReward(PRIZE_POOL, winners, position);
                totalDistributed += reward;
            }

            // Total distributed should equal prize pool (within rounding tolerance)
            const tolerance = ethers.parseEther("10"); // 10 RDLN tolerance for rounding
            expect(totalDistributed).to.be.closeTo(PRIZE_POOL, tolerance);
        });

        it("Should work with different prize pool sizes", async function () {
            const smallPool = ethers.parseEther("100000"); // 100K RDLN
            const largePool = ethers.parseEther("10000000"); // 10M RDLN

            const smallReward = await nftContract.previewTieredReward(smallPool, 20, 1);
            const largeReward = await nftContract.previewTieredReward(largePool, 20, 1);

            // Large pool should give proportionally larger rewards
            expect(largeReward / smallReward).to.equal(100);
        });

        it("Should handle large winner counts efficiently", async function () {
            const winners = 1000;

            // Test tier 1 (first 250)
            const tier1Reward = await nftContract.previewTieredReward(PRIZE_POOL, winners, 125);

            // Test tier 2 (positions 251-750)
            const tier2Reward = await nftContract.previewTieredReward(PRIZE_POOL, winners, 500);

            // Test tier 3 (positions 751-1000)
            const tier3Reward = await nftContract.previewTieredReward(PRIZE_POOL, winners, 875);

            // Verify multiplier relationships (convert to numbers for comparison)
            const ratio1 = Number(tier1Reward) / Number(tier2Reward);
            const ratio2 = Number(tier2Reward) / Number(tier3Reward);
            expect(ratio1).to.be.closeTo(2, 0.1);
            expect(ratio2).to.be.closeTo(2, 0.1);
        });
    });

    describe("Edge Cases and Error Handling", function () {
        const PRIZE_POOL = ethers.parseEther("1000000");

        it("Should revert for solve position exceeding winner slots", async function () {
            await expect(
                nftContract.previewTieredReward(PRIZE_POOL, 20, 21)
            ).to.be.revertedWith("Invalid solve position");
        });

        it("Should revert for zero solve position", async function () {
            await expect(
                nftContract.previewTieredReward(PRIZE_POOL, 20, 0)
            ).to.be.revertedWith("Invalid solve position");
        });

        it("Should handle zero prize pool", async function () {
            const reward = await nftContract.previewTieredReward(0, 20, 1);
            expect(reward).to.equal(0);
        });

        it("Should handle single winner correctly", async function () {
            const reward = await nftContract.previewTieredReward(PRIZE_POOL, 1, 1);
            expect(reward).to.equal(PRIZE_POOL); // Single winner gets full pool
        });
    });

    describe("Economic Incentive Analysis", function () {
        const PRIZE_POOL = ethers.parseEther("1000000");

        it("Should create clear incentive to solve early vs late", async function () {
            const winners = 20;

            const firstSolver = await nftContract.previewTieredReward(PRIZE_POOL, winners, 1);
            const lastSolver = await nftContract.previewTieredReward(PRIZE_POOL, winners, 20);

            // First solver should get significantly more than last solver
            const incentiveRatio = Number(firstSolver) / Number(lastSolver);
            expect(incentiveRatio).to.be.greaterThan(3.5); // At least 3.5x more
            expect(incentiveRatio).to.be.lessThan(4.5);   // But not excessive
        });

        it("Should maintain reasonable rewards even for late solvers", async function () {
            const winners = 20;

            const earlyReward = await nftContract.previewTieredReward(PRIZE_POOL, winners, 1);
            const lateReward = await nftContract.previewTieredReward(PRIZE_POOL, winners, 20);

            // Late solvers should still get meaningful rewards (at least 10% of early)
            const lateRatio = Number(lateReward) / Number(earlyReward);
            expect(lateRatio).to.be.greaterThan(0.20); // At least 20% of early reward
        });

        it("Should show graduation of rewards across tiers", async function () {
            const winners = 100;

            const tier1Sample = await nftContract.previewTieredReward(PRIZE_POOL, winners, 10);
            const tier2Sample = await nftContract.previewTieredReward(PRIZE_POOL, winners, 50);
            const tier3Sample = await nftContract.previewTieredReward(PRIZE_POOL, winners, 90);

            // Should be clear graduation: Tier 1 > Tier 2 > Tier 3
            expect(tier1Sample).to.be.greaterThan(tier2Sample);
            expect(tier2Sample).to.be.greaterThan(tier3Sample);

            // And approximate 2x relationships (convert to numbers)
            const ratio1 = Number(tier1Sample) / Number(tier2Sample);
            const ratio2 = Number(tier2Sample) / Number(tier3Sample);
            expect(ratio1).to.be.closeTo(2, 0.1);
            expect(ratio2).to.be.closeTo(2, 0.1);
        });
    });

    describe("Real-World Scenarios", function () {
        it("Should handle typical accessible riddle (50 winners)", async function () {
            const prizePool = ethers.parseEther("2000000"); // 2M RDLN
            const winners = 50;

            const [tier1Boundary, tier2Boundary] = await nftContract.getTierInfo(winners);
            expect(tier1Boundary).to.equal(12);  // First 12 get 2x
            expect(tier2Boundary).to.equal(37);  // Next 25 get 1x

            // Sample rewards
            const firstPlace = await nftContract.previewTieredReward(prizePool, winners, 1);
            const midPlace = await nftContract.previewTieredReward(prizePool, winners, 25);
            const lastPlace = await nftContract.previewTieredReward(prizePool, winners, 50);

            console.log(`50-Winner Riddle (2M RDLN pool):`);
            console.log(`  1st place: ${ethers.formatEther(firstPlace)} RDLN`);
            console.log(`  25th place: ${ethers.formatEther(midPlace)} RDLN`);
            console.log(`  50th place: ${ethers.formatEther(lastPlace)} RDLN`);
        });

        it("Should handle elite challenge (5 winners)", async function () {
            const prizePool = ethers.parseEther("5000000"); // 5M RDLN
            const winners = 5;

            const [tier1Boundary, tier2Boundary] = await nftContract.getTierInfo(winners);
            expect(tier1Boundary).to.equal(1);   // First 1 gets 2x
            expect(tier2Boundary).to.equal(3);   // Positions 2-3 get 1x, positions 4-5 get 0.5x

            // All 5 rewards
            const rewards = [];
            for (let i = 1; i <= 5; i++) {
                const reward = await nftContract.previewTieredReward(prizePool, winners, i);
                rewards.push(ethers.formatEther(reward));
            }

            console.log(`5-Winner Elite Challenge (5M RDLN pool):`);
            rewards.forEach((reward, index) => {
                console.log(`  ${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} place: ${reward} RDLN`);
            });
        });

        it("Should handle legendary mystery (1 winner)", async function () {
            const prizePool = ethers.parseEther("10000000"); // 10M RDLN
            const winners = 1;

            const reward = await nftContract.previewTieredReward(prizePool, winners, 1);
            expect(reward).to.equal(prizePool); // Winner takes all

            console.log(`Legendary Mystery (10M RDLN pool):`);
            console.log(`  Winner takes all: ${ethers.formatEther(reward)} RDLN`);
        });
    });
});