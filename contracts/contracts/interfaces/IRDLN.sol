// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IRDLN
 * @dev Interface for the RDLN token with Riddlen-specific functionality
 */
interface IRDLN is IERC20 {

    // ============ EVENTS ============

    event AllocationMinted(string indexed allocationType, address indexed to, uint256 amount);
    event GameplayBurn(address indexed user, uint256 amount, string indexed reason);
    event TransferBurn(address indexed from, uint256 amount);
    event FailedAttemptBurn(address indexed user, uint256 attemptNumber, uint256 burnAmount);
    event QuestionSubmissionBurn(address indexed user, uint256 questionNumber, uint256 burnAmount);

    // ============ ALLOCATION FUNCTIONS ============

    function mintPrizePool(address to, uint256 amount) external;
    function mintTreasury(address to, uint256 amount) external;
    function mintAirdrop(address to, uint256 amount) external;
    function mintLiquidity(address to, uint256 amount) external;

    // ============ GAME MECHANICS ============

    function burnFailedAttempt(address user) external returns (uint256 burnAmount);
    function burnQuestionSubmission(address user) external returns (uint256 burnAmount);
    function burnNFTMint(address user, uint256 cost) external;

    // ============ VIEW FUNCTIONS ============

    function getRemainingAllocations() external view returns (
        uint256 prizePoolRemaining,
        uint256 treasuryRemaining,
        uint256 airdropRemaining,
        uint256 liquidityRemaining
    );

    function getBurnStats() external view returns (
        uint256 totalBurned,
        uint256 gameplayBurned,
        uint256 transferBurned,
        uint256 currentSupply
    );

    function getUserStats(address user) external view returns (
        uint256 failedAttempts,
        uint256 questionsSubmitted,
        uint256 balance
    );

    function getNextFailedAttemptCost(address user) external view returns (uint256);
    function getNextQuestionCost(address user) external view returns (uint256);

    // ============ CONSTANTS ============

    function TOTAL_SUPPLY() external pure returns (uint256);
    function PRIZE_POOL_ALLOCATION() external pure returns (uint256);
    function TREASURY_ALLOCATION() external pure returns (uint256);
    function AIRDROP_ALLOCATION() external pure returns (uint256);
    function LIQUIDITY_ALLOCATION() external pure returns (uint256);
}