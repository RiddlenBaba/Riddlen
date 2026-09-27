const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("\n🚀 DEPLOYING RIDDLEN GAME NFT SYSTEM FOR FIRST MINT...\n");

    const [deployer, player1, player2, validator1, validator2] = await ethers.getSigners();

    console.log("👤 Deployer:", deployer.address);
    console.log("🎮 Player 1:", player1.address);
    console.log("🎮 Player 2:", player2.address);
    console.log("✅ Validator 1:", validator1.address);
    console.log("✅ Validator 2:", validator2.address);

    // 1. Deploy RON Token
    console.log("\n📦 Deploying RON Token...");
    const RONToken = await ethers.getContractFactory("contracts/reputation/RONUpgradeable.sol:RONUpgradeable");
    const ronToken = await upgrades.deployProxy(RONToken, [
        deployer.address,  // admin
        3600              // minAwardCooldown (1 hour)
    ]);
    await ronToken.waitForDeployment();
    console.log(`   ✅ RON deployed at: ${await ronToken.getAddress()}`);

    // 2. Deploy GaslessManager
    console.log("\n📦 Deploying Gasless Manager...");
    const GaslessManager = await ethers.getContractFactory("GaslessManager");
    const gaslessManager = await upgrades.deployProxy(GaslessManager, [
        await ronToken.getAddress(),
        deployer.address
    ]);
    await gaslessManager.waitForDeployment();
    console.log(`   ✅ GaslessManager deployed at: ${await gaslessManager.getAddress()}`);

    // 3. Deploy Game NFT
    console.log("\n📦 Deploying Riddlen Game NFT...");
    const RiddlenGameNFT = await ethers.getContractFactory("RiddlenGameNFT");
    const gameNFT = await upgrades.deployProxy(RiddlenGameNFT, [
        await ronToken.getAddress(),
        await gaslessManager.getAddress(),
        deployer.address
    ]);
    await gameNFT.waitForDeployment();
    console.log(`   ✅ Game NFT deployed at: ${await gameNFT.getAddress()}`);

    // 4. Setup Roles
    console.log("\n🔧 Setting up roles and permissions...");

    // Grant GAME_ROLE to Game NFT for RON rewards
    await ronToken.grantRole(await ronToken.GAME_ROLE(), await gameNFT.getAddress());
    console.log("   ✅ Game NFT can award RON");

    // Grant VALIDATOR_ROLE to validators
    await gameNFT.grantRole(await gameNFT.VALIDATOR_ROLE(), validator1.address);
    await gameNFT.grantRole(await gameNFT.VALIDATOR_ROLE(), validator2.address);
    await gameNFT.grantRole(await gameNFT.VALIDATOR_ROLE(), deployer.address);
    console.log("   ✅ Validators authorized");

    // Authorize Game NFT for gasless transactions
    await gaslessManager.authorizeContract(await gameNFT.getAddress());
    console.log("   ✅ Gasless transactions enabled");

    // Grant GAME_ROLE to deployer for demo RON awards
    await ronToken.grantRole(await ronToken.GAME_ROLE(), deployer.address);
    console.log("   ✅ Deployer can award RON for demo");

    console.log("\n🌟 SYSTEM DEPLOYMENT COMPLETE!");

    // 5. Current System Status
    console.log("\n📊 SYSTEM STATUS:");
    const currentWeek = await gameNFT.getCurrentWeek();
    const currentEra = await gameNFT.getCurrentEra();
    console.log(`   📅 Current Week: ${currentWeek}`);
    console.log(`   🌟 Current Era: ${currentEra}`);
    console.log(`   🎮 Total Games Generated: ${await gameNFT.totalGamesGenerated()}`);

    console.log("\n🎮 READY TO CREATE YOUR FIRST GAME NFT!");
    console.log("======================================");

    // 6. Create Content Submissions
    console.log("\n📝 STEP 1: Creating game content submissions...");

    const submissions = [
        {
            type: 0, // RIDDLE
            content: "QmRiddle1_WhatHas4Legs",
            solution: "QmSolution1_Chair",
            submitter: player1
        },
        {
            type: 1, // LOGIC_PUZZLE
            content: "QmLogic1_ThreeSwitches",
            solution: "QmSolution1_MiddleSwitch",
            submitter: player2
        },
        {
            type: 0, // RIDDLE
            content: "QmRiddle2_IAmTallWhenYoung",
            solution: "QmSolution2_Candle",
            submitter: player1
        },
        {
            type: 2, // MATH_CHALLENGE
            content: "QmMath1_Fibonacci",
            solution: "QmSolution1_FibSequence",
            submitter: player2
        },
        {
            type: 0, // RIDDLE
            content: "QmRiddle3_TheMoreYouTake",
            solution: "QmSolution3_Footsteps",
            submitter: player1
        }
    ];

    // Submit content
    for (let i = 0; i < submissions.length; i++) {
        const sub = submissions[i];
        await gameNFT.connect(sub.submitter).submitGameContent(
            sub.type,
            sub.content,
            sub.solution
        );
        console.log(`   ✅ Submission ${i}: ${sub.content} (${sub.submitter === player1 ? 'Player1' : 'Player2'})`);
    }

    console.log("\n✅ STEP 2: Validating submissions...");

    // Validate all submissions (need 3 validators each)
    for (let i = 0; i < submissions.length; i++) {
        await gameNFT.connect(validator1).validateSubmission(i, true, 85);
        await gameNFT.connect(validator2).validateSubmission(i, true, 90);
        await gameNFT.connect(deployer).validateSubmission(i, true, 88);
        console.log(`   ✅ Submission ${i} validated (Score: ~87.7)`);
    }

    // Add more submissions to reach minimum (need 10 total)
    console.log("\n📝 Adding more submissions to reach minimum threshold...");

    // Use different accounts to avoid submission limits
    const moreSubmitters = [deployer, validator1, validator2];

    for (let i = 5; i < 10; i++) {
        const submitter = moreSubmitters[(i - 5) % moreSubmitters.length];
        await gameNFT.connect(submitter).submitGameContent(
            0, // RIDDLE
            `QmRiddle${i}_AutoGenerated`,
            `QmSolution${i}_AutoGenerated`
        );

        // Validate each
        await gameNFT.connect(validator1).validateSubmission(i, true, 80);
        await gameNFT.connect(validator2).validateSubmission(i, true, 85);
        await gameNFT.connect(deployer).validateSubmission(i, true, 83);
        console.log(`   ✅ Auto-submission ${i} created and validated`);
    }

    console.log("\n🎮 STEP 3: Generating Weekly Game NFT...");

    // Check if we can generate
    const canGenerate = await gameNFT.canGenerateWeeklyNFT();
    console.log(`   🔍 Can generate NFT: ${canGenerate}`);

    if (canGenerate) {
        // Force generation
        await gameNFT.forceGenerateWeeklyNFT();
        console.log("   🎉 WEEKLY GAME NFT GENERATED!");

        // Check the minted NFT
        const totalSupply = await gameNFT.totalSupply();
        console.log(`   🎯 Total NFTs: ${totalSupply}`);

        if (totalSupply > 0) {
            const gameData = await gameNFT.gameNFTs(1);
            console.log(`   🎮 Game Type: ${gameData.primaryType} (0=RIDDLE, 1=LOGIC, 2=MATH)`);
            console.log(`   ⚡ Difficulty: ${gameData.difficulty} (0=BEGINNER, 1=INTERMEDIATE, etc.)`);
            console.log(`   🧩 Total Challenges: ${gameData.totalChallenges}`);
            console.log(`   📅 Week Number: ${gameData.weekNumber}`);
            console.log(`   🌟 Era: ${gameData.era}`);
            console.log(`   ⏰ Expires: ${new Date(Number(gameData.expiryTime) * 1000).toLocaleDateString()}`);
        }
    }

    console.log("\n🏆 STEP 4: Demo gameplay - solving a challenge...");

    // Give player1 some RON for rewards
    await ronToken.awardRON(
        player1.address,
        0, // EASY difficulty
        false, false,
        "Initial RON for gameplay demo"
    );

    const balanceBefore = await ronToken.balanceOf(player1.address);
    console.log(`   💰 Player1 RON before: ${ethers.formatEther(balanceBefore)} RON`);

    try {
        // Attempt to solve first challenge
        await gameNFT.connect(player1).solveChallengeUse(
            1, // tokenId
            0, // first challenge
            "QmPlayerSolutionDemo"
        );

        const balanceAfter = await ronToken.balanceOf(player1.address);
        console.log(`   💰 Player1 RON after: ${ethers.formatEther(balanceAfter)} RON`);
        console.log(`   🎉 Challenge solved! RON reward earned!`);

    } catch (error) {
        if (error.message.includes("GameExpired")) {
            console.log(`   ⏰ Game expired - but that's normal for this demo!`);
        } else {
            console.log(`   ⚠️ Challenge solving error: ${error.message}`);
        }
    }

    // Final stats
    console.log("\n📊 FINAL SYSTEM STATISTICS:");
    console.log("================================");

    const weekStats = await gameNFT.getWeeklyStats(currentWeek);
    const playerStats = await gameNFT.getPlayerStats(player1.address);

    console.log(`📅 Week ${currentWeek} Stats:`);
    console.log(`   📝 Total Submissions: ${weekStats.totalSubmissions}`);
    console.log(`   ✅ Approved Submissions: ${weekStats.approvedSubmissions}`);
    console.log(`   🎯 NFT Generated: ${weekStats.nftGenerated}`);

    console.log(`\n🎮 Player1 Stats:`);
    console.log(`   🧩 Challenges Solved: ${playerStats.challengesSolved}`);
    console.log(`   🎯 Games Played: ${playerStats.gamesPlayed}`);
    console.log(`   💰 Total RON Earned: ${ethers.formatEther(playerStats.totalRONEarned)} RON`);

    console.log("\n🎉 YOUR FIRST RIDDLEN GAME NFT IS LIVE! 🎉");
    console.log("==========================================");
    console.log(`🎮 Game NFT Contract: ${await gameNFT.getAddress()}`);
    console.log(`🏆 RON Token Contract: ${await ronToken.getAddress()}`);
    console.log(`⚡ Gasless Manager: ${await gaslessManager.getAddress()}`);
    console.log("\n✨ The Riddlen wheel is spinning with your first game! ✨\n");

    return {
        gameNFT: await gameNFT.getAddress(),
        ronToken: await ronToken.getAddress(),
        gaslessManager: await gaslessManager.getAddress()
    };
}

main()
    .then((contracts) => {
        console.log("🎊 Deployment completed successfully!");
        console.log("Contract addresses:", contracts);
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });