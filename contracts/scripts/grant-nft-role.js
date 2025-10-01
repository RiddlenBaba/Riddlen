const { ethers } = require("hardhat");

/**
 * Grant NFT_CONTRACT_ROLE to RiddleNFTAdvancedV2
 *
 * This allows the NFT contract to interact with GroupManager:
 * - Create groups from NFTs
 * - Activate groups
 * - Complete groups
 */

async function main() {
  console.log("\n🔐 Granting NFT_CONTRACT_ROLE...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deployer:", deployer.address);

  // ============ CONTRACT ADDRESSES ============

  const NFT_ADDRESS = "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";
  const GROUP_MANAGER = "0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899";

  console.log("📋 Addresses:");
  console.log("   NFT Contract:", NFT_ADDRESS);
  console.log("   Group Manager:", GROUP_MANAGER);
  console.log();

  // ============ CONNECT TO CONTRACTS ============

  const groupManager = await ethers.getContractAt("RiddleGroupManager", GROUP_MANAGER);

  // ============ CHECK CURRENT ROLE ============

  console.log("🔍 Checking current role status...");

  const NFT_CONTRACT_ROLE = await groupManager.NFT_CONTRACT_ROLE();
  console.log("   NFT_CONTRACT_ROLE:", NFT_CONTRACT_ROLE);

  const hasRole = await groupManager.hasRole(NFT_CONTRACT_ROLE, NFT_ADDRESS);
  console.log("   Has role:", hasRole);
  console.log();

  if (hasRole) {
    console.log("✅ NFT already has NFT_CONTRACT_ROLE - nothing to do!");
    console.log();
    return;
  }

  // ============ GRANT ROLE ============

  console.log("⏳ Granting NFT_CONTRACT_ROLE to NFT contract...");

  const tx = await groupManager.grantRole(NFT_CONTRACT_ROLE, NFT_ADDRESS);
  console.log("   Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Role granted successfully!");
  console.log("   Gas used:", receipt.gasUsed.toString());
  console.log("   Block:", receipt.blockNumber);
  console.log();

  // ============ VERIFY ROLE ============

  console.log("🔍 Verifying role grant...");

  const hasRoleAfter = await groupManager.hasRole(NFT_CONTRACT_ROLE, NFT_ADDRESS);
  console.log("   Has role:", hasRoleAfter);

  if (!hasRoleAfter) {
    throw new Error("❌ Role grant failed!");
  }

  console.log("✅ Verification successful!");
  console.log();

  // ============ SUMMARY ============

  console.log("=" .repeat(60));
  console.log("🎉 ROLE GRANTED SUCCESSFULLY!");
  console.log("=" .repeat(60));
  console.log();
  console.log("📋 Summary:");
  console.log("   NFT Contract:", NFT_ADDRESS);
  console.log("   Group Manager:", GROUP_MANAGER);
  console.log("   Role:", NFT_CONTRACT_ROLE);
  console.log();
  console.log("✅ The NFT can now:");
  console.log("   • Create groups from NFTs");
  console.log("   • Activate group sessions");
  console.log("   • Complete group sessions");
  console.log();
  console.log("📝 Next Steps:");
  console.log("   1. Test group conversion:");
  console.log("      npx hardhat console --network amoy");
  console.log("      > const nft = await ethers.getContractAt('RiddleNFTAdvancedV2', '" + NFT_ADDRESS + "')");
  console.log("      > await nft.convertToGroupNFT(tokenId)");
  console.log();
  console.log("   2. Test full group flow:");
  console.log("      npx hardhat test test/NFTGroupIntegration.test.js --network amoy");
  console.log();
  console.log("🚀 Ready for group mechanics!");
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });