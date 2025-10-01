// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/**
 * @title IRiddleNFT_v3
 * @dev Interface for RiddleNFTv3 contract
 */
interface IRiddleNFT_v3 {
    /**
     * @dev Create a new riddle for a specific week
     * @param weekNumber Week to assign the riddle
     * @param riddleHash Hash of the riddle content
     * @param answerHash Hash of the answer
     * @param prizePool Prize pool amount
     * @param maxMintRate Maximum number of NFTs that can be minted
     * @param winnerSlots Number of winner slots
     * @return riddleId The ID of the created riddle
     */
    function createRiddle(
        uint256 weekNumber,
        bytes32 riddleHash,
        bytes32 answerHash,
        uint256 prizePool,
        uint256 maxMintRate,
        uint256 winnerSlots
    ) external returns (uint256 riddleId);

    /**
     * @dev Get current era
     */
    function getCurrentEra() external view returns (uint256);
}