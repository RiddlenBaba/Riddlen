const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("RiddleSubmissionManager", function () {
    let rdlnToken, ronToken, riddleNFT, submissionManager;
    let owner, admin, curator1, curator2, curator3, curator4, curator5;
    let user1, user2, user3;

    const BIENNIAL_PERIOD = 730 * 24 * 60 * 60; // 2 years in seconds
    const INITIAL_SUBMISSION_COST = ethers.parseEther("1"); // 1 RDLN
    const CURATOR_REWARD = ethers.parseEther("1"); // 1 RON
    const REQUIRED_APPROVALS = 3;

    let genesisTime;

    beforeEach(async function () {
        [owner, admin, curator1, curator2, curator3, curator4, curator5, user1, user2, user3] =
            await ethers.getSigners();

        // Deploy mock RDLN token
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        rdlnToken = await MockERC20.deploy(
            "Riddlen Token",
            "RDLN",
            ethers.parseEther("1000000000") // 1B tokens
        );

        // Deploy mock RON token with mint capability
        const MockRON = await ethers.getContractFactory("MockRON");
        ronToken = await MockRON.deploy();

        // Deploy mock RiddleNFTv3
        const MockRiddleNFT = await ethers.getContractFactory("MockRiddleNFTv3");
        genesisTime = Math.floor(Date.now() / 1000);
        riddleNFT = await MockRiddleNFT.deploy(
            await rdlnToken.getAddress(),
            await ronToken.getAddress(),
            genesisTime
        );

        // Deploy RiddleSubmissionManager
        const RiddleSubmissionManager = await ethers.getContractFactory("RiddleSubmissionManager");
        submissionManager = await upgrades.deployProxy(
            RiddleSubmissionManager,
            [
                await rdlnToken.getAddress(),
                await ronToken.getAddress(),
                await riddleNFT.getAddress(),
                admin.address,
                genesisTime
            ],
            { initializer: 'initialize' }
        );

        // Setup roles
        const CURATOR_ROLE = await submissionManager.CURATOR_ROLE();
        await submissionManager.connect(admin).grantRole(CURATOR_ROLE, curator1.address);
        await submissionManager.connect(admin).grantRole(CURATOR_ROLE, curator2.address);
        await submissionManager.connect(admin).grantRole(CURATOR_ROLE, curator3.address);
        await submissionManager.connect(admin).grantRole(CURATOR_ROLE, curator4.address);
        await submissionManager.connect(admin).grantRole(CURATOR_ROLE, curator5.address);

        // Grant CREATOR_ROLE to submissionManager on riddleNFT
        const CREATOR_ROLE = await riddleNFT.CREATOR_ROLE();
        await riddleNFT.grantRole(CREATOR_ROLE, await submissionManager.getAddress());

        // Give minter role to submission manager for RON
        const MINTER_ROLE = await ronToken.MINTER_ROLE();
        await ronToken.grantRole(MINTER_ROLE, await submissionManager.getAddress());

        // Fund users with RDLN
        await rdlnToken.transfer(user1.address, ethers.parseEther("1000"));
        await rdlnToken.transfer(user2.address, ethers.parseEther("1000"));
        await rdlnToken.transfer(user3.address, ethers.parseEther("1000"));

        // Approve submission manager
        await rdlnToken.connect(user1).approve(await submissionManager.getAddress(), ethers.MaxUint256);
        await rdlnToken.connect(user2).approve(await submissionManager.getAddress(), ethers.MaxUint256);
        await rdlnToken.connect(user3).approve(await submissionManager.getAddress(), ethers.MaxUint256);

        // Fund submission manager with RDLN for rewards
        await rdlnToken.transfer(await submissionManager.getAddress(), ethers.parseEther("100000"));
    });

    describe("Initialization", function () {
        it("Should initialize with correct genesis time", async function () {
            expect(await submissionManager.GENESIS_TIME()).to.equal(genesisTime);
        });

        it("Should initialize era costs correctly", async function () {
            // Era 0: 1 RDLN
            expect(await submissionManager.eraSubmissionCosts(0)).to.equal(ethers.parseEther("1"));

            // Era 1: 0.5 RDLN (halved)
            expect(await submissionManager.eraSubmissionCosts(1)).to.equal(ethers.parseEther("0.5"));

            // Era 2: 0.25 RDLN (halved again)
            expect(await submissionManager.eraSubmissionCosts(2)).to.equal(ethers.parseEther("0.25"));

            // Era 3: 0.125 RDLN
            expect(await submissionManager.eraSubmissionCosts(3)).to.equal(ethers.parseEther("0.125"));
        });

        it("Should grant correct roles", async function () {
            const CURATOR_ROLE = await submissionManager.CURATOR_ROLE();
            expect(await submissionManager.hasRole(CURATOR_ROLE, curator1.address)).to.be.true;
            expect(await submissionManager.hasRole(CURATOR_ROLE, curator2.address)).to.be.true;
        });
    });

    describe("Era Calculations", function () {
        it("Should return era 0 at genesis", async function () {
            expect(await submissionManager.getCurrentEra()).to.equal(0);
        });

        it("Should calculate era correctly after time passes", async function () {
            // Move forward 2 years (730 days)
            await time.increase(BIENNIAL_PERIOD);
            expect(await submissionManager.getCurrentEra()).to.equal(1);

            // Move forward another 2 years
            await time.increase(BIENNIAL_PERIOD);
            expect(await submissionManager.getCurrentEra()).to.equal(2);
        });

        it("Should return correct submission cost for current era", async function () {
            // Era 0
            expect(await submissionManager.getCurrentSubmissionCost()).to.equal(ethers.parseEther("1"));

            // Move to Era 1
            await time.increase(BIENNIAL_PERIOD);
            expect(await submissionManager.getCurrentSubmissionCost()).to.equal(ethers.parseEther("0.5"));

            // Move to Era 2
            await time.increase(BIENNIAL_PERIOD);
            expect(await submissionManager.getCurrentSubmissionCost()).to.equal(ethers.parseEther("0.25"));
        });
    });

    describe("Progressive Pricing", function () {
        it("Should calculate correct cost for user's first submission", async function () {
            // Era 0, first submission: 1 RDLN * 1 = 1 RDLN
            const cost = await submissionManager.calculateUserSubmissionCost(user1.address);
            expect(cost).to.equal(ethers.parseEther("1"));
        });

        it("Should increase cost for subsequent submissions", async function () {
            // First submission
            await submissionManager.connect(user1).submitRiddle(
                "QmTest1",
                ethers.keccak256(ethers.toUtf8Bytes("answer1")),
                "Math",
                5
            );

            // Second submission should cost 2x
            const cost = await submissionManager.calculateUserSubmissionCost(user1.address);
            expect(cost).to.equal(ethers.parseEther("2")); // 1 RDLN * 2
        });

        it("Should apply progressive pricing correctly across multiple submissions", async function () {
            // Submit 3 riddles
            await submissionManager.connect(user1).submitRiddle(
                "QmTest1",
                ethers.keccak256(ethers.toUtf8Bytes("answer1")),
                "Math",
                5
            );

            await submissionManager.connect(user1).submitRiddle(
                "QmTest2",
                ethers.keccak256(ethers.toUtf8Bytes("answer2")),
                "Logic",
                7
            );

            await submissionManager.connect(user1).submitRiddle(
                "QmTest3",
                ethers.keccak256(ethers.toUtf8Bytes("answer3")),
                "Crypto",
                9
            );

            // Fourth submission should cost 4 RDLN (1 * 4)
            const cost = await submissionManager.calculateUserSubmissionCost(user1.address);
            expect(cost).to.equal(ethers.parseEther("4"));

            // Check submission count
            expect(await submissionManager.userSubmissionCount(user1.address)).to.equal(3);
        });

        it("Should apply halved costs in Era 1", async function () {
            // Move to Era 1
            await time.increase(BIENNIAL_PERIOD);

            // First submission in Era 1: 0.5 RDLN * 1 = 0.5 RDLN
            const cost = await submissionManager.calculateUserSubmissionCost(user2.address);
            expect(cost).to.equal(ethers.parseEther("0.5"));

            // Submit and check second cost
            await submissionManager.connect(user2).submitRiddle(
                "QmTest",
                ethers.keccak256(ethers.toUtf8Bytes("answer")),
                "Math",
                5
            );

            // Second submission: 0.5 RDLN * 2 = 1 RDLN
            const cost2 = await submissionManager.calculateUserSubmissionCost(user2.address);
            expect(cost2).to.equal(ethers.parseEther("1"));
        });
    });

    describe("Riddle Submission", function () {
        it("Should allow users to submit riddles", async function () {
            const tx = await submissionManager.connect(user1).submitRiddle(
                "QmTest123",
                ethers.keccak256(ethers.toUtf8Bytes("answer123")),
                "Math",
                5
            );

            await expect(tx)
                .to.emit(submissionManager, "RiddleSubmitted")
                .withArgs(1, user1.address, "Math", 5, ethers.parseEther("1"), 0);
        });

        it("Should charge correct submission fee", async function () {
            const balanceBefore = await rdlnToken.balanceOf(user1.address);

            await submissionManager.connect(user1).submitRiddle(
                "QmTest",
                ethers.keccak256(ethers.toUtf8Bytes("answer")),
                "Logic",
                7
            );

            const balanceAfter = await rdlnToken.balanceOf(user1.address);
            expect(balanceBefore - balanceAfter).to.equal(ethers.parseEther("1"));
        });

        it("Should increment submission counter", async function () {
            await submissionManager.connect(user1).submitRiddle(
                "QmTest1",
                ethers.keccak256(ethers.toUtf8Bytes("answer1")),
                "Math",
                5
            );

            expect(await submissionManager.submissionCounter()).to.equal(1);

            await submissionManager.connect(user2).submitRiddle(
                "QmTest2",
                ethers.keccak256(ethers.toUtf8Bytes("answer2")),
                "Logic",
                8
            );

            expect(await submissionManager.submissionCounter()).to.equal(2);
        });

        it("Should reject invalid submissions", async function () {
            // Empty IPFS hash
            await expect(
                submissionManager.connect(user1).submitRiddle(
                    "",
                    ethers.keccak256(ethers.toUtf8Bytes("answer")),
                    "Math",
                    5
                )
            ).to.be.revertedWithCustomError(submissionManager, "InvalidSubmission");

            // Invalid difficulty
            await expect(
                submissionManager.connect(user1).submitRiddle(
                    "QmTest",
                    ethers.keccak256(ethers.toUtf8Bytes("answer")),
                    "Math",
                    11 // > 10
                )
            ).to.be.revertedWithCustomError(submissionManager, "InvalidSubmission");

            // Zero answer hash
            await expect(
                submissionManager.connect(user1).submitRiddle(
                    "QmTest",
                    ethers.ZeroHash,
                    "Math",
                    5
                )
            ).to.be.revertedWithCustomError(submissionManager, "InvalidSubmission");
        });
    });

    describe("Curator Voting", function () {
        let submissionId;

        beforeEach(async function () {
            // User submits a riddle
            await submissionManager.connect(user1).submitRiddle(
                "QmTest",
                ethers.keccak256(ethers.toUtf8Bytes("answer")),
                "Math",
                5
            );
            submissionId = 1;
        });

        it("Should allow curators to approve submissions", async function () {
            await expect(
                submissionManager.connect(curator1).voteOnSubmission(submissionId, true, "")
            ).to.emit(submissionManager, "CuratorVoted")
              .withArgs(submissionId, curator1.address, true);
        });

        it("Should require 3 approvals to approve submission", async function () {
            await submissionManager.connect(curator1).voteOnSubmission(submissionId, true, "");
            await submissionManager.connect(curator2).voteOnSubmission(submissionId, true, "");

            // Not approved yet
            const sub1 = await submissionManager.getSubmission(submissionId);
            expect(sub1[8]).to.equal(0); // SubmissionStatus.Pending

            // Third approval triggers approval
            await expect(
                submissionManager.connect(curator3).voteOnSubmission(submissionId, true, "")
            ).to.emit(submissionManager, "RiddleApproved")
              .withArgs(submissionId, user1.address);

            const sub2 = await submissionManager.getSubmission(submissionId);
            expect(sub2[8]).to.equal(1); // SubmissionStatus.Approved
        });

        it("Should reward curators with RON on approval", async function () {
            await submissionManager.connect(curator1).voteOnSubmission(submissionId, true, "");
            await submissionManager.connect(curator2).voteOnSubmission(submissionId, true, "");

            const balanceBefore = await ronToken.balanceOf(curator3.address);

            await submissionManager.connect(curator3).voteOnSubmission(submissionId, true, "");

            const balanceAfter = await ronToken.balanceOf(curator3.address);
            expect(balanceAfter - balanceBefore).to.equal(CURATOR_REWARD);
        });

        it("Should reject submissions with 3 rejections", async function () {
            await submissionManager.connect(curator1).voteOnSubmission(submissionId, false, "Poor quality");
            await submissionManager.connect(curator2).voteOnSubmission(submissionId, false, "Unclear wording");

            await expect(
                submissionManager.connect(curator3).voteOnSubmission(submissionId, false, "Not solvable")
            ).to.emit(submissionManager, "RiddleRejected")
              .withArgs(submissionId, "Not solvable");

            const sub = await submissionManager.getSubmission(submissionId);
            expect(sub[8]).to.equal(2); // SubmissionStatus.Rejected
        });

        it("Should burn fee on rejection", async function () {
            const contractBalanceBefore = await rdlnToken.balanceOf(await submissionManager.getAddress());

            await submissionManager.connect(curator1).voteOnSubmission(submissionId, false, "");
            await submissionManager.connect(curator2).voteOnSubmission(submissionId, false, "");
            await submissionManager.connect(curator3).voteOnSubmission(submissionId, false, "");

            // Check that burn was called (balance decreased)
            const contractBalanceAfter = await rdlnToken.balanceOf(await submissionManager.getAddress());
            expect(contractBalanceBefore - contractBalanceAfter).to.equal(ethers.parseEther("1"));
        });

        it("Should prevent double voting", async function () {
            await submissionManager.connect(curator1).voteOnSubmission(submissionId, true, "");

            await expect(
                submissionManager.connect(curator1).voteOnSubmission(submissionId, true, "")
            ).to.be.revertedWithCustomError(submissionManager, "AlreadyVoted");
        });

        it("Should track curator statistics", async function () {
            await submissionManager.connect(curator1).voteOnSubmission(submissionId, true, "");

            const stats = await submissionManager.getCuratorStats(curator1.address);
            expect(stats[0]).to.equal(1); // totalVotes
            expect(stats[1]).to.equal(0); // approvalsGiven (not reached 3 yet)
        });
    });

    describe("Promote to Live", function () {
        let submissionId;

        beforeEach(async function () {
            // Submit and approve a riddle
            await submissionManager.connect(user1).submitRiddle(
                "QmTest",
                ethers.keccak256(ethers.toUtf8Bytes("answer")),
                "Math",
                5
            );
            submissionId = 1;

            // Get 3 curator approvals
            await submissionManager.connect(curator1).voteOnSubmission(submissionId, true, "");
            await submissionManager.connect(curator2).voteOnSubmission(submissionId, true, "");
            await submissionManager.connect(curator3).voteOnSubmission(submissionId, true, "");
        });

        it("Should allow admin to promote approved riddles", async function () {
            const prizePool = ethers.parseEther("10000000"); // 10M RDLN

            await expect(
                submissionManager.connect(admin).promoteToLive(
                    submissionId,
                    1, // week 1
                    prizePool,
                    100, // maxMintRate
                    10 // winnerSlots
                )
            ).to.emit(submissionManager, "RiddlePromoted");
        });

        it("Should reward submitter with 10% of prize pool", async function () {
            const prizePool = ethers.parseEther("10000000"); // 10M RDLN
            const expectedReward = prizePool * 10n / 100n; // 1M RDLN

            const balanceBefore = await rdlnToken.balanceOf(user1.address);

            await submissionManager.connect(admin).promoteToLive(
                submissionId,
                1,
                prizePool,
                100,
                10
            );

            const balanceAfter = await rdlnToken.balanceOf(user1.address);
            expect(balanceAfter - balanceBefore).to.equal(expectedReward);
        });

        it("Should create riddle on RiddleNFTv3", async function () {
            await submissionManager.connect(admin).promoteToLive(
                submissionId,
                1,
                ethers.parseEther("10000000"),
                100,
                10
            );

            // Verify riddle was created (check if weekToRiddleId mapping was set)
            // This would require exposing the mapping in the mock contract
        });

        it("Should fail to promote non-approved riddles", async function () {
            // Submit another riddle (not approved)
            await submissionManager.connect(user2).submitRiddle(
                "QmTest2",
                ethers.keccak256(ethers.toUtf8Bytes("answer2")),
                "Logic",
                7
            );

            await expect(
                submissionManager.connect(admin).promoteToLive(
                    2, // Not approved
                    2,
                    ethers.parseEther("10000000"),
                    100,
                    10
                )
            ).to.be.revertedWithCustomError(submissionManager, "NotApproved");
        });

        it("Should update submission status to Live", async function () {
            await submissionManager.connect(admin).promoteToLive(
                submissionId,
                1,
                ethers.parseEther("10000000"),
                100,
                10
            );

            const sub = await submissionManager.getSubmission(submissionId);
            expect(sub[8]).to.equal(3); // SubmissionStatus.Live
        });

        it("Should track submitter earnings", async function () {
            const prizePool = ethers.parseEther("10000000");
            const expectedReward = prizePool * 10n / 100n;

            await submissionManager.connect(admin).promoteToLive(
                submissionId,
                1,
                prizePool,
                100,
                10
            );

            expect(await submissionManager.submitterTotalEarned(user1.address))
                .to.equal(expectedReward);
        });
    });

    describe("View Functions", function () {
        beforeEach(async function () {
            // Submit multiple riddles
            await submissionManager.connect(user1).submitRiddle(
                "QmTest1",
                ethers.keccak256(ethers.toUtf8Bytes("answer1")),
                "Math",
                5
            );

            await submissionManager.connect(user1).submitRiddle(
                "QmTest2",
                ethers.keccak256(ethers.toUtf8Bytes("answer2")),
                "Logic",
                7
            );
        });

        it("Should get submission details", async function () {
            const sub = await submissionManager.getSubmission(1);

            expect(sub[0]).to.equal(user1.address); // submitter
            expect(sub[1]).to.equal("QmTest1"); // riddleIPFSHash
            expect(sub[2]).to.equal("Math"); // category
            expect(sub[3]).to.equal(5); // difficulty
        });

        it("Should get pending submissions", async function () {
            const pending = await submissionManager.getPendingSubmissions(10, 0);
            expect(pending.length).to.equal(2);
            expect(pending[0]).to.equal(1);
            expect(pending[1]).to.equal(2);
        });

        it("Should get user statistics", async function () {
            const stats = await submissionManager.getUserStats(user1.address);

            expect(stats[0]).to.equal(2); // totalSubmissions
            expect(stats[3]).to.equal(ethers.parseEther("3")); // nextSubmissionCost (1 * 3)
        });
    });

    describe("Pause Functionality", function () {
        it("Should allow pauser to pause contract", async function () {
            const PAUSER_ROLE = await submissionManager.PAUSER_ROLE();
            await submissionManager.connect(admin).grantRole(PAUSER_ROLE, admin.address);

            await submissionManager.connect(admin).pause();
            expect(await submissionManager.paused()).to.be.true;
        });

        it("Should prevent submissions when paused", async function () {
            const PAUSER_ROLE = await submissionManager.PAUSER_ROLE();
            await submissionManager.connect(admin).grantRole(PAUSER_ROLE, admin.address);
            await submissionManager.connect(admin).pause();

            await expect(
                submissionManager.connect(user1).submitRiddle(
                    "QmTest",
                    ethers.keccak256(ethers.toUtf8Bytes("answer")),
                    "Math",
                    5
                )
            ).to.be.revertedWithCustomError(submissionManager, "EnforcedPause");
        });
    });

    describe("Gas Optimization", function () {
        it("Should use reasonable gas for submission", async function () {
            const tx = await submissionManager.connect(user1).submitRiddle(
                "QmTest",
                ethers.keccak256(ethers.toUtf8Bytes("answer")),
                "Math",
                5
            );

            const receipt = await tx.wait();
            console.log("Gas used for submission:", receipt.gasUsed.toString());

            expect(receipt.gasUsed).to.be.lt(200000);
        });

        it("Should use reasonable gas for curator vote", async function () {
            await submissionManager.connect(user1).submitRiddle(
                "QmTest",
                ethers.keccak256(ethers.toUtf8Bytes("answer")),
                "Math",
                5
            );

            const tx = await submissionManager.connect(curator1).voteOnSubmission(1, true, "");
            const receipt = await tx.wait();

            console.log("Gas used for curator vote:", receipt.gasUsed.toString());

            expect(receipt.gasUsed).to.be.lt(150000);
        });
    });
});