// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MockRiddleNFTv3
 * @dev Mock contract for testing RiddleSubmissionManager
 */
contract MockRiddleNFTv3 is AccessControl {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

    address public rdlnToken;
    address public ronToken;
    uint256 public immutable GENESIS_TIME;

    uint256 public riddleCounter;
    mapping(uint256 => uint256) public weekToRiddleId;

    event RiddleCreated(
        uint256 indexed riddleId,
        uint256 weekNumber,
        uint256 prizePool,
        uint256 maxMintRate,
        uint256 winnerSlots
    );

    constructor(address _rdln, address _ron, uint256 _genesisTime) {
        rdlnToken = _rdln;
        ronToken = _ron;
        GENESIS_TIME = _genesisTime;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createRiddle(
        uint256 weekNumber,
        bytes32 riddleHash,
        bytes32 answerHash,
        uint256 prizePool,
        uint256 maxMintRate,
        uint256 winnerSlots
    ) external onlyRole(CREATOR_ROLE) returns (uint256) {
        require(weekToRiddleId[weekNumber] == 0, "Week already has riddle");

        riddleCounter++;
        uint256 riddleId = riddleCounter;

        weekToRiddleId[weekNumber] = riddleId;

        emit RiddleCreated(riddleId, weekNumber, prizePool, maxMintRate, winnerSlots);

        return riddleId;
    }
}