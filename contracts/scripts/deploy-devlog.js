const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🚀 Deploying RiddlenDevlog to Polygon Amoy...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC\n");

  // Deploy RiddlenDevlog as upgradeable proxy
  console.log("Deploying RiddlenDevlog...");
  const RiddlenDevlog = await ethers.getContractFactory("RiddlenDevlog");

  const devlog = await upgrades.deployProxy(
    RiddlenDevlog,
    [deployer.address], // admin address
    {
      initializer: "initialize",
      kind: "uups"
    }
  );

  await devlog.waitForDeployment();
  const devlogAddress = await devlog.getAddress();

  console.log("✅ RiddlenDevlog deployed to:", devlogAddress);
  console.log("   - Implementation:", await upgrades.erc1967.getImplementationAddress(devlogAddress));
  console.log("   - Admin:", await upgrades.erc1967.getAdminAddress(devlogAddress));

  // Verify roles
  console.log("\n📋 Verifying roles...");
  const WRITER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("WRITER_ROLE"));
  const hasWriterRole = await devlog.hasRole(WRITER_ROLE, deployer.address);
  console.log("   - Deployer has WRITER_ROLE:", hasWriterRole);

  console.log("\n✅ Deployment complete!");
  console.log("\n📝 Add to frontend config:");
  console.log(`   DEVLOG_CONTRACT: "${devlogAddress}"`);

  console.log("\n🔗 Verify on PolygonScan:");
  console.log(`   https://amoy.polygonscan.com/address/${devlogAddress}`);

  console.log("\n📋 Next steps:");
  console.log("   1. Update riddlen-devlog/.env.local with contract address");
  console.log("   2. Add additional writers if needed: devlog.addWriter(address)");
  console.log("   3. Create first post!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
