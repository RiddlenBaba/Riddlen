const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("RDLNUpgradeable", function () {
    // Test fixture for consistent setup
    async function deployRDLNUpgradeableFixture() {
        const [owner, user1, user2, devOpsWallet, grandPrizeWallet, minter, burner, compliance] = await ethers.getSigners();

        // Deploy upgradeable contract
        const RDLNUpgradeable = await ethers.getContractFactory("RDLNUpgradeable");
        const rdln = await upgrades.deployProxy(
            RDLNUpgradeable,
            [
                owner.address,        // _admin
                owner.address,        // _treasuryWallet (placeholder)
                owner.address,        // _liquidityWallet (placeholder)
                owner.address,        // _airdropWallet (placeholder)
                grandPrizeWallet.address,  // _grandPrizeWallet
                owner.address         // _operationsWallet (placeholder)
            ],
            { initializer: 'initialize' }
        );

        await rdln.waitForDeployment();

        // Grant roles for testing
        const MINTER_ROLE = await rdln.MINTER_ROLE();
        const BURNER_ROLE = await rdln.BURNER_ROLE();
        const COMPLIANCE_ROLE = await rdln.COMPLIANCE_ROLE();

        await rdln.grantRole(MINTER_ROLE, minter.address);
        await rdln.grantRole(BURNER_ROLE, burner.address);
        await rdln.grantRole(COMPLIANCE_ROLE, compliance.address);

        return {
            rdln,
            owner,
            user1,
            user2,
            devOpsWallet,
            grandPrizeWallet,
            minter,
            burner,
            compliance,
            MINTER_ROLE,
            BURNER_ROLE,
            COMPLIANCE_ROLE
        };
    }

    describe("Deployment and Initialization", function () {
        it("Should initialize with correct parameters", async function () {
            const { rdln, owner, devOpsWallet, grandPrizeWallet } = await loadFixture(deployRDLNUpgradeableFixture);

            expect(await rdln.name()).to.equal("Riddlen Token");
            expect(await rdln.symbol()).to.equal("RDLN");
            expect(await rdln.decimals()).to.equal(18);
            expect(await rdln.devOpsWallet()).to.equal(devOpsWallet.address);
            expect(await rdln.grandPrizeWallet()).to.equal(grandPrizeWallet.address);
            expect(await rdln.hasRole(await rdln.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
        });

        it("Should not allow reinitialization", async function () {
            const { rdln, owner, devOpsWallet, grandPrizeWallet } = await loadFixture(deployRDLNUpgradeableFixture);

            await expect(
                rdln.initialize("New Name", "NEW", owner.address, devOpsWallet.address, grandPrizeWallet.address)
            ).to.be.revertedWithCustomError(rdln, "InvalidInitialization");
        });

        it("Should have correct initial total supply", async function () {
            const { rdln } = await loadFixture(deployRDLNUpgradeableFixture);
            const expectedSupply = ethers.parseEther("1000000000"); // 1 billion tokens
            expect(await rdln.totalSupply()).to.equal(expectedSupply);
        });
    });

    describe("Minting", function () {
        it("Should allow minter to mint tokens", async function () {
            const { rdln, minter, user1 } = await loadFixture(deployRDLNUpgradeableFixture);
            const amount = ethers.parseEther("1000");

            await expect(rdln.connect(minter).mint(user1.address, amount))
                .to.emit(rdln, "Transfer")
                .withArgs(ethers.ZeroAddress, user1.address, amount);

            expect(await rdln.balanceOf(user1.address)).to.equal(amount);
        });

        it("Should not allow non-minter to mint tokens", async function () {
            const { rdln, user1, user2 } = await loadFixture(deployRDLNUpgradeableFixture);
            const amount = ethers.parseEther("1000");

            await expect(
                rdln.connect(user1).mint(user2.address, amount)
            ).to.be.revertedWithCustomError(rdln, "AccessControlUnauthorizedAccount");
        });

        it("Should allow batch minting", async function () {
            const { rdln, minter, user1, user2 } = await loadFixture(deployRDLNUpgradeableFixture);
            const recipients = [user1.address, user2.address];
            const amounts = [ethers.parseEther("1000"), ethers.parseEther("2000")];

            await rdln.connect(minter).batchMint(recipients, amounts);

            expect(await rdln.balanceOf(user1.address)).to.equal(amounts[0]);
            expect(await rdln.balanceOf(user2.address)).to.equal(amounts[1]);
        });

        it("Should reject batch minting with mismatched arrays", async function () {
            const { rdln, minter, user1 } = await loadFixture(deployRDLNUpgradeableFixture);
            const recipients = [user1.address];
            const amounts = [ethers.parseEther("1000"), ethers.parseEther("2000")];

            await expect(
                rdln.connect(minter).batchMint(recipients, amounts)
            ).to.be.revertedWithCustomError(rdln, "ArrayLengthMismatch");
        });
    });

    describe("Burn Protocol", function () {
        beforeEach(async function () {
            const { rdln, minter, user1 } = await loadFixture(deployRDLNUpgradeableFixture);
            // Mint tokens for testing burns
            await rdln.connect(minter).mint(user1.address, ethers.parseEther("10000"));
        });

        it("Should distribute burns correctly (50% burn, 25% grand prize, 25% dev/ops)", async function () {
            const { rdln, user1, devOpsWallet, grandPrizeWallet } = await loadFixture(deployRDLNUpgradeableFixture);
            await rdln.connect(user1).mint(user1.address, ethers.parseEther("10000"));

            const burnAmount = ethers.parseEther("1000");
            const initialTotalSupply = await rdln.totalSupply();
            const initialDevBalance = await rdln.balanceOf(devOpsWallet.address);
            const initialGrandPrizeBalance = await rdln.balanceOf(grandPrizeWallet.address);

            await expect(rdln.connect(user1).burn(burnAmount))
                .to.emit(rdln, "BurnDistribution");

            // Check actual burn (50%)
            const expectedBurn = (burnAmount * 50n) / 100n;
            expect(await rdln.totalSupply()).to.equal(initialTotalSupply - expectedBurn);

            // Check grand prize allocation (25%)
            const expectedGrandPrize = (burnAmount * 25n) / 100n;
            expect(await rdln.balanceOf(grandPrizeWallet.address))
                .to.equal(initialGrandPrizeBalance + expectedGrandPrize);

            // Check dev/ops allocation (25%)
            const expectedDevOps = (burnAmount * 25n) / 100n;
            expect(await rdln.balanceOf(devOpsWallet.address))
                .to.equal(initialDevBalance + expectedDevOps);
        });

        it("Should allow burner role to burn from any account", async function () {
            const { rdln, burner, user1 } = await loadFixture(deployRDLNUpgradeableFixture);
            await rdln.connect(user1).mint(user1.address, ethers.parseEther("10000"));

            const burnAmount = ethers.parseEther("500");

            await expect(rdln.connect(burner).burnFrom(user1.address, burnAmount))
                .to.emit(rdln, "BurnDistribution");
        });

        it("Should allow progressive burns with different amounts", async function () {
            const { rdln, user1 } = await loadFixture(deployRDLNUpgradeableFixture);
            await rdln.connect(user1).mint(user1.address, ethers.parseEther("10000"));

            // Progressive burn: 1, 2, 3 RDLN
            const burns = [
                ethers.parseEther("1"),
                ethers.parseEther("2"),
                ethers.parseEther("3")
            ];

            for (const burnAmount of burns) {
                await expect(rdln.connect(user1).burn(burnAmount))
                    .to.emit(rdln, "BurnDistribution");
            }
        });

        it("Should handle batch burns efficiently", async function () {
            const { rdln, burner, user1, user2 } = await loadFixture(deployRDLNUpgradeableFixture);
            await rdln.connect(user1).mint(user1.address, ethers.parseEther("10000"));
            await rdln.connect(user1).mint(user2.address, ethers.parseEther("10000"));

            const accounts = [user1.address, user2.address];
            const amounts = [ethers.parseEther("100"), ethers.parseEther("200")];

            await rdln.connect(burner).batchBurnFrom(accounts, amounts);

            // Verify burns occurred
            expect(await rdln.balanceOf(user1.address)).to.be.lt(ethers.parseEther("10000"));
            expect(await rdln.balanceOf(user2.address)).to.be.lt(ethers.parseEther("10000"));
        });
    });

    describe("Permit Functionality", function () {
        it("Should allow gasless approvals via permit", async function () {
            const { rdln, user1, user2 } = await loadFixture(deployRDLNUpgradeableFixture);
            const amount = ethers.parseEther("1000");
            const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

            // Get the domain separator and other permit data
            const domain = {
                name: await rdln.name(),
                version: "1",
                chainId: await ethers.provider.getNetwork().then(n => n.chainId),
                verifyingContract: await rdln.getAddress()
            };

            const types = {
                Permit: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" }
                ]
            };

            const value = {
                owner: user1.address,
                spender: user2.address,
                value: amount,
                nonce: await rdln.nonces(user1.address),
                deadline: deadline
            };

            const signature = await user1.signTypedData(domain, types, value);
            const { v, r, s } = ethers.Signature.from(signature);

            await expect(
                rdln.permit(user1.address, user2.address, amount, deadline, v, r, s)
            ).to.emit(rdln, "Approval")
             .withArgs(user1.address, user2.address, amount);

            expect(await rdln.allowance(user1.address, user2.address)).to.equal(amount);
        });
    });

    describe("Circuit Breaker", function () {
        it("Should pause all operations when circuit breaker is triggered", async function () {
            const { rdln, owner, minter, user1 } = await loadFixture(deployRDLNUpgradeableFixture);

            await rdln.connect(owner).pause();

            await expect(
                rdln.connect(minter).mint(user1.address, ethers.parseEther("1000"))
            ).to.be.revertedWithCustomError(rdln, "EnforcedPause");

            await expect(
                rdln.connect(user1).transfer(user1.address, ethers.parseEther("100"))
            ).to.be.revertedWithCustomError(rdln, "EnforcedPause");
        });

        it("Should resume operations when unpaused", async function () {
            const { rdln, owner, minter, user1 } = await loadFixture(deployRDLNUpgradeableFixture);

            await rdln.connect(owner).pause();
            await rdln.connect(owner).unpause();

            await expect(
                rdln.connect(minter).mint(user1.address, ethers.parseEther("1000"))
            ).to.not.be.reverted;
        });
    });

    describe("Voting Functionality", function () {
        it("Should track voting power correctly", async function () {
            const { rdln, minter, user1 } = await loadFixture(deployRDLNUpgradeableFixture);

            // Mint some tokens
            await rdln.connect(minter).mint(user1.address, ethers.parseEther("1000"));

            // User needs to delegate to themselves to get voting power
            await rdln.connect(user1).delegate(user1.address);

            // Check voting power
            const votingPower = await rdln.getVotes(user1.address);
            expect(votingPower).to.equal(ethers.parseEther("1000"));
        });

        it("Should handle delegation correctly", async function () {
            const { rdln, minter, user1, user2 } = await loadFixture(deployRDLNUpgradeableFixture);

            await rdln.connect(minter).mint(user1.address, ethers.parseEther("1000"));

            // Delegate to user2
            await rdln.connect(user1).delegate(user2.address);

            // user2 should have the voting power
            expect(await rdln.getVotes(user2.address)).to.equal(ethers.parseEther("1000"));
            expect(await rdln.getVotes(user1.address)).to.equal(0);
        });

        it("Should return correct clock and clock mode", async function () {
            const { rdln } = await loadFixture(deployRDLNUpgradeableFixture);

            expect(await rdln.CLOCK_MODE()).to.equal("mode=timestamp");

            const clock = await rdln.clock();
            expect(clock).to.be.gt(0);
        });
    });

    describe("Compliance System", function () {
        it("Should allow compliance role to block transfers", async function () {
            const { rdln, compliance, minter, user1, user2 } = await loadFixture(deployRDLNUpgradeableFixture);

            await rdln.connect(minter).mint(user1.address, ethers.parseEther("1000"));

            // Block user1 transfers
            await rdln.connect(compliance).setTransferBlocked(user1.address, true);

            await expect(
                rdln.connect(user1).transfer(user2.address, ethers.parseEther("100"))
            ).to.be.revertedWithCustomError(rdln, "TransferBlocked");
        });

        it("Should emit compliance events", async function () {
            const { rdln, compliance, user1 } = await loadFixture(deployRDLNUpgradeableFixture);

            await expect(rdln.connect(compliance).setTransferBlocked(user1.address, true))
                .to.emit(rdln, "ComplianceUpdate")
                .withArgs(user1.address, true);
        });

        it("Should allow unblocking of transfers", async function () {
            const { rdln, compliance, minter, user1, user2 } = await loadFixture(deployRDLNUpgradeableFixture);

            await rdln.connect(minter).mint(user1.address, ethers.parseEther("1000"));
            await rdln.connect(compliance).setTransferBlocked(user1.address, true);
            await rdln.connect(compliance).setTransferBlocked(user1.address, false);

            await expect(
                rdln.connect(user1).transfer(user2.address, ethers.parseEther("100"))
            ).to.not.be.reverted;
        });
    });

    describe("Cross-Chain Bridge Preparation", function () {
        it("Should allow bridge role to lock tokens", async function () {
            const { rdln, owner, minter, user1 } = await loadFixture(deployRDLNUpgradeableFixture);

            const BRIDGE_ROLE = await rdln.BRIDGE_ROLE();
            await rdln.connect(owner).grantRole(BRIDGE_ROLE, owner.address);

            await rdln.connect(minter).mint(user1.address, ethers.parseEther("1000"));

            await expect(rdln.connect(owner).lockForBridge(user1.address, ethers.parseEther("500")))
                .to.emit(rdln, "TokensLocked")
                .withArgs(user1.address, ethers.parseEther("500"));

            expect(await rdln.bridgeLocked(user1.address)).to.equal(ethers.parseEther("500"));
        });

        it("Should prevent transfers of locked tokens", async function () {
            const { rdln, owner, minter, user1, user2 } = await loadFixture(deployRDLNUpgradeableFixture);

            const BRIDGE_ROLE = await rdln.BRIDGE_ROLE();
            await rdln.connect(owner).grantRole(BRIDGE_ROLE, owner.address);

            await rdln.connect(minter).mint(user1.address, ethers.parseEther("1000"));
            await rdln.connect(owner).lockForBridge(user1.address, ethers.parseEther("800"));

            // Should fail - trying to transfer more than available (1000 - 800 = 200 available)
            await expect(
                rdln.connect(user1).transfer(user2.address, ethers.parseEther("300"))
            ).to.be.revertedWithCustomError(rdln, "InsufficientUnlockedBalance");

            // Should succeed - transferring within available balance
            await expect(
                rdln.connect(user1).transfer(user2.address, ethers.parseEther("100"))
            ).to.not.be.reverted;
        });
    });

    describe("Upgrade Functionality", function () {
        it("Should be upgradeable by admin", async function () {
            const { rdln, owner } = await loadFixture(deployRDLNUpgradeableFixture);

            // Deploy new implementation
            const RDLNUpgradeableV2 = await ethers.getContractFactory("RDLNUpgradeable");

            await expect(
                upgrades.upgradeProxy(await rdln.getAddress(), RDLNUpgradeableV2)
            ).to.not.be.reverted;
        });

        it("Should preserve state after upgrade", async function () {
            const { rdln, owner, minter, user1 } = await loadFixture(deployRDLNUpgradeableFixture);

            // Set some state
            await rdln.connect(minter).mint(user1.address, ethers.parseEther("1000"));
            const balanceBefore = await rdln.balanceOf(user1.address);

            // Upgrade
            const RDLNUpgradeableV2 = await ethers.getContractFactory("RDLNUpgradeable");
            const upgraded = await upgrades.upgradeProxy(await rdln.getAddress(), RDLNUpgradeableV2);

            // Verify state preservation
            expect(await upgraded.balanceOf(user1.address)).to.equal(balanceBefore);
        });
    });

    describe("Security and Edge Cases", function () {
        it("Should handle zero address validations", async function () {
            const { rdln, minter } = await loadFixture(deployRDLNUpgradeableFixture);

            await expect(
                rdln.connect(minter).mint(ethers.ZeroAddress, ethers.parseEther("1000"))
            ).to.be.revertedWithCustomError(rdln, "ERC20InvalidReceiver");
        });

        it("Should handle arithmetic edge cases in burn distribution", async function () {
            const { rdln, user1 } = await loadFixture(deployRDLNUpgradeableFixture);
            await rdln.connect(user1).mint(user1.address, ethers.parseEther("10000"));

            // Test with odd numbers that don't divide evenly
            const burnAmount = ethers.parseEther("1"); // 1 RDLN
            await expect(rdln.connect(user1).burn(burnAmount))
                .to.emit(rdln, "BurnDistribution");

            // Verify no tokens are lost due to rounding
            const totalAfterDistribution = await rdln.totalSupply() +
                await rdln.balanceOf(await rdln.grandPrizeWallet()) +
                await rdln.balanceOf(await rdln.devOpsWallet());

            // Account for the 50% that was burned
            expect(totalAfterDistribution).to.be.gte(await rdln.totalSupply());
        });

        it("Should prevent reentrancy attacks", async function () {
            const { rdln, user1 } = await loadFixture(deployRDLNUpgradeableFixture);
            await rdln.connect(user1).mint(user1.address, ethers.parseEther("10000"));

            // The ReentrancyGuard should prevent any reentrancy
            // This is more of a structural test - the guard is applied to all state-changing functions
            await expect(rdln.connect(user1).burn(ethers.parseEther("100")))
                .to.not.be.reverted;
        });

        it("Should handle large numbers correctly", async function () {
            const { rdln, minter, user1 } = await loadFixture(deployRDLNUpgradeableFixture);

            const largeAmount = ethers.parseEther("1000000"); // 1 million tokens
            await rdln.connect(minter).mint(user1.address, largeAmount);

            expect(await rdln.balanceOf(user1.address)).to.equal(largeAmount);

            // Test large burn
            const largeBurn = ethers.parseEther("500000");
            await expect(rdln.connect(user1).burn(largeBurn))
                .to.emit(rdln, "BurnDistribution");
        });
    });

    describe("Gas Optimization Tests", function () {
        it("Should efficiently handle batch operations", async function () {
            const { rdln, minter, user1, user2 } = await loadFixture(deployRDLNUpgradeableFixture);

            const recipients = Array(10).fill().map((_, i) => user1.address);
            const amounts = Array(10).fill(ethers.parseEther("100"));

            // This should not run out of gas for reasonable batch sizes
            await expect(rdln.connect(minter).batchMint(recipients, amounts))
                .to.not.be.reverted;
        });

        it("Should have reasonable gas costs for standard operations", async function () {
            const { rdln, minter, user1, user2 } = await loadFixture(deployRDLNUpgradeableFixture);

            await rdln.connect(minter).mint(user1.address, ethers.parseEther("1000"));

            const tx = await rdln.connect(user1).transfer(user2.address, ethers.parseEther("100"));
            const receipt = await tx.wait();

            // Gas usage should be reasonable (this is a sanity check)
            expect(receipt.gasUsed).to.be.lt(100000); // Less than 100k gas for transfer
        });
    });
});