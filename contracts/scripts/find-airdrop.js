const hre = require("hardhat");

async function main() {
  const deployerAddress = "0x330275259AfCeC8822A861ecbbdfD026dB1B0A13";

  console.log("Searching for RiddlenAirdrop deployments from:", deployerAddress);
  console.log("This may take a moment...\n");

  // Get the latest block
  const latestBlock = await hre.ethers.provider.getBlockNumber();
  console.log("Latest block:", latestBlock);
  console.log("Scanning recent transactions...\n");

  try {
    // Check if we can query transaction history
    const txCount = await hre.ethers.provider.getTransactionCount(deployerAddress);
    console.log("Total transactions from deployer:", txCount);

    // Try to get recent transactions by scanning blocks
    // Note: This is limited as most RPCs don't support full history queries

    console.log("\n🔍 Checking common deployment patterns...\n");

    // Check for contracts deployed via CREATE2 or standard deployment
    // We'll check transactions from the deployer manually

    console.log("⚠️  Unable to automatically scan all transactions on Amoy.");
    console.log("\nPlease check manually:");
    console.log(`1. Visit: https://amoy.polygonscan.com/address/${deployerAddress}`);
    console.log("2. Look for contract creation transactions");
    console.log("3. Find the RiddlenAirdrop deployment\n");

    // Try to check if there are any known patterns
    const rdlnAddress = process.env.RDLN_TOKEN_ADDRESS;
    const ronAddress = process.env.RON_TOKEN_ADDRESS;

    if (rdlnAddress && ronAddress) {
      console.log("Known token addresses from .env:");
      console.log("RDLN:", rdlnAddress);
      console.log("RON:", ronAddress);
      console.log("\nLook for a contract that references these tokens on Polygonscan.\n");
    }

  } catch (error) {
    console.log("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });