// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title IQuestionNFT
 * @dev Interface for Question NFT contract
 */
interface IQuestionNFT is IERC721 {

    enum QuestionDifficulty {
        EASY,    // 5 RON stake
        MEDIUM,  // 25 RON stake
        HARD,    // 50 RON stake
        EXPERT   // 100 RON stake
    }

    struct QuestionNFTData {
        uint256 oracleQuestionId;    // Links to oracle question
        address creator;             // Question creator
        QuestionDifficulty difficulty; // Validated difficulty
        uint256 stakeAmount;         // RON staked by creator
        uint256 mintCost;            // RDLN cost when minted (era-locked)
        uint256 usageCount;          // Times used in riddles
        uint256 totalEarnings;       // Total RDLN earned
        string questionIPFS;         // Question content
        uint256 mintTimestamp;       // For era calculation
        uint256 mintEra;             // Era when minted
    }

    // Events
    event QuestionNFTMinted(
        uint256 indexed tokenId,
        uint256 indexed oracleQuestionId,
        address indexed creator,
        QuestionDifficulty difficulty,
        uint256 stakeAmount,
        uint256 mintCost,
        uint256 era
    );

    event RevenueDistributed(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 amount,
        uint256 usageCount
    );

    // Core functions
    function mintQuestionNFT(
        uint256 oracleQuestionId,
        address creator,
        QuestionDifficulty difficulty,
        uint256 stakeAmount,
        string calldata questionIPFS
    ) external returns (uint256);

    function distributeRevenue(
        uint256[] calldata questionTokenIds,
        uint256 totalAmount
    ) external;

    // View functions
    function getCurrentEra() external view returns (uint256);
    function getCurrentMintCost() external view returns (uint256);
    function getMintCostForEra(uint256 era) external pure returns (uint256);
    function getDifficultyMultiplier(QuestionDifficulty difficulty) external pure returns (uint256);
    function getQuestionData(uint256 tokenId) external view returns (QuestionNFTData memory);

    function getCreatorEarnings(address creator) external view returns (
        uint256 totalQuestions,
        uint256 totalUsages,
        uint256 totalEarnings
    );

    // Admin functions
    function setCreatorSharePercentage(uint256 _percentage) external;
    function grantRiddleNFTRole(address riddleNFTContract) external;

    // Gasless functions
    function initializeGasless(address trustedForwarder_) external;
    function updateTrustedForwarder(address _newForwarder) external;
    function pauseGasless() external;
    function isGaslessEnabled() external view returns (bool);
    function getGaslessConfig() external view returns (address forwarder, bool enabled);
    function isTrustedForwarder(address forwarder) external view returns (bool);

    // Tier-based gasless limits
    function getGaslessLimit(address user) external view returns (uint256);
    function canUseGasless(address user) external view returns (bool);
    function getGaslessUsage(address user) external view returns (uint256 used, uint256 limit, uint256 remaining);
    function resetGaslessUsage(address user) external;
    function batchResetGaslessUsage(address[] calldata users) external;
}