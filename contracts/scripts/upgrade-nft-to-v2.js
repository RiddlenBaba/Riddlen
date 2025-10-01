const { ethers, upgrades } = require("hardhat");

/**
 * Upgrade RiddleNFTAdvanced to V2 with Group Mechanics
 *
 * Network: Polygon Amoy Testnet
 * Existing NFT Proxy: 0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3
 *
 * New Features:
 * - Convert NFTs to group sessions
 * - Collaborative riddle solving
 * - Era-locked cost inheritance
 * - Group reward distribution
 */

async function main() {
  console.log("\n🚀 Starting RiddleNFTAdvanced V2 Upgrade...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deployer:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC\n");

  // ============ CONTRACT ADDRESSES ============

  const NFT_PROXY = "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";
  const GROUP_MANAGER = "0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899";
  const GROUP_VALIDATOR = "0xC058fdB7b4B5062EC844bF97c45bdD28bdcf6CE6";

  console.log("📋 Contract Addresses:");
  console.log("  NFT Proxy:", NFT_PROXY);
  console.log("  GroupManager:", GROUP_MANAGER);
  console.log("  GroupValidator:", GROUP_VALIDATOR);
  console.log();

  // ============ STEP 1: DEPLOY NEW IMPLEMENTATION ============

  console.log("📦 Step 1: Deploying RiddleNFTAdvancedV2 implementation...");

  const RiddleNFTAdvancedV2 = await ethers.getContractFactory("RiddleNFTAdvancedV2");

  console.log("⏳ Upgrading proxy to V2...");
  const nftV2 = await upgrades.upgradeProxy(NFT_PROXY, RiddleNFTAdvancedV2, {
    kind: 'uups'
  });

  await nftV2.waitForDeployment();
  const nftV2Address = await nftV2.getAddress();

  console.log("✅ Upgrade successful!");
  console.log("   Proxy address:", nftV2Address);
  console.log();

  // Get implementation address
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(nftV2Address);
  console.log("📍 New Implementation:", implementationAddress);
  console.log();

  // ============ STEP 2: INITIALIZE V2 ============

  console.log("🔧 Step 2: Initializing V2 with group mechanics...");

  try {
    const initTx = await nftV2.initializeV2(GROUP_MANAGER, GROUP_VALIDATOR);
    console.log("⏳ Initialization transaction:", initTx.hash);

    const initReceipt = await initTx.wait();
    console.log("✅ V2 initialized successfully!");
    console.log("   Gas used:", initReceipt.gasUsed.toString());
    console.log();
  } catch (error) {
    if (error.message.includes("already initialized")) {
      console.log("ℹ️  V2 already initialized (skipping)");
      console.log();
    } else {
      throw error;
    }
  }

  // ============ STEP 3: VERIFY UPGRADE ============

  console.log("🔍 Step 3: Verifying upgrade...");

  const groupManager = await nftV2.groupManager();
  const groupValidator = await nftV2.groupValidator();

  console.log("   Group Manager:", groupManager);
  console.log("   Group Validator:", groupValidator);

  if (groupManager !== GROUP_MANAGER || groupValidator !== GROUP_VALIDATOR) {
    throw new Error("❌ V2 initialization failed - addresses don't match!");
  }

  console.log("✅ All addresses verified!");
  console.log();

  // ============ DEPLOYMENT SUMMARY ============

  console.log("=" .repeat(60));
  console.log("🎉 UPGRADE COMPLETE!");
  console.log("=" .repeat(60));
  console.log();
  console.log("📋 Contract Details:");
  console.log("   Proxy (unchanged):", NFT_PROXY);
  console.log("   New Implementation:", implementationAddress);
  console.log("   Group Manager:", GROUP_MANAGER);
  console.log("   Group Validator:", GROUP_VALIDATOR);
  console.log();
  console.log("🔗 Verification URLs:");
  console.log("   Proxy:", `https://amoy.polygonscan.com/address/${NFT_PROXY}`);
  console.log("   Implementation:", `https://amoy.polygonscan.com/address/${implementationAddress}`);
  console.log();
  console.log("📝 Next Steps:");
  console.log("   1. Grant NFT_CONTRACT_ROLE in GroupManager");
  console.log("      npx hardhat run scripts/grant-nft-role.js --network amoy");
  console.log();
  console.log("   2. Test group conversion:");
  console.log("      npx hardhat console --network amoy");
  console.log("      > const nft = await ethers.getContractAt('RiddleNFTAdvancedV2', '" + NFT_PROXY + "')");
  console.log("      > await nft.convertToGroupNFT(tokenId)");
  console.log();
  console.log("   3. Verify on PolygonScan:");
  console.log("      npx hardhat verify --network amoy " + implementationAddress);
  console.log();

  // ============ SAVE DEPLOYMENT INFO ============

  const deploymentInfo = {
    network: "amoy",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      nftProxy: NFT_PROXY,
      nftImplementationV2: implementationAddress,
      groupManager: GROUP_MANAGER,
      groupValidator: GROUP_VALIDATOR
    },
    transactions: {
      upgrade: nftV2.deploymentTransaction()?.hash || "N/A"
    }
  };

  const fs = require('fs');
  const path = require('path');
  const deploymentsDir = path.join(__dirname, 'deployments');

  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = path.join(deploymentsDir, 'amoy-nft-v2-upgrade.json');
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));

  console.log("💾 Deployment info saved:", filename);
  console.log();
  console.log("🚀 RiddleNFTAdvanced V2 is now live!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });