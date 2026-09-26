// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./IHumanityGate.sol";

/**
 * @title AttestedHumanityGate
 * @notice Humanity gate backed by signed attestations from trusted verifier services.
 * @dev A verifier service checks a proof-of-personhood protocol off-chain (e.g. World ID cloud
 *      verification with the session id as the action, so the human must be present for every
 *      session), then signs a HumanEntry for the player's wallet. The attestation is bound to
 *      player, session and a short deadline, so it can't be replayed or stockpiled.
 *
 *      Trust assumption: an attester key can admit fake humans. Keep keys in a secrets manager,
 *      rotate with ATTESTER_ROLE, and replace with native on-chain verifiers where available.
 */
contract AttestedHumanityGate is IHumanityGate, AccessControl, EIP712 {
    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");

    bytes32 public constant HUMAN_ENTRY_TYPEHASH =
        keccak256("HumanEntry(address player,bytes32 humanId,uint256 sessionId,uint256 deadline)");

    /// @notice Longest validity an attestation may have, limiting stockpiling and resale
    uint256 public constant MAX_ATTESTATION_TTL = 1 hours;

    error AttestationExpired(uint256 deadline);
    error AttestationTooLong(uint256 deadline);
    error UnknownAttester(address signer);
    error InvalidHumanId();

    constructor(address admin, address initialAttester) EIP712("RiddlenHumanityGate", "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        if (initialAttester != address(0)) _grantRole(ATTESTER_ROLE, initialAttester);
    }

    /**
     * @param proof abi.encode(bytes32 humanId, uint256 deadline, bytes signature)
     */
    function verifyHuman(address player, uint256 sessionId, bytes calldata proof)
        external
        view
        override
        returns (bytes32 humanId)
    {
        uint256 deadline;
        bytes memory signature;
        (humanId, deadline, signature) = abi.decode(proof, (bytes32, uint256, bytes));

        if (humanId == bytes32(0)) revert InvalidHumanId();
        if (block.timestamp > deadline) revert AttestationExpired(deadline);
        if (deadline > block.timestamp + MAX_ATTESTATION_TTL) revert AttestationTooLong(deadline);

        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(HUMAN_ENTRY_TYPEHASH, player, humanId, sessionId, deadline))
        );
        address signer = ECDSA.recover(digest, signature);
        if (!hasRole(ATTESTER_ROLE, signer)) revert UnknownAttester(signer);
    }

    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }
}
