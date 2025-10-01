const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Riddlen Ecosystem Integration - Airdrop & Oracle", function () {
    let rdlnToken, ronToken, oracleNetwork, airdrop;
    let admin, treasury, buyback, bonusPool, validator1, validator2, validator3, requester;

    const INITIAL_RDLN_SUPPLY = ethers.parseEther("1000000000"); // 1B RDLN
    const AIRDROP_ALLOCATION = ethers.parseEther("100000000"); // 100M RDLN for airdrop
    const ORACLE_FUNDING = ethers.parseEther("50000000"); // 50M RDLN for oracle rewards

    beforeEach(async function () {
        [admin, treasury, buyback, bonusPool, validator1, validator2, validator3, requester] =
            await ethers.getSigners();

        // 1. Deploy RDLN Token (using MockERC20 for simpler testing)
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        rdlnToken = await MockERC20.deploy(
            "Riddlen Token",
            "RDLN",
            INITIAL_RDLN_SUPPLY
        );
        await rdlnToken.waitForDeployment();

        // 2. Deploy RON Token (using MockRON for simpler testing)
        const MockRON = await ethers.getContractFactory("MockRON");
        ronToken = await MockRON.deploy();
        await ronToken.waitForDeployment();

        // 3. Deploy Oracle Network
        const RiddlenOracleNetwork = await ethers.getContractFactory("RiddlenOracleNetwork");
        oracleNetwork = await upgrades.deployProxy(RiddlenOracleNetwork, [
            await rdlnToken.getAddress(),
            await ronToken.getAddress(),
            treasury.address,
            buyback.address,
            bonusPool.address,
            admin.address
        ], { initializer: 'initialize' });

        // 4. Deploy Airdrop Contract
        const RiddlenAirdrop = await ethers.getContractFactory("RiddlenAirdrop");
        airdrop = await upgrades.deployProxy(RiddlenAirdrop, [
            await rdlnToken.getAddress(),
            await ronToken.getAddress(),
            await oracleNetwork.getAddress(),
            admin.address
        ], { initializer: 'initialize' });

        // 5. Fund contracts
        // Note: RDLN distributes tokens to multiple wallets on deployment
        // We need to gather tokens to fund the contracts
        const adminBalance = await rdlnToken.balanceOf(admin.address);
        console.log(`Admin RDLN balance: ${ethers.formatEther(adminBalance)}`);

        await rdlnToken.connect(admin).transfer(await airdrop.getAddress(), AIRDROP_ALLOCATION);
        await rdlnToken.connect(admin).transfer(await oracleNetwork.getAddress(), ORACLE_FUNDING);

        // 6. Setup roles
        const OPERATOR_ROLE = await airdrop.OPERATOR_ROLE();
        await airdrop.connect(admin).grantRole(OPERATOR_ROLE, admin.address);

        // 7. Give validators RON tokens (need 100+ for Bronze tier, plus extra for staking)
        const ronAmount = ethers.parseEther("250"); // 250 RON in wei (enough for multiple validations)
        await ronToken.setBalance(validator1.address, ronAmount);
        await ronToken.setBalance(validator2.address, ronAmount);
        await ronToken.setBalance(validator3.address, ronAmount);
    });

    describe("Full User Journey: Airdrop → Oracle → More Airdrop", function () {
        it("Should allow user to claim all 3 airdrop phases by completing validations", async function () {
            console.log("\n=== PHASE 1: SOCIAL PROOF AIRDROP ===");

            // Activate Phase 1
            await airdrop.connect(admin).setPhaseActive(1, true);

            // User submits social proof
            await airdrop.connect(validator1).submitSocialProof("validator1_twitter", "validator1_tg");

            // Admin verifies social proof
            await airdrop.connect(admin).verifySocialProof(validator1.address, true, true, true);

            // User claims Phase 1
            await airdrop.connect(validator1).claimPhase1();

            let totalClaimed = await airdrop.getTotalClaimed(validator1.address);
            console.log(`✅ Phase 1 claimed: ${ethers.formatEther(totalClaimed)} RDLN`);
            expect(totalClaimed).to.equal(ethers.parseEther("5000")); // 5K RDLN

            // Verify user has RDLN tokens
            let userRDLN = await rdlnToken.balanceOf(validator1.address);
            expect(userRDLN).to.equal(ethers.parseEther("5000"));

            console.log("\n=== EARNING RON THROUGH ORACLE VALIDATIONS ===");

            // Requester creates validation request
            const rewardPool = ethers.parseEther("10000"); // 10K RDLN
            const protocolFee = (rewardPool * BigInt(1000)) / BigInt(10000); // 10% fee
            const totalCost = rewardPool + protocolFee;

            // Give requester RDLN and approve
            await rdlnToken.connect(admin).transfer(requester.address, totalCost);
            await rdlnToken.connect(requester).approve(await oracleNetwork.getAddress(), totalCost);

            // Create validation request
            const dataHash = ethers.keccak256(ethers.toUtf8Bytes("test_data"));
            const question = "Is this data valid?";
            const category = "Data Verification";

            await oracleNetwork.connect(requester).createValidationRequest(
                dataHash,
                question,
                category,
                3, // requiredValidators
                2, // consensusThreshold (2 of 3)
                rewardPool,
                3600, // 1 hour deadline
                0 // Bronze tier minimum
            );

            console.log("✅ Validation request created");

            // Validators submit validations
            const correctAnswer = ethers.keccak256(ethers.toUtf8Bytes("YES"));

            // Validator 1 submits
            const ronStake = ethers.parseEther("10"); // 10 RON
            await oracleNetwork.connect(validator1).submitValidation(
                1, // requestId
                correctAnswer,
                "ipfs://proof1",
                ronStake
            );
            console.log("✅ Validator 1 submitted validation");

            // Validator 2 submits
            await oracleNetwork.connect(validator2).submitValidation(
                1,
                correctAnswer,
                "ipfs://proof2",
                ronStake
            );
            console.log("✅ Validator 2 submitted validation");

            // Validator 3 submits
            await oracleNetwork.connect(validator3).submitValidation(
                1,
                correctAnswer,
                "ipfs://proof3",
                ronStake
            );
            console.log("✅ Validator 3 submitted validation - Consensus reached!");

            // Check validator profiles
            let [tier, totalValidations, correctValidations, accuracy, totalEarned] =
                await oracleNetwork.getValidatorProfile(validator1.address);

            console.log(`\nValidator 1 Stats:`);
            console.log(`  Total Validations: ${totalValidations}`);
            console.log(`  Correct: ${correctValidations}`);
            console.log(`  RDLN Earned: ${ethers.formatEther(totalEarned)} RDLN`);

            expect(totalValidations).to.be.gt(0);
            expect(totalEarned).to.be.gt(0);

            console.log("\n=== PHASE 2: RON REPUTATION AIRDROP ===");

            // Give validators more RON tokens for Phase 2 snapshot (Tier 2 = 5000 RON)
            await ronToken.setBalance(validator1.address, 5000);

            // Activate Phase 2 and take snapshot
            await airdrop.connect(admin).setPhaseActive(2, true);
            await airdrop.connect(admin).takeRONSnapshot([validator1.address]);

            // Claim Phase 2
            await airdrop.connect(validator1).claimPhase2();

            totalClaimed = await airdrop.getTotalClaimed(validator1.address);
            console.log(`✅ Phase 1 + Phase 2 claimed: ${ethers.formatEther(totalClaimed)} RDLN`);
            expect(totalClaimed).to.equal(ethers.parseEther("8000")); // 5K + 3K = 8K

            console.log("\n=== COMPLETING MORE VALIDATIONS ===");

            // Create more validation requests for validator to complete
            for (let i = 0; i < 2; i++) {
                // Advance time to avoid cooldown
                await ethers.provider.send("evm_increaseTime", [301]); // 5 min + 1 sec
                await ethers.provider.send("evm_mine");

                await rdlnToken.connect(admin).transfer(requester.address, totalCost);
                await rdlnToken.connect(requester).approve(await oracleNetwork.getAddress(), totalCost);

                await oracleNetwork.connect(requester).createValidationRequest(
                    ethers.keccak256(ethers.toUtf8Bytes(`test_data_${i}`)),
                    `Validation ${i + 2}`,
                    category,
                    3,
                    2,
                    rewardPool,
                    3600,
                    0
                );

                const requestId = i + 2;

                await oracleNetwork.connect(validator1).submitValidation(
                    requestId,
                    correctAnswer,
                    `ipfs://proof_${requestId}_1`,
                    ronStake
                );

                await oracleNetwork.connect(validator2).submitValidation(
                    requestId,
                    correctAnswer,
                    `ipfs://proof_${requestId}_2`,
                    ronStake
                );

                await oracleNetwork.connect(validator3).submitValidation(
                    requestId,
                    correctAnswer,
                    `ipfs://proof_${requestId}_3`,
                    ronStake
                );
            }

            [tier, totalValidations, correctValidations, accuracy, totalEarned] =
                await oracleNetwork.getValidatorProfile(validator1.address);

            console.log(`\nValidator 1 Updated Stats:`);
            console.log(`  Total Validations: ${totalValidations}`);
            console.log(`  RDLN Earned from Oracle: ${ethers.formatEther(totalEarned)} RDLN`);

            expect(totalValidations).to.equal(3); // Completed 3 validations

            console.log("\n=== PHASE 3: VALIDATION-BASED AIRDROP ===");

            // Activate Phase 3
            await airdrop.connect(admin).setPhaseActive(3, true);

            // Check Phase 3 eligibility
            let [eligible, totalVals, newVals, estimatedReward, phase3Claimed, remaining] =
                await airdrop.getPhase3Status(validator1.address);

            console.log(`Phase 3 Status:`);
            console.log(`  Eligible: ${eligible}`);
            console.log(`  Total Validations: ${totalVals}`);
            console.log(`  New Validations: ${newVals}`);
            console.log(`  Estimated Reward: ${ethers.formatEther(estimatedReward)} RDLN`);

            expect(eligible).to.be.true;
            expect(totalVals).to.equal(3);

            // Claim Phase 3
            await airdrop.connect(validator1).claimPhase3();

            totalClaimed = await airdrop.getTotalClaimed(validator1.address);
            console.log(`✅ Total claimed across all phases: ${ethers.formatEther(totalClaimed)} RDLN`);

            // 5K (Phase1) + 3K (Phase2) + 1.5K (Phase3: 3 validations * 500) = 9.5K
            expect(totalClaimed).to.equal(ethers.parseEther("9500"));

            // Check remaining claimable
            const remainingClaimable = await airdrop.getRemainingClaimable(validator1.address);
            console.log(`Remaining claimable: ${ethers.formatEther(remainingClaimable)} RDLN`);
            expect(remainingClaimable).to.equal(ethers.parseEther("5500")); // 15K - 9.5K

            console.log("\n=== COMPLETING MORE VALIDATIONS FOR BONUS ===");

            // Complete 7 more validations to get 10+ total for bonus
            for (let i = 0; i < 7; i++) {
                // Advance time to avoid cooldown
                await ethers.provider.send("evm_increaseTime", [301]); // 5 min + 1 sec
                await ethers.provider.send("evm_mine");

                await rdlnToken.connect(admin).transfer(requester.address, totalCost);
                await rdlnToken.connect(requester).approve(await oracleNetwork.getAddress(), totalCost);

                await oracleNetwork.connect(requester).createValidationRequest(
                    ethers.keccak256(ethers.toUtf8Bytes(`bonus_data_${i}`)),
                    `Bonus Validation ${i + 1}`,
                    category,
                    3,
                    2,
                    rewardPool,
                    3600,
                    0
                );

                const requestId = i + 4;

                await oracleNetwork.connect(validator1).submitValidation(
                    requestId,
                    correctAnswer,
                    `ipfs://bonus_${requestId}_1`,
                    ronStake
                );

                await oracleNetwork.connect(validator2).submitValidation(
                    requestId,
                    correctAnswer,
                    `ipfs://bonus_${requestId}_2`,
                    ronStake
                );

                await oracleNetwork.connect(validator3).submitValidation(
                    requestId,
                    correctAnswer,
                    `ipfs://bonus_${requestId}_3`,
                    ronStake
                );
            }

            [tier, totalValidations] = await oracleNetwork.getValidatorProfile(validator1.address);
            console.log(`Total validations now: ${totalValidations}`);
            expect(totalValidations).to.equal(10); // 3 + 7 = 10 validations

            // Claim Phase 3 again with bonus
            [eligible, , newVals, estimatedReward] = await airdrop.getPhase3Status(validator1.address);
            console.log(`\nPhase 3 Second Claim:`);
            console.log(`  New Validations: ${newVals}`);
            console.log(`  Estimated Reward (with 25% bonus): ${ethers.formatEther(estimatedReward)} RDLN`);

            await airdrop.connect(validator1).claimPhase3();

            totalClaimed = await airdrop.getTotalClaimed(validator1.address);
            console.log(`✅ Final total claimed: ${ethers.formatEther(totalClaimed)} RDLN`);

            // 9.5K + (7 * 500 = 3500 + 25% bonus = 4375) but capped at Phase3 max of 5K
            // So: 9.5K + (5K - 1.5K already claimed) = 9.5K + 3.5K = 13K
            expect(totalClaimed).to.be.lte(ethers.parseEther("15000")); // Global max

            const finalRemaining = await airdrop.getRemainingClaimable(validator1.address);
            console.log(`Final remaining claimable: ${ethers.formatEther(finalRemaining)} RDLN`);

            console.log("\n=== ECOSYSTEM STATS ===");

            const [participants, remainingSlots, phase3Distributed, airdropBalance] =
                await airdrop.getAirdropStats();
            console.log(`Airdrop Contract:`);
            console.log(`  Phase 1 Participants: ${participants}`);
            console.log(`  Phase 3 Distributed: ${ethers.formatEther(phase3Distributed)} RDLN`);
            console.log(`  Remaining Balance: ${ethers.formatEther(airdropBalance)} RDLN`);

            const [totalRequests, totalConsensus, totalRewards, protocolFees, slashed, consensusRate] =
                await oracleNetwork.getNetworkStats();
            console.log(`\nOracle Network:`);
            console.log(`  Total Requests: ${totalRequests}`);
            console.log(`  Consensus Reached: ${totalConsensus}`);
            console.log(`  Total Rewards: ${ethers.formatEther(totalRewards)} RDLN`);
            console.log(`  Protocol Fees: ${ethers.formatEther(protocolFees)} RDLN`);
            console.log(`  Consensus Rate: ${consensusRate / 100}%`);

            console.log("\n✅ FULL ECOSYSTEM INTEGRATION SUCCESSFUL!");
        });
    });

    describe("Economic Flow: RDLN → Oracle → Validators → Airdrop", function () {
        it("Should demonstrate complete token flow through ecosystem", async function () {
            // Track token movements
            const initialAdminRDLN = await rdlnToken.balanceOf(admin.address);

            // 1. Admin funds contracts
            console.log("\n=== TOKEN DISTRIBUTION ===");
            console.log(`Admin initial: ${ethers.formatEther(initialAdminRDLN)} RDLN`);
            console.log(`Airdrop funded: ${ethers.formatEther(AIRDROP_ALLOCATION)} RDLN`);
            console.log(`Oracle funded: ${ethers.formatEther(ORACLE_FUNDING)} RDLN`);

            // 2. Requester pays for validation
            const rewardPool = ethers.parseEther("5000");
            const protocolFee = (rewardPool * BigInt(1000)) / BigInt(10000);
            const totalCost = rewardPool + protocolFee;

            await rdlnToken.connect(admin).transfer(requester.address, totalCost);
            await rdlnToken.connect(requester).approve(await oracleNetwork.getAddress(), totalCost);

            const requesterBefore = await rdlnToken.balanceOf(requester.address);

            await oracleNetwork.connect(requester).createValidationRequest(
                ethers.keccak256(ethers.toUtf8Bytes("economic_test")),
                "Economic flow test",
                "Test",
                3, 2, rewardPool, 3600, 0
            );

            const requesterAfter = await rdlnToken.balanceOf(requester.address);
            console.log(`\nRequester paid: ${ethers.formatEther(requesterBefore - requesterAfter)} RDLN`);

            // 3. Validators earn from oracle
            const correctAnswer = ethers.keccak256(ethers.toUtf8Bytes("YES"));
            const ronStake = ethers.parseEther("10");

            await oracleNetwork.connect(validator1).submitValidation(1, correctAnswer, "ipfs://1", ronStake);
            await oracleNetwork.connect(validator2).submitValidation(1, correctAnswer, "ipfs://2", ronStake);
            await oracleNetwork.connect(validator3).submitValidation(1, correctAnswer, "ipfs://3", ronStake);

            const [, , , , earned1] = await oracleNetwork.getValidatorProfile(validator1.address);
            console.log(`Validator earned from Oracle: ${ethers.formatEther(earned1)} RDLN`);

            // 4. Protocol fees collected
            const treasuryBalance = await rdlnToken.balanceOf(treasury.address);
            const buybackBalance = await rdlnToken.balanceOf(buyback.address);
            const bonusBalance = await rdlnToken.balanceOf(bonusPool.address);

            console.log(`\nProtocol Fees:`);
            console.log(`  Treasury: ${ethers.formatEther(treasuryBalance)} RDLN`);
            console.log(`  Buyback: ${ethers.formatEther(buybackBalance)} RDLN`);
            console.log(`  Bonus Pool: ${ethers.formatEther(bonusBalance)} RDLN`);

            const totalFees = treasuryBalance + buybackBalance + bonusBalance;
            expect(totalFees).to.equal(protocolFee);

            // 5. Validator claims airdrop (funded by oracle participation)
            await airdrop.connect(admin).setPhaseActive(3, true);
            await airdrop.connect(validator1).claimPhase3();

            const airdropClaimed = await airdrop.phase3TotalClaimed(validator1.address);
            console.log(`\nValidator claimed from Airdrop: ${ethers.formatEther(airdropClaimed)} RDLN`);

            const totalValidatorRDLN = await rdlnToken.balanceOf(validator1.address);
            console.log(`Total Validator RDLN: ${ethers.formatEther(totalValidatorRDLN)} RDLN`);
            console.log(`  From Oracle: ${ethers.formatEther(earned1)} RDLN`);
            console.log(`  From Airdrop: ${ethers.formatEther(airdropClaimed)} RDLN`);

            expect(totalValidatorRDLN).to.equal(earned1 + airdropClaimed);

            console.log("\n✅ ECONOMIC FLOW VERIFIED");
        });
    });
});
