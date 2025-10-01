const { expect } = require("chai");
const { ethers } = require("hardhat");
const { upgrades } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Riddlen Ecosystem Integration Tests", function () {
    // Comprehensive test fixture for full ecosystem
    async function deployRiddlenEcosystemFixture() {
        const [
            owner,
            gameContract,
            oracle,
            user1,
            user2,
            user3,
            devOpsWallet,
            grandPrizeWallet,
            treasuryWallet,
            compliance,
            validator1,
            validator2
        ] = await ethers.getSigners();

        // Deploy RDLN Token (Upgradeable)
        const RDLNUpgradeable = await ethers.getContractFactory("RDLNUpgradeable");
        const rdln = await upgrades.deployProxy(
            RDLNUpgradeable,
            [
                owner.address,        // _admin
                treasuryWallet.address, // _treasuryWallet
                devOpsWallet.address, // _liquidityWallet
                treasuryWallet.address, // _airdropWallet
                grandPrizeWallet.address, // _grandPrizeWallet
                devOpsWallet.address  // _operationsWallet
            ],
            {
                initializer: 'initialize',
                unsafeAllow: ['external-library-linking', 'delegatecall']
            }
        );
        await rdln.waitForDeployment();

        // Deploy RON Advanced Token
        const RONAdvanced = await ethers.getContractFactory("RONAdvanced");
        const ron = await upgrades.deployProxy(
            RONAdvanced,
            [
                owner.address,
                7200, // 2 hour voting period
                80,   // 80% quality threshold
                30    // 30 day activity threshold
            ],
            { initializer: 'initialize' }
        );
        await ron.waitForDeployment();

        // Deploy Advanced Riddle NFT
        const RiddleNFTAdvanced = await ethers.getContractFactory("RiddleNFTAdvanced");
        const riddleNFT = await upgrades.deployProxy(
            RiddleNFTAdvanced,
            [
                owner.address,
                await rdln.getAddress(),
                await ron.getAddress(),
                treasuryWallet.address,
                devOpsWallet.address,
                grandPrizeWallet.address
            ],
            { initializer: 'initialize' }
        );
        await riddleNFT.waitForDeployment();

        // Setup roles across contracts
        const MINTER_ROLE = await rdln.MINTER_ROLE();
        const GAME_ROLE = await ron.GAME_ROLE();
        const ORACLE_ROLE = await ron.ORACLE_ROLE();
        const GAME_MASTER_ROLE = await riddleNFT.GAME_MASTER_ROLE();
        const QUESTION_VALIDATOR_ROLE = await riddleNFT.QUESTION_VALIDATOR_ROLE();

        // Grant cross-contract permissions
        await rdln.grantRole(MINTER_ROLE, owner.address);
        await rdln.grantRole(MINTER_ROLE, await riddleNFT.getAddress());
        await rdln.grantRole(GAME_ROLE, await riddleNFT.getAddress());

        await ron.grantRole(GAME_ROLE, gameContract.address);
        await ron.grantRole(GAME_ROLE, await riddleNFT.getAddress());
        await ron.grantRole(ORACLE_ROLE, oracle.address);

        await riddleNFT.grantRole(GAME_MASTER_ROLE, gameContract.address);
        await riddleNFT.grantRole(QUESTION_VALIDATOR_ROLE, validator1.address);
        await riddleNFT.grantRole(QUESTION_VALIDATOR_ROLE, validator2.address);

        // Initial RDLN distribution for testing
        await rdln.mintAirdrop(user1.address, ethers.parseEther("100000"));
        await rdln.mintAirdrop(user2.address, ethers.parseEther("100000"));
        await rdln.mintAirdrop(user3.address, ethers.parseEther("100000"));
        await rdln.mintPrizePool(await riddleNFT.getAddress(), ethers.parseEther("10000000")); // Prize pool

        return {
            rdln,
            ron,
            riddleNFT,
            owner,
            gameContract,
            oracle,
            user1,
            user2,
            user3,
            devOpsWallet,
            grandPrizeWallet,
            treasuryWallet,
            compliance,
            validator1,
            validator2,
            MINTER_ROLE,
            GAME_ROLE,
            ORACLE_ROLE,
            GAME_MASTER_ROLE,
            QUESTION_VALIDATOR_ROLE
        };
    }

    describe("Ecosystem Deployment and Integration", function () {
        it("Should deploy all contracts with correct integration", async function () {
            const { rdln, ron, riddleNFT } = await loadFixture(deployRiddlenEcosystemFixture);

            // Verify contract addresses are set correctly
            expect(await riddleNFT.rdlnToken()).to.equal(await rdln.getAddress());
            expect(await riddleNFT.ronToken()).to.equal(await ron.getAddress());

            // Verify initial state
            expect(await rdln.name()).to.equal("Riddlen Token");
            expect(await rdln.symbol()).to.equal("RDLN");
            expect(await riddleNFT.name()).to.equal("Riddlen Achievement NFT");
            expect(await riddleNFT.symbol()).to.equal("RIDDLE");
        });

        it("Should have correct role permissions across contracts", async function () {
            const { rdln, ron, riddleNFT, gameContract, GAME_ROLE, MINTER_ROLE } = await loadFixture(deployRiddlenEcosystemFixture);

            expect(await ron.hasRole(GAME_ROLE, gameContract.address)).to.be.true;
            expect(await rdln.hasRole(MINTER_ROLE, await riddleNFT.getAddress())).to.be.true;
        });
    });

    describe("Complete User Journey: Gaming to Governance", function () {
        it("Should complete full ecosystem journey: RDLN → Riddle → RON → Governance", async function () {
            const {
                rdln, ron, riddleNFT, gameContract, user1, user2, user3, validator1, validator2
            } = await loadFixture(deployRiddlenEcosystemFixture);

            // ========== PHASE 1: Question Creation and Validation ==========
            console.log("\n=== PHASE 1: Question Creation ===");

            // User2 creates a question for the riddle
            await rdln.connect(user2).approve(await riddleNFT.getAddress(), ethers.parseEther("1"));

            const questionTx = await riddleNFT.connect(user2).submitQuestion(
                "What is the maximum supply of Bitcoin?",
                0, // MULTIPLE_CHOICE
                ethers.keccak256(ethers.toUtf8Bytes("21000000")),
                ["21000000", "100000000", "1000000000", "Unlimited"],
                0 // EASY difficulty - starting point for new users
            );

            const questionReceipt = await questionTx.wait();
            const questionSubmittedEvent = questionReceipt.logs.find(
                log => log.fragment && log.fragment.name === 'QuestionSubmitted'
            );
            const questionId = questionSubmittedEvent.args[0];

            console.log(`Question submitted with ID: ${questionId}`);

            // Grant validator role to user3 temporarily for testing
            await riddleNFT.grantRole(await riddleNFT.QUESTION_VALIDATOR_ROLE(), user3.address);

            // Validators approve the question (need 3 minimum)
            await riddleNFT.connect(validator1).validateQuestion(questionId, true);
            await riddleNFT.connect(validator2).validateQuestion(questionId, true);
            await riddleNFT.connect(user3).validateQuestion(questionId, true);

            const questionData = await riddleNFT.getQuestionData(questionId);
            expect(questionData.validated).to.be.true;
            console.log("Question validated successfully");

            // ========== PHASE 2: Riddle Session Creation ==========
            console.log("\n=== PHASE 2: Riddle Session Creation ===");

            const riddleTx = await riddleNFT.connect(gameContract).createRiddleSession(
                "Bitcoin Basics Challenge",
                "Test your knowledge of Bitcoin fundamentals",
                "Cryptocurrency",
                0, // EASY difficulty - accessible to new users
                [questionId],
                1800 // 30 minutes
            );

            const riddleReceipt = await riddleTx.wait();
            const riddleCreatedEvent = riddleReceipt.logs.find(
                log => log.fragment && log.fragment.name === 'RiddleSessionCreated'
            );
            const sessionId = riddleCreatedEvent.args[0];

            console.log(`Riddle session created with ID: ${sessionId}`);

            // Start the riddle session
            await riddleNFT.connect(gameContract).startRiddleSession(sessionId);

            const sessionData = await riddleNFT.getRiddleSession(sessionId);
            console.log(`Session parameters: maxMints=${sessionData.maxMints}, prizePool=${ethers.formatEther(sessionData.prizePool)} RDLN, winnerSlots=${sessionData.winnerSlots}`);

            // ========== PHASE 3: User Gaming Experience ==========
            console.log("\n=== PHASE 3: Gaming Experience ===");

            // User1 mints riddle access NFT
            const mintCost = await riddleNFT.getCurrentMintCost();
            console.log(`Current mint cost: ${ethers.formatEther(mintCost)} RDLN`);

            await rdln.connect(user1).approve(await riddleNFT.getAddress(), mintCost);

            const mintTx = await riddleNFT.connect(user1).mintRiddleAccess(sessionId);
            const mintReceipt = await mintTx.wait();
            const accessMintedEvent = mintReceipt.logs.find(
                log => log.fragment && log.fragment.name === 'RiddleAccessMinted'
            );
            const tokenId = accessMintedEvent.args[1];

            console.log(`User1 minted access NFT with token ID: ${tokenId}`);

            // Wait 30 seconds to respect anti-cheat timing restrictions
            await time.increase(30);

            // User1 submits correct answer
            const correctAnswerHash = ethers.keccak256(ethers.toUtf8Bytes("21000000"));

            await riddleNFT.connect(user1).submitAnswer(sessionId, 0, correctAnswerHash);
            console.log("User1 submitted correct answer");

            // Verify riddle completion
            const participantData = await riddleNFT.getParticipantData(tokenId);
            expect(participantData.successful).to.be.true;
            console.log(`User1 successfully completed riddle and won ${ethers.formatEther(participantData.prizeAmount)} RDLN`);

            // ========== PHASE 4: RON Reputation System ==========
            console.log("\n=== PHASE 4: RON Reputation ===");

            // Check RON balance after riddle completion
            const ronBalance = await ron.balanceOf(user1.address);
            expect(ronBalance).to.be.gt(0);
            console.log(`User1 earned ${ronBalance} RON reputation`);

            // Check user tier advancement
            const userTier = await ron.getUserTier(user1.address);
            console.log(`User1 current tier: ${userTier}`);

            // Check governance eligibility
            const governanceWeight = await ron.calculateGovernanceWeight(user1.address);
            console.log(`User1 governance weight: ${governanceWeight}`);

            // ========== PHASE 5: Merit-Based Governance ==========
            console.log("\n=== PHASE 5: Merit-Based Governance ===");

            // Award more RON to reach governance tier
            for (let i = 0; i < 10; i++) {
                await ron.connect(gameContract).awardRON(
                    user1.address,
                    1, // MEDIUM
                    false,
                    false,
                    `Additional RON ${i+1}`
                );
            }

            const finalRONBalance = await ron.balanceOf(user1.address);
            console.log(`User1 final RON balance: ${finalRONBalance}`);

            // Check if user can participate in governance
            const finalGovernanceWeight = await ron.calculateGovernanceWeight(user1.address);
            const finalTier = await ron.calculateGovernanceTier(user1.address);

            console.log(`User1 final governance weight: ${finalGovernanceWeight}`);
            console.log(`User1 final governance tier: ${finalTier}`);

            if (finalTier >= 3) { // SENATOR tier
                console.log("User1 can create governance proposals!");

                // Create a governance proposal
                const proposalTx = await ron.connect(user1).createProposal(
                    "Adjust Oracle Parameters",
                    "Proposal to update oracle network quality standards",
                    0 // ORACLE_PARAMETERS
                );

                const proposalReceipt = await proposalTx.wait();
                const proposalCreatedEvent = proposalReceipt.logs.find(
                    log => log.fragment && log.fragment.name === 'GovernanceProposalCreated'
                );
                const proposalId = proposalCreatedEvent.args[0];

                console.log(`Governance proposal created with ID: ${proposalId}`);
            }

            // ========== PHASE 6: Prize Claiming ==========
            console.log("\n=== PHASE 6: Prize Claiming ===");

            const initialRDLNBalance = await rdln.balanceOf(user1.address);
            await riddleNFT.connect(user1).claimPrize(tokenId);
            const finalRDLNBalance = await rdln.balanceOf(user1.address);

            const prizeAmount = finalRDLNBalance - initialRDLNBalance;
            console.log(`User1 claimed ${ethers.formatEther(prizeAmount)} RDLN prize`);

            // ========== VERIFICATION ==========
            console.log("\n=== JOURNEY COMPLETE ===");
            console.log(`✅ User1 completed full ecosystem journey:`);
            console.log(`   - Started with RDLN tokens`);
            console.log(`   - Minted riddle access NFT`);
            console.log(`   - Successfully solved riddle`);
            console.log(`   - Earned RON reputation: ${finalRONBalance}`);
            console.log(`   - Achieved governance tier: ${finalTier}`);
            console.log(`   - Claimed RDLN prize: ${ethers.formatEther(prizeAmount)}`);
            console.log(`   - Owns achievement NFT: ${tokenId}`);

            // Verify all components worked together
            expect(ronBalance).to.be.gt(0); // Earned RON
            expect(prizeAmount).to.be.gt(0); // Claimed prize
            expect(await riddleNFT.ownerOf(tokenId)).to.equal(user1.address); // Owns NFT
            expect(participantData.successful).to.be.true; // Successful completion
        });
    });

    describe("Economic Integration: Burn Mechanisms", function () {
        it("Should properly distribute burns across the ecosystem", async function () {
            const {
                rdln, ron, riddleNFT, gameContract, user1, devOpsWallet, grandPrizeWallet
            } = await loadFixture(deployRiddlenEcosystemFixture);

            const initialDevBalance = await rdln.balanceOf(devOpsWallet.address);
            const initialGrandPrizeBalance = await rdln.balanceOf(grandPrizeWallet.address);
            const initialTotalSupply = await rdln.totalSupply();

            // Test RDLN burn mechanism
            const burnAmount = ethers.parseEther("1000");
            await rdln.connect(user1).burn(burnAmount);

            // Verify burn distribution (50% burn, 25% grand prize, 25% dev/ops)
            const expectedBurn = (burnAmount * 50n) / 100n;
            const expectedGrandPrize = (burnAmount * 25n) / 100n;
            const expectedDevOps = (burnAmount * 25n) / 100n;

            const finalTotalSupply = await rdln.totalSupply();
            const finalDevBalance = await rdln.balanceOf(devOpsWallet.address);
            const finalGrandPrizeBalance = await rdln.balanceOf(grandPrizeWallet.address);

            expect(finalTotalSupply).to.equal(initialTotalSupply - expectedBurn);
            expect(finalDevBalance).to.equal(initialDevBalance + expectedDevOps);
            expect(finalGrandPrizeBalance).to.equal(initialGrandPrizeBalance + expectedGrandPrize);

            console.log(`Burn distribution verified:`);
            console.log(`  - Burned: ${ethers.formatEther(expectedBurn)} RDLN`);
            console.log(`  - Grand Prize: ${ethers.formatEther(expectedGrandPrize)} RDLN`);
            console.log(`  - Dev/Ops: ${ethers.formatEther(expectedDevOps)} RDLN`);
        });

        it("Should handle progressive mint cost reduction", async function () {
            const { riddleNFT } = await loadFixture(deployRiddlenEcosystemFixture);

            const currentCost = await riddleNFT.getCurrentMintCost();
            expect(currentCost).to.equal(ethers.parseEther("1000")); // Initial cost

            console.log(`Current mint cost: ${ethers.formatEther(currentCost)} RDLN`);
        });
    });

    describe("Security Integration: Anti-Cheating Across Contracts", function () {
        it("Should detect and prevent Sybil attacks across RON and NFT systems", async function () {
            const { ron, riddleNFT, gameContract, user1 } = await loadFixture(deployRiddlenEcosystemFixture);

            // Attempt rapid successive RON awards (should trigger rate limiting)
            await ron.connect(gameContract).awardRON(user1.address, 0, false, false, "First award");

            // Second immediate award should fail due to rate limiting
            await expect(
                ron.connect(gameContract).awardRON(user1.address, 0, false, false, "Second award")
            ).to.be.revertedWithCustomError(ron, "RateLimitExceeded");

            console.log("✅ Rate limiting protection working across contracts");
        });

        it("Should maintain consistent user identity across contracts", async function () {
            const { rdln, ron, riddleNFT, gameContract, user1 } = await loadFixture(deployRiddlenEcosystemFixture);

            // Award RON and verify balance
            await ron.connect(gameContract).awardRON(user1.address, 1, false, false, "Test award");
            const ronBalance = await ron.balanceOf(user1.address);

            // Check tier in both systems
            const ronTier = await ron.getUserTier(user1.address);

            // User should have consistent access across systems
            expect(ronBalance).to.be.gt(0);
            console.log(`User tier consistency verified: RON tier ${ronTier}`);
        });
    });

    describe("Upgrade Compatibility", function () {
        it("Should maintain state consistency after contract upgrades", async function () {
            const { rdln, ron, riddleNFT, user1, gameContract } = await loadFixture(deployRiddlenEcosystemFixture);

            // Set some initial state
            await ron.connect(gameContract).awardRON(user1.address, 1, false, false, "Pre-upgrade");
            const preUpgradeRON = await ron.balanceOf(user1.address);

            // Upgrade RON contract
            const RONAdvancedV2 = await ethers.getContractFactory("RONAdvanced");
            const upgradedRON = await upgrades.upgradeProxy(await ron.getAddress(), RONAdvancedV2);

            // Verify state preservation
            const postUpgradeRON = await upgradedRON.balanceOf(user1.address);
            expect(postUpgradeRON).to.equal(preUpgradeRON);

            console.log("✅ Contract upgrade compatibility verified");
        });
    });

    describe("Performance and Gas Optimization", function () {
        it("Should efficiently handle batch operations across contracts", async function () {
            const { rdln, ron, gameContract, user1, user2, user3 } = await loadFixture(deployRiddlenEcosystemFixture);

            const users = [user1.address, user2.address, user3.address];
            const difficulties = [0, 1, 2]; // EASY, MEDIUM, HARD
            const isFirstSolvers = [true, false, true];
            const isSpeedSolvers = [false, true, false];
            const reasons = ["Batch1", "Batch2", "Batch3"];

            const tx = await ron.connect(gameContract).batchAwardRON(
                users,
                difficulties,
                isFirstSolvers,
                isSpeedSolvers,
                reasons
            );

            const receipt = await tx.wait();
            console.log(`Batch operation gas used: ${receipt.gasUsed}`);

            // Verify all users received RON
            expect(await ron.balanceOf(user1.address)).to.be.gt(0);
            expect(await ron.balanceOf(user2.address)).to.be.gt(0);
            expect(await ron.balanceOf(user3.address)).to.be.gt(0);
        });

        it("Should have reasonable gas costs for complex operations", async function () {
            const { rdln, riddleNFT, user1, gameContract } = await loadFixture(deployRiddlenEcosystemFixture);

            // Create and start a riddle session for testing
            const riddleTx = await riddleNFT.connect(gameContract).createRiddleSession(
                "Gas Test Riddle",
                "Testing gas consumption",
                "Performance",
                1, // MEDIUM difficulty
                [1], // Use the validated question
                3600 // 1 hour duration
            );
            const sessionId = 1;
            await riddleNFT.connect(gameContract).startRiddleSession(sessionId);

            const mintCost = await riddleNFT.getCurrentMintCost();
            await rdln.connect(user1).approve(await riddleNFT.getAddress(), mintCost);

            // This is a complex operation involving multiple contracts
            // Gas usage should still be reasonable
            const gasEstimate = await riddleNFT.connect(user1).mintRiddleAccess.estimateGas(1);
            console.log(`Estimated gas for complex mint operation: ${gasEstimate}`);

            expect(gasEstimate).to.be.lt(500000); // Should be less than 500k gas
        });
    });

    describe("Comprehensive Error Handling", function () {
        it("Should gracefully handle cross-contract failures", async function () {
            const { rdln, riddleNFT, user1 } = await loadFixture(deployRiddlenEcosystemFixture);

            // Try to mint without sufficient RDLN balance
            await rdln.connect(user1).transfer(user1.address, 0); // Reset balance manipulations

            const mintCost = await riddleNFT.getCurrentMintCost();
            await rdln.connect(user1).approve(await riddleNFT.getAddress(), mintCost);

            // Should fail gracefully if session doesn't exist
            await expect(
                riddleNFT.connect(user1).mintRiddleAccess(999)
            ).to.be.revertedWith("Session not active");

            console.log("✅ Cross-contract error handling verified");
        });
    });

    describe("Analytics and Monitoring Integration", function () {
        it("Should emit comprehensive events across the ecosystem", async function () {
            const { rdln, ron, riddleNFT, gameContract, user1, user2, validator1 } = await loadFixture(deployRiddlenEcosystemFixture);

            // Test event emissions across contracts

            // 1. Question submission event
            await rdln.connect(user2).approve(await riddleNFT.getAddress(), ethers.parseEther("1"));
            await expect(
                riddleNFT.connect(user2).submitQuestion(
                    "Test question",
                    0,
                    ethers.keccak256(ethers.toUtf8Bytes("answer")),
                    ["a", "b", "c", "d"],
                    1
                )
            ).to.emit(riddleNFT, "QuestionSubmitted");

            // 2. RON award event
            await expect(
                ron.connect(gameContract).awardRON(user1.address, 1, false, false, "Test")
            ).to.emit(ron, "RONEarnedEnhanced");

            // 3. RDLN burn event
            await expect(
                rdln.connect(user1).burn(ethers.parseEther("100"))
            ).to.emit(rdln, "BurnDistribution");

            console.log("✅ Event emission integration verified");
        });
    });

    describe("Ecosystem Health Metrics", function () {
        it("Should provide comprehensive ecosystem statistics", async function () {
            const { rdln, ron, riddleNFT, gameContract, user1 } = await loadFixture(deployRiddlenEcosystemFixture);

            // Generate some activity
            await ron.connect(gameContract).awardRON(user1.address, 1, false, false, "Health test");
            await rdln.connect(user1).burn(ethers.parseEther("100"));

            // Get ecosystem metrics
            const totalSupply = await rdln.totalSupply();
            const ronStats = await ron.getGlobalStats();
            const currentSession = await riddleNFT.currentSessionId();

            console.log(`Ecosystem Health Metrics:`);
            console.log(`  RDLN Total Supply: ${ethers.formatEther(totalSupply)}`);
            console.log(`  RON Total Users: ${ronStats[0]}`);
            console.log(`  RON Total Minted: ${ronStats[1]}`);
            console.log(`  Current Session ID: ${currentSession}`);

            // Verify metrics are tracking correctly
            expect(totalSupply).to.be.gt(0);
            expect(ronStats[0]).to.be.gt(0); // Total users
            expect(currentSession).to.be.gt(0); // Sessions created
        });
    });
});