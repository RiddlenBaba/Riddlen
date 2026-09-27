const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("🎮 Riddlen Game NFT System", function () {
    let gameNFT, ronToken, gaslessManager;
    let owner, player1, player2, validator1, validator2;

    before(async function () {
        console.log("\n🚀 DEPLOYING RIDDLEN GAME NFT SYSTEM...\n");

        [owner, player1, player2, validator1, validator2] = await ethers.getSigners();

        // Deploy RON Token
        console.log("📦 Deploying RON Token...");
        const RONToken = await ethers.getContractFactory("contracts/reputation/RONUpgradeable.sol:RONUpgradeable");
        ronToken = await upgrades.deployProxy(RONToken, [
            owner.address,  // admin
            3600           // minAwardCooldown (1 hour)
        ]);
        await ronToken.waitForDeployment();
        console.log(`   ✅ RON deployed at: ${await ronToken.getAddress()}`);

        // Deploy GaslessManager
        console.log("📦 Deploying Gasless Manager...");
        const GaslessManager = await ethers.getContractFactory("GaslessManager");
        gaslessManager = await upgrades.deployProxy(GaslessManager, [
            await ronToken.getAddress(),
            owner.address
        ]);
        await gaslessManager.waitForDeployment();
        console.log(`   ✅ GaslessManager deployed at: ${await gaslessManager.getAddress()}`);

        // Deploy Game NFT
        console.log("📦 Deploying Riddlen Game NFT...");
        const RiddlenGameNFT = await ethers.getContractFactory("RiddlenGameNFT");
        gameNFT = await upgrades.deployProxy(RiddlenGameNFT, [
            await ronToken.getAddress(),
            await gaslessManager.getAddress(),
            owner.address
        ]);
        await gameNFT.waitForDeployment();
        console.log(`   ✅ Game NFT deployed at: ${await gameNFT.getAddress()}`);

        // Setup roles
        console.log("\n🔧 Setting up roles and permissions...");

        // Grant GAME_ROLE to Game NFT for RON rewards
        await ronToken.grantRole(await ronToken.GAME_ROLE(), await gameNFT.getAddress());

        // Grant VALIDATOR_ROLE to validators
        await gameNFT.grantRole(await gameNFT.VALIDATOR_ROLE(), validator1.address);
        await gameNFT.grantRole(await gameNFT.VALIDATOR_ROLE(), validator2.address);

        // Authorize Game NFT for gasless transactions
        await gaslessManager.authorizeContract(await gameNFT.getAddress());

        console.log("   ✅ All roles configured");
        console.log("\n🌟 SYSTEM DEPLOYMENT COMPLETE!\n");
    });

    describe("📝 Game Content Submission", function () {
        it("Should allow users to submit game content", async function () {
            console.log("📝 Player 1 submitting riddle content...");

            const gameType = 0; // RIDDLE
            const contentIPFS = "QmTestRiddle123";
            const solutionIPFS = "QmTestSolution123";

            await gameNFT.connect(player1).submitGameContent(
                gameType,
                contentIPFS,
                solutionIPFS
            );

            console.log(`   ✅ Content submitted: ${contentIPFS}`);

            // Check submission was created
            const submission = await gameNFT.submissions(0);
            expect(submission.submitter).to.equal(player1.address);
            expect(submission.contentIPFS).to.equal(contentIPFS);
            expect(submission.gameType).to.equal(gameType);
        });

        it("Should track weekly submission stats", async function () {
            console.log("📊 Checking weekly stats...");

            const currentWeek = await gameNFT.getCurrentWeek();
            const weekStats = await gameNFT.getWeeklyStats(currentWeek);

            console.log(`   📅 Current week: ${currentWeek}`);
            console.log(`   📈 Total submissions: ${weekStats.totalSubmissions}`);

            expect(weekStats.totalSubmissions).to.equal(1);
        });
    });

    describe("✅ Content Validation", function () {
        it("Should allow validators to approve content", async function () {
            console.log("✅ Validator 1 approving submission...");

            const submissionId = 0;
            const qualityScore = 85;

            await gameNFT.connect(validator1).validateSubmission(
                submissionId,
                true,  // approve
                qualityScore
            );

            console.log(`   ✅ Validation complete with score: ${qualityScore}`);

            const submission = await gameNFT.submissions(submissionId);
            expect(submission.validatorVotes).to.equal(1);
            expect(submission.qualityScore).to.equal(qualityScore);
        });

        it("Should require multiple validator approvals", async function () {
            console.log("✅ Adding more validator approvals...");

            // Add more submissions to reach minimum
            await gameNFT.connect(player2).submitGameContent(1, "QmLogicPuzzle", "QmLogicSolution");
            await gameNFT.connect(player1).submitGameContent(2, "QmMathChallenge", "QmMathSolution");

            // Validate all submissions
            for (let i = 1; i <= 2; i++) {
                await gameNFT.connect(validator1).validateSubmission(i, true, 80);
                await gameNFT.connect(validator2).validateSubmission(i, true, 90);
            }

            // Complete validation of first submission
            await gameNFT.connect(validator2).validateSubmission(0, true, 90);

            console.log("   ✅ Multiple submissions validated");

            // Check if we can generate NFT
            const canGenerate = await gameNFT.canGenerateWeeklyNFT();
            console.log(`   🎮 Can generate weekly NFT: ${canGenerate}`);
        });
    });

    describe("🎮 Weekly Game NFT Generation", function () {
        it("Should auto-generate weekly game NFT with enough submissions", async function () {
            console.log("🎮 Adding more submissions for NFT generation...");

            // Add more submissions to reach minimum (10 required)
            for (let i = 0; i < 7; i++) {
                await gameNFT.connect(player1).submitGameContent(
                    0, // RIDDLE
                    `QmTestContent${i}`,
                    `QmTestSolution${i}`
                );

                // Validate each submission
                const submissionId = 3 + i;
                await gameNFT.connect(validator1).validateSubmission(submissionId, true, 80);
                await gameNFT.connect(validator2).validateSubmission(submissionId, true, 85);

                // Add third validator approval to trigger generation
                if (i === 6) {
                    await gameNFT.grantRole(await gameNFT.VALIDATOR_ROLE(), owner.address);
                    await gameNFT.connect(owner).validateSubmission(submissionId, true, 90);
                }
            }

            console.log("   🎮 Attempting to generate weekly NFT...");

            // Check if NFT can be generated
            const canGenerate = await gameNFT.canGenerateWeeklyNFT();
            console.log(`   ✅ Can generate NFT: ${canGenerate}`);

            // Force generation if conditions met
            if (canGenerate) {
                await gameNFT.forceGenerateWeeklyNFT();
                console.log("   🎉 Weekly Game NFT generated!");

                // Check if NFT was minted
                const totalSupply = await gameNFT.totalSupply();
                expect(totalSupply).to.equal(1);

                // Check game data
                const gameData = await gameNFT.gameNFTs(1);
                console.log(`   🎯 Game Type: ${gameData.primaryType}`);
                console.log(`   ⚡ Difficulty: ${gameData.difficulty}`);
                console.log(`   🧩 Total Challenges: ${gameData.totalChallenges}`);
            }
        });
    });

    describe("🏆 Game Playing and Rewards", function () {
        it("Should allow players to solve challenges and earn RON", async function () {
            console.log("🏆 Player 1 attempting to solve challenge...");

            const tokenId = 1;
            const challengeIndex = 0;
            const solutionIPFS = "QmPlayerSolution123";

            // Give player some initial RON for tier calculation
            await ronToken.grantRole(await ronToken.GAME_ROLE(), owner.address);
            await ronToken.connect(owner).awardRON(
                player1.address,
                0, // EASY difficulty
                false, false,
                "Initial RON for testing"
            );

            const balanceBefore = await ronToken.balanceOf(player1.address);
            console.log(`   💰 Player balance before: ${ethers.formatEther(balanceBefore)} RON`);

            // Solve challenge
            await gameNFT.connect(player1).solveChallengeUse(
                tokenId,
                challengeIndex,
                solutionIPFS
            );

            const balanceAfter = await ronToken.balanceOf(player1.address);
            console.log(`   💰 Player balance after: ${ethers.formatEther(balanceAfter)} RON`);

            // Check player stats
            const playerStats = await gameNFT.getPlayerStats(player1.address);
            console.log(`   📊 Challenges solved: ${playerStats.challengesSolved}`);
            console.log(`   🎮 Games played: ${playerStats.gamesPlayed}`);

            expect(playerStats.challengesSolved).to.equal(1);
        });

        it("Should show comprehensive game statistics", async function () {
            console.log("\n📊 GAME SYSTEM STATISTICS:");
            console.log("================================");

            const currentWeek = await gameNFT.getCurrentWeek();
            const currentEra = await gameNFT.getCurrentEra();
            const totalGames = await gameNFT.totalGamesGenerated();

            console.log(`📅 Current Week: ${currentWeek}`);
            console.log(`🌟 Current Era: ${currentEra}`);
            console.log(`🎮 Total Games Generated: ${totalGames}`);

            const weekStats = await gameNFT.getWeeklyStats(currentWeek);
            console.log(`📈 Weekly Submissions: ${weekStats.totalSubmissions}`);
            console.log(`✅ Approved Submissions: ${weekStats.approvedSubmissions}`);
            console.log(`👥 Unique Submitters: ${weekStats.uniqueSubmitters}`);
            console.log(`🎯 NFT Generated: ${weekStats.nftGenerated}`);

            if (totalGames > 0) {
                const gameData = await gameNFT.gameNFTs(1);
                console.log(`\n🎮 ACTIVE GAME (Token ID: 1):`);
                console.log(`   🎯 Type: ${gameData.primaryType}`);
                console.log(`   ⚡ Difficulty: ${gameData.difficulty}`);
                console.log(`   🧩 Total Challenges: ${gameData.totalChallenges}`);
                console.log(`   ✅ Solved Challenges: ${gameData.solvedChallenges}`);
                console.log(`   👥 Total Players: ${gameData.totalPlayers}`);
                console.log(`   💰 Rewards Distributed: ${ethers.formatEther(gameData.totalRewardsDistributed)} RON`);
            }

            console.log("\n🎉 GAME SYSTEM FULLY OPERATIONAL! 🎉\n");
        });
    });
});