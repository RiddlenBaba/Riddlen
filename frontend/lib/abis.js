// Complete ERC20 ABI for RDLN Token (extracted from contract artifacts)
export const ERC20_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Basic ERC721 ABI for Riddle NFTs
export const ERC721_ABI = [
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Complete Riddle NFT ABI (extracted from RiddleNFTv3 contract artifacts)
export const RIDDLE_NFT_ABI = [
  ...ERC721_ABI,
  {
    "inputs": [],
    "name": "getCurrentMintCost",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintNFT",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "riddleId", "type": "uint256"}],
    "name": "mintNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "bytes32", "name": "questionHash", "type": "bytes32"}
    ],
    "name": "submitQuestion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "prizePool", "type": "uint256"},
      {"internalType": "uint256", "name": "totalWinners", "type": "uint256"},
      {"internalType": "uint256", "name": "solvePosition", "type": "uint256"}
    ],
    "name": "previewTieredReward",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "riddles",
    "outputs": [
      {"internalType": "uint256", "name": "riddleId", "type": "uint256"},
      {"internalType": "uint256", "name": "weekNumber", "type": "uint256"},
      {"internalType": "uint256", "name": "creationTime", "type": "uint256"},
      {"internalType": "uint256", "name": "totalMinted", "type": "uint256"},
      {"internalType": "uint256", "name": "maxMintRate", "type": "uint256"},
      {"internalType": "uint256", "name": "prizePool", "type": "uint256"},
      {"internalType": "uint256", "name": "winnerSlots", "type": "uint256"},
      {"internalType": "uint256", "name": "totalSolved", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "prizeDistributed", "type": "bool"},
      {"internalType": "bytes32", "name": "riddleHash", "type": "bytes32"},
      {"internalType": "bytes32", "name": "answerHash", "type": "bytes32"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"},
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "name": "hasUserSolvedRiddle",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// RDLN Token ABI (same as ERC20 for now)
export const RDLN_ABI = ERC20_ABI;

// Complete RON Token ABI with tier system (extracted from contract artifacts)
export const RON_ABI = [
  ...ERC20_ABI,
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserTier",
    "outputs": [{"internalType": "enum IRON.AccessTier", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getNextTierRequirement",
    "outputs": [
      {"internalType": "enum IRON.AccessTier", "name": "nextTier", "type": "uint8"},
      {"internalType": "uint256", "name": "ronRequired", "type": "uint256"},
      {"internalType": "uint256", "name": "ronRemaining", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getRiddleAccess",
    "outputs": [
      {"internalType": "bool", "name": "canAccessEasy", "type": "bool"},
      {"internalType": "bool", "name": "canAccessMedium", "type": "bool"},
      {"internalType": "bool", "name": "canAccessHard", "type": "bool"},
      {"internalType": "bool", "name": "canAccessLegendary", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTierThresholds",
    "outputs": [
      {"internalType": "uint256", "name": "solverThreshold", "type": "uint256"},
      {"internalType": "uint256", "name": "expertThreshold", "type": "uint256"},
      {"internalType": "uint256", "name": "oracleThreshold", "type": "uint256"}
    ],
    "stateMutability": "pure",
    "type": "function"
  }
];

// Airdrop Contract ABI - Complete ABI from deployed contract
export const AIRDROP_ABI = [
  {
    "inputs": [],
    "name": "claimPhase1",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimPhase2",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_twitterHandle", "type": "string"}, {"internalType": "string", "name": "_telegramHandle", "type": "string"}],
    "name": "submitSocialProof",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getPhase1Status",
    "outputs": [
      {"internalType": "bool", "name": "eligible", "type": "bool"},
      {"internalType": "bool", "name": "claimed", "type": "bool"},
      {"internalType": "bool", "name": "verified", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getPhase2Status",
    "outputs": [
      {"internalType": "bool", "name": "eligible", "type": "bool"},
      {"internalType": "bool", "name": "claimed", "type": "bool"},
      {"internalType": "uint256", "name": "ronBalance", "type": "uint256"},
      {"internalType": "uint256", "name": "reward", "type": "uint256"},
      {"internalType": "uint8", "name": "tier", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAirdropStats",
    "outputs": [
      {"internalType": "uint256", "name": "phase1Participants_", "type": "uint256"},
      {"internalType": "uint256", "name": "phase1Remaining", "type": "uint256"},
      {"internalType": "uint256", "name": "contractBalance", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "phase1Active",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "phase2Active",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "phase1Participants",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "socialProofVerified",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "phase1Claimed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "phase2Claimed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_ronBalance", "type": "uint256"}],
    "name": "calculatePhase2Reward",
    "outputs": [
      {"internalType": "uint256", "name": "reward", "type": "uint256"},
      {"internalType": "uint8", "name": "tier", "type": "uint8"}
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PHASE1_PER_WALLET",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PHASE1_MAX_PARTICIPANTS",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "RON_MINIMUM_THRESHOLD",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];