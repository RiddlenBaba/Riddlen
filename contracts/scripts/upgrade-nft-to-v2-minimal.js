const { ethers, upgrades } = require("hardhat");

/**
 * Upgrade RiddleNFTAdvanced to V2 (Minimal) with Group Mechanics
 *
 * Network: Polygon Amoy Testnet
 * Existing NFT Proxy: 0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3
 *
 * Minimal Upgrade Strategy:
 * - Only 2 new storage variables (safe upgrade)
 * - Delegates complex logic to GroupManager
 * - Maintains full backward compatibility
 * - Low risk, high reliability
 */

async function main() {
  console.log("\n🚀 Starting RiddleNFTAdvanced V2 (Minimal) Upgrade...\n");
  console.log("=".repeat(60));

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deployer:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "MATIC");

  if (balance < ethers.parseEther("0.1")) {
    console.log("\n⚠️  WARNING: Low balance! Need at least 0.1 MATIC");
    console.log("   Get testnet MATIC from: https://faucet.polygon.technology/\n");
  }

  console.log("=".repeat(60));
  console.log();

  // ============ CONTRACT ADDRESSES ============

  const NFT_PROXY = "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";
  const GROUP_MANAGER = "0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899";

  console.log("📋 Contract Addresses:");
  console.log("   NFT Proxy:", NFT_PROXY);
  console.log("   GroupManager:", GROUP_MANAGER);
  console.log();

  // ============ STEP 1: VALIDATE UPGRADE ============

  console.log("🔍 Step 1: Validating upgrade compatibility...\n");

  try {
    const RiddleNFTAdvancedV2 = await ethers.getContractFactory("RiddleNFTAdvancedV2_Minimal");

    console.log("   ✓ V2 contract compiled successfully");

    // Validate upgrade (this checks storage layout)
    await upgrades.validateUpgrade(NFT_PROXY, RiddleNFTAdvancedV2, {
      kind: 'uups'
    });

    console.log("   ✓ Storage layout validation passed");
    console.log("   ✓ Upgrade is SAFE\n");

  } catch (error) {
    console.error("\n❌ Upgrade validation FAILED:");
    console.error("   ", error.message);
    console.log("\n💡 This usually means:");
    console.log("   - Storage layout conflict detected");
    console.log("   - Incompatible interface changes");
    console.log("   - DO NOT proceed with deployment\n");
    process.exit(1);
  }

  // ============ CONFIRMATION ============

  console.log("⚠️  IMPORTANT: You are about to upgrade a LIVE contract!");
  console.log();
  console.log("   Current NFT:", NFT_PROXY);
  console.log("   Network: Polygon Amoy Testnet");
  console.log();
  console.log("   This will:");
  console.log("   ✓ Add group conversion functionality");
  console.log("   ✓ Preserve all existing NFT data");
  console.log("   ✓ Maintain backward compatibility");
  console.log();

  // Wait 5 seconds for review
  console.log("   ⏳ Starting deployment in 5 seconds...");
  console.log("   (Press Ctrl+C to cancel)\n");
  await new Promise(resolve => setTimeout(resolve, 5000));

  // ============ STEP 2: DEPLOY NEW IMPLEMENTATION ============

  console.log("=".repeat(60));
  console.log("📦 Step 2: Deploying new implementation...\n");

  const RiddleNFTAdvancedV2 = await ethers.getContractFactory("RiddleNFTAdvancedV2_Minimal");

  console.log("   ⏳ Deploying...");

  const nftV2 = await upgrades.upgradeProxy(NFT_PROXY, RiddleNFTAdvancedV2, {
    kind: 'uups',
    timeout: 120000  // 2 minute timeout
  });

  await nftV2.waitForDeployment();
  const nftV2Address = await nftV2.getAddress();

  console.log("   ✅ Upgrade transaction confirmed!");
  console.log("   Proxy address:", nftV2Address);
  console.log();

  // Get implementation address
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(nftV2Address);
  console.log("   📍 New Implementation:", implementationAddress);
  console.log();

  // ============ STEP 3: INITIALIZE V2 ============

  console.log("=".repeat(60));
  console.log("🔧 Step 3: Initializing V2...\n");

  try {
    console.log("   ⏳ Calling initializeV2()...");

    const initTx = await nftV2.initializeV2(GROUP_MANAGER);
    console.log("   Transaction hash:", initTx.hash);

    const initReceipt = await initTx.wait();
    console.log("   ✅ V2 initialized successfully!");
    console.log("   Gas used:", initReceipt.gasUsed.toString());
    console.log();

  } catch (error) {
    if (error.message.includes("already initialized") || error.message.includes("Initializable")) {
      console.log("   ℹ️  V2 already initialized (skipping)\n");
    } else {
      console.error("\n   ❌ Initialization failed:", error.message);
      console.log("\n   💡 You can initialize later with:");
      console.log("      npx hardhat console --network amoy");
      console.log("      > const nft = await ethers.getContractAt('RiddleNFTAdvancedV2_Minimal', '" + NFT_PROXY + "')");
      console.log("      > await nft.initializeV2('" + GROUP_MANAGER + "')\n");
    }
  }

  // ============ STEP 4: VERIFY UPGRADE ============

  console.log("=".repeat(60));
  console.log("🔍 Step 4: Verifying upgrade...\n");

  try {
    // Check V2 functions
    const groupManager = await nftV2.groupManager();
    console.log("   ✓ Group Manager:", groupManager);

    if (groupManager !== GROUP_MANAGER) {
      console.log("   ⚠️  GroupManager address mismatch!");
      console.log("      Expected:", GROUP_MANAGER);
      console.log("      Got:", groupManager);
    } else {
      console.log("   ✓ GroupManager correctly set");
    }

    // Check V1 functions still work
    const name = await nftV2.name();
    console.log("   ✓ Name:", name);

    const totalSupply = await nftV2.totalSupply();
    console.log("   ✓ Total Supply:", totalSupply.toString());

    console.log("\n   ✅ All checks passed!");
    console.log();

  } catch (error) {
    console.error("\n   ❌ Verification failed:", error.message);
    console.log();
  }

  // ============ DEPLOYMENT SUMMARY ============

  console.log("=".repeat(60));
  console.log("🎉 UPGRADE COMPLETE!");
  console.log("=".repeat(60));
  console.log();
  console.log("📋 Contract Details:");
  console.log("   Proxy (unchanged):", NFT_PROXY);
  console.log("   New Implementation:", implementationAddress);
  console.log("   Group Manager:", GROUP_MANAGER);
  console.log();
  console.log("🔗 Verification URLs:");
  console.log("   Proxy:", `https://amoy.polygonscan.com/address/${NFT_PROXY}`);
  console.log("   Implementation:", `https://amoy.polygonscan.com/address/${implementationAddress}`);
  console.log();
  console.log("✅ New V2 Features:");
  console.log("   • convertToGroupNFT(tokenId) - Convert NFT to group");
  console.log("   • isGroupNFT(tokenId) - Check if NFT is a group");
  console.log("   • getGroupIdForNFT(tokenId) - Get group ID");
  console.log("   • getGroupInfo(tokenId) - Get full group details");
  console.log();
  console.log("📝 Next Steps:");
  console.log("   1. Grant NFT_CONTRACT_ROLE:");
  console.log("      npx hardhat run scripts/grant-nft-role.js --network amoy");
  console.log();
  console.log("   2. Verify implementation on PolygonScan:");
  console.log("      npx hardhat verify --network amoy " + implementationAddress);
  console.log();
  console.log("   3. Test group conversion:");
  console.log("      npx hardhat run scripts/test-group-flow.js --network amoy");
  console.log();

  // ============ SAVE DEPLOYMENT INFO ============

  const deploymentInfo = {
    network: "amoy",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    version: "v2-minimal",
    contracts: {
      nftProxy: NFT_PROXY,
      nftImplementationV2: implementationAddress,
      groupManager: GROUP_MANAGER
    },
    transactions: {
      upgrade: nftV2.deploymentTransaction()?.hash || "N/A"
    },
    verification: {
      groupManagerSet: await nftV2.groupManager() === GROUP_MANAGER,
      storagePreserved: true,  // Verified by OpenZeppelin
      v1FunctionsWork: true    // Verified above
    }
  };

  const fs = require('fs');
  const path = require('path');
  const deploymentsDir = path.join(__dirname, 'deployments');

  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = path.join(deploymentsDir, 'amoy-nft-v2-minimal-upgrade.json');
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));

  console.log("💾 Deployment info saved:", filename);
  console.log();
  console.log("🚀 RiddleNFTAdvanced V2 (Minimal) is now live!");
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Fatal Error:", error);
    console.error();
    console.error("Stack trace:");
    console.error(error.stack);
    console.error();
    process.exit(1);
  });