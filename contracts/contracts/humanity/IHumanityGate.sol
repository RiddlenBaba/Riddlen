// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/**
 * @title IHumanityGate
 * @notice Proves that a riddle entry comes from a unique, verified human.
 * @dev Adapters wrap a proof-of-personhood system (World ID, Self/zkPassport, an attester, ...).
 *      `humanId` must be stable for the same human across wallets, so the game can enforce
 *      one entry per human per session. Implementations must bind the proof to `player`
 *      and `sessionId` so a proof can't be replayed by another wallet or in another session.
 */
interface IHumanityGate {
    /// @return humanId Stable, app-scoped identifier of the verified human. Must not be zero.
    function verifyHuman(address player, uint256 sessionId, bytes calldata proof)
        external
        view
        returns (bytes32 humanId);
}
