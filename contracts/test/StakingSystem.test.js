const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Riddlen Staking System", function () {
    let riddlenOracleNetwork;
    let owner, validator1, contributor1;

    beforeEach(async function () {
        [owner, validator1, contributor1] = await ethers.getSigners();

        // For testing staking functions, we can use a simple approach
        // Just test the pure functions directly without full deployment
        const RiddlenOracleNetwork = await ethers.getContractFactory("contracts/oracle/RiddlenOracleNetwork.sol:RiddlenOracleNetwork");

        // Deploy implementation (we'll use it as a library to test pure functions)
        riddlenOracleNetwork = await RiddlenOracleNetwork.deploy();
        await riddlenOracleNetwork.waitForDeployment();
    });

    describe("Contributor Staking Tests", function () {
        it("Should have realistic contributor stake ranges", async function () {
            const minStake = await riddlenOracleNetwork.MIN_CONTRIBUTOR_STAKE();
            const maxStake = await riddlenOracleNetwork.MAX_CONTRIBUTOR_STAKE();

            // Convert from wei to ether for readability
            const minStakeEther = ethers.formatEther(minStake);
            const maxStakeEther = ethers.formatEther(maxStake);

            console.log(`\n📝 Contributor Question Submission Stakes:`);
            console.log(`   Minimum: ${minStakeEther} RON`);
            console.log(`   Maximum: ${maxStakeEther} RON`);

            // Test expectations
            expect(minStakeEther).to.equal("1.0"); // 1 RON minimum
            expect(maxStakeEther).to.equal("100.0"); // 100 RON maximum
        });
    });

    describe("Validation Work Staking Tests", function () {
        it("Should calculate stakes based on tier and complexity", async function () {
            console.log(`\n🔍 Validation Work Stakes by Tier and Complexity:`);
            console.log(`\n| Tier      | Simple (0) | Medium (1) | Complex (2) | Critical (3) |`);
            console.log(`|-----------|------------|------------|-------------|--------------|`);

            const tiers = [0, 1, 2, 3]; // Seeker, Solver, Validator, Oracle
            const tierNames = ["Seeker   ", "Solver   ", "Validator", "Oracle   "];

            for (let tierIndex = 0; tierIndex < tiers.length; tierIndex++) {
                const tier = tiers[tierIndex];
                const tierName = tierNames[tierIndex];

                let row = `| ${tierName} |`;

                for (let complexity = 0; complexity <= 3; complexity++) {
                    const stake = await riddlenOracleNetwork.getStakeForWork(tier, complexity);
                    const stakeEther = ethers.formatEther(stake);
                    row += ` ${stakeEther.padStart(8)} RON |`;
                }

                console.log(row);
            }

            // Test specific stake calculations
            // Seeker doing simple work: 5 RON
            const seekerSimple = await riddlenOracleNetwork.getStakeForWork(0, 0);
            expect(ethers.formatEther(seekerSimple)).to.equal("5.0");

            // Oracle doing critical work: 500 RON
            const oracleCritical = await riddlenOracleNetwork.getStakeForWork(3, 3);
            expect(ethers.formatEther(oracleCritical)).to.equal("500.0");

            // Validator doing medium work: 50 RON
            const validatorMedium = await riddlenOracleNetwork.getStakeForWork(2, 1);
            expect(ethers.formatEther(validatorMedium)).to.equal("50.0");
        });

        it("Should show realistic stake progression", async function () {
            console.log(`\n📊 Stake Progression Examples:`);

            // Entry level validator
            const seekerSimple = await riddlenOracleNetwork.getStakeForWork(0, 0);
            console.log(`   👶 New Seeker (simple task): ${ethers.formatEther(seekerSimple)} RON`);

            // Mid-level validator
            const solverMedium = await riddlenOracleNetwork.getStakeForWork(1, 1);
            console.log(`   🔧 Solver (medium task): ${ethers.formatEther(solverMedium)} RON`);

            // Expert validator
            const validatorComplex = await riddlenOracleNetwork.getStakeForWork(2, 2);
            console.log(`   ⚡ Validator (complex task): ${ethers.formatEther(validatorComplex)} RON`);

            // Elite validator
            const oracleCritical = await riddlenOracleNetwork.getStakeForWork(3, 3);
            console.log(`   👑 Oracle (critical task): ${ethers.formatEther(oracleCritical)} RON`);

            console.log(`\n💡 Key Benefits:`);
            console.log(`   - Entry barrier: Only ${ethers.formatEther(seekerSimple)} RON for newcomers`);
            console.log(`   - Stakes scale with actual work complexity`);
            console.log(`   - Maximum risk for critical work: ${ethers.formatEther(oracleCritical)} RON`);
        });

        it("Should handle edge cases correctly", async function () {
            // Test invalid complexity levels default to simple
            const invalidComplexity = await riddlenOracleNetwork.getStakeForWork(1, 99);
            const simpleWork = await riddlenOracleNetwork.getStakeForWork(1, 0);

            expect(invalidComplexity).to.equal(simpleWork);
            console.log(`\n🛡️  Invalid complexity defaults to simple: ${ethers.formatEther(simpleWork)} RON`);
        });
    });

    describe("Economic Impact Analysis", function () {
        it("Should demonstrate affordable validation entry", async function () {
            console.log(`\n💰 Economic Accessibility Analysis:`);

            // Calculate cost to participate at different levels
            const seekerEntry = await riddlenOracleNetwork.getStakeForWork(0, 0);
            const solverEntry = await riddlenOracleNetwork.getStakeForWork(1, 0);

            console.log(`\n🚪 Entry Costs:`);
            console.log(`   - Question submission: 1 RON (minimum)`);
            console.log(`   - Simple validation (Seeker): ${ethers.formatEther(seekerEntry)} RON`);
            console.log(`   - Simple validation (Solver): ${ethers.formatEther(solverEntry)} RON`);

            // Compare to old system
            console.log(`\n📈 Improvement vs Old System:`);
            console.log(`   - Old contributor stake: 100-10,000 RON`);
            console.log(`   - New contributor stake: 1-100 RON (99% reduction!)`);
            console.log(`   - Old validation stake: Fixed 1,000-10,000 RON`);
            console.log(`   - New validation stake: 5-500 RON (work-based)`);
        });
    });
});