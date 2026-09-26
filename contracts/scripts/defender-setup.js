const { DefenderRelayProvider, DefenderRelaySigner } = require('@openzeppelin/defender-sdk');
require('dotenv').config();

/**
 * OpenZeppelin Defender configuration for gasless transactions
 * This script sets up Defender relayers and actions for the gasless system
 */
async function setupDefender() {
    console.log("🛡️ Setting up OpenZeppelin Defender for gasless transactions...");

    // Defender configuration
    const defenderConfig = {
        apiKey: process.env.DEFENDER_API_KEY,
        apiSecret: process.env.DEFENDER_API_SECRET,
    };

    if (!defenderConfig.apiKey || !defenderConfig.apiSecret) {
        console.error("❌ Missing Defender API credentials");
        console.log("Please set DEFENDER_API_KEY and DEFENDER_API_SECRET in your .env file");
        process.exit(1);
    }

    // Contract addresses
    const RIDDLE_NFT_PROXY = process.env.RIDDLE_NFT_PROXY || "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";
    const FORWARDER_ADDRESS = process.env.FORWARDER_ADDRESS;

    if (!FORWARDER_ADDRESS) {
        console.error("❌ FORWARDER_ADDRESS not found in environment variables");
        console.log("Please run: npm run deploy:forwarder first");
        process.exit(1);
    }

    console.log("\n📋 Configuration:");
    console.log("Riddle NFT Proxy:", RIDDLE_NFT_PROXY);
    console.log("Forwarder Address:", FORWARDER_ADDRESS);
    console.log("Network:", process.env.NETWORK || "amoy");

    try {
        // Initialize Defender Relay Provider
        console.log("\n🔄 Initializing Defender Relay...");
        const provider = new DefenderRelayProvider(defenderConfig);
        const signer = new DefenderRelaySigner(defenderConfig, provider);

        console.log("✅ Defender Relay initialized");
        console.log("Relayer address:", await signer.getAddress());

        // Test the connection
        const balance = await provider.getBalance(await signer.getAddress());
        console.log("Relayer balance:", ethers.utils.formatEther(balance), "MATIC");

        // Configuration for gasless functions
        const gaslessFunctions = {
            riddleNFT: [
                {
                    name: "mintRiddleAccess",
                    signature: "mintRiddleAccess(uint256)",
                    description: "Gasless NFT minting for riddle access"
                },
                {
                    name: "submitAnswer",
                    signature: "submitAnswer(uint256,uint256,bytes32)",
                    description: "Gasless answer submission"
                },
                {
                    name: "submitQuestion",
                    signature: "submitQuestion(uint256,bytes32,string)",
                    description: "Gasless custom question submission"
                },
                {
                    name: "convertToGroupNFT",
                    signature: "convertToGroupNFT(uint256)",
                    description: "Gasless NFT to group conversion"
                },
                {
                    name: "claimPrize",
                    signature: "claimPrize(uint256)",
                    description: "Gasless prize claiming"
                }
            ],
            airdrop: [
                {
                    name: "submitSocialProof",
                    signature: "submitSocialProof(string,string)",
                    description: "Gasless social proof submission for Phase 1"
                },
                {
                    name: "claimPhase1",
                    signature: "claimPhase1()",
                    description: "Gasless Phase 1 airdrop claim (social proof)"
                },
                {
                    name: "claimPhase2",
                    signature: "claimPhase2()",
                    description: "Gasless Phase 2 airdrop claim (RON-based)"
                },
                {
                    name: "claimPhase3",
                    signature: "claimPhase3()",
                    description: "Gasless Phase 3 validation rewards claim"
                }
            ]
        };

        console.log("\n📋 Supported Gasless Functions:");
        console.log("\n🎮 Riddle NFT Functions:");
        gaslessFunctions.riddleNFT.forEach((func, index) => {
            console.log(`  ${index + 1}. ${func.name} - ${func.description}`);
        });
        console.log("\n🎁 Airdrop Functions:");
        gaslessFunctions.airdrop.forEach((func, index) => {
            console.log(`  ${index + 1}. ${func.name} - ${func.description}`);
        });

        // Generate webhook code for Defender Actions
        const webhookCode = generateWebhookCode(RIDDLE_NFT_PROXY, FORWARDER_ADDRESS);

        console.log("\n📄 Webhook Code Generated");
        console.log("Copy this code to your Defender Action:");
        console.log("=====================================");
        console.log(webhookCode);
        console.log("=====================================");

        // Save configuration
        const defenderSetup = {
            network: process.env.NETWORK || "amoy",
            relayerAddress: await signer.getAddress(),
            contractAddress: RIDDLE_NFT_PROXY,
            forwarderAddress: FORWARDER_ADDRESS,
            gaslessFunctions: gaslessFunctions,
            timestamp: new Date().toISOString()
        };

        console.log("\n💾 Saving Defender configuration...");
        const fs = require('fs');
        const path = require('path');

        const configDir = path.join(__dirname, '../config');
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        fs.writeFileSync(
            path.join(configDir, 'defender-config.json'),
            JSON.stringify(defenderSetup, null, 2)
        );

        console.log("📄 Configuration saved to: config/defender-config.json");

        console.log("\n🎉 Defender setup complete!");
        console.log("\n📋 Next Steps:");
        console.log("1. Create a Defender Action in the web interface");
        console.log("2. Copy the webhook code above into the Action");
        console.log("3. Set the Action webhook URL in your frontend");
        console.log("4. Test gasless transactions");

    } catch (error) {
        console.error("❌ Defender setup failed:", error);
        throw error;
    }
}

/**
 * Generate webhook code for Defender Action
 */
function generateWebhookCode(contractAddress, forwarderAddress) {
    return `
// OpenZeppelin Defender Action for Riddlen Gasless Transactions
const { ethers } = require('ethers');
const { DefenderRelaySigner } = require('@openzeppelin/defender-sdk');

// Contract addresses
const RIDDLE_NFT_ADDRESS = "${contractAddress}";
const FORWARDER_ADDRESS = "${forwarderAddress}";

// Contract ABI (add full ABI in production)
const RIDDLE_NFT_ABI = [
    "function mintRiddleAccess(uint256 sessionId) external payable returns (uint256)",
    "function submitAnswer(uint256 sessionId, uint256 questionIndex, bytes32 answerHash) external",
    "function submitQuestion(uint256 tokenId, bytes32 questionHash, string memory questionIPFS) external",
    "function convertToGroupNFT(uint256 tokenId) external returns (uint256)",
    "function claimPrize(uint256 tokenId) external"
];

const FORWARDER_ABI = [
    "function execute(tuple(address from, address to, uint256 value, uint256 gas, uint256 nonce, bytes data) request, bytes signature) external payable returns (bool success, bytes returndata)"
];

exports.handler = async function(event) {
    const { body } = event.request;

    try {
        // Parse the meta-transaction request
        const { request, signature } = JSON.parse(body);

        // Initialize Defender Relayer
        const provider = new ethers.providers.JsonRpcProvider();
        const signer = new DefenderRelaySigner(event, provider);

        // Create forwarder contract instance
        const forwarder = new ethers.Contract(FORWARDER_ADDRESS, FORWARDER_ABI, signer);

        // Validate the request
        if (request.to.toLowerCase() !== RIDDLE_NFT_ADDRESS.toLowerCase()) {
            throw new Error('Invalid target contract');
        }

        // Execute the meta-transaction
        console.log('Executing meta-transaction for:', request.from);
        const tx = await forwarder.execute(request, signature);

        console.log('Transaction submitted:', tx.hash);
        const receipt = await tx.wait();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                txHash: tx.hash,
                gasUsed: receipt.gasUsed.toString()
            })
        };

    } catch (error) {
        console.error('Meta-transaction failed:', error);

        return {
            statusCode: 400,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};`;
}

// Handle both direct execution and module export
if (require.main === module) {
    setupDefender()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("❌ Setup failed:", error);
            process.exit(1);
        });
}

module.exports = setupDefender;