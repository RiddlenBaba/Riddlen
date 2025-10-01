// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/**
 * @title MockOracleNetwork
 * @dev Mock Oracle Network for testing RiddlenAirdrop Phase 3
 */
contract MockOracleNetwork {
    struct ValidatorProfile {
        uint8 tier;
        uint256 totalValidations;
        uint256 correctValidations;
        uint256 accuracy;
        uint256 totalEarned;
        uint256 totalSlashed;
        bool isSuspended;
    }

    mapping(address => ValidatorProfile) public validators;

    /**
     * @dev Set validator profile for testing
     */
    function setValidatorProfile(
        address validator,
        uint8 tier,
        uint256 totalValidations,
        uint256 correctValidations,
        uint256 accuracy,
        uint256 totalEarned,
        uint256 totalSlashed,
        bool isSuspended
    ) external {
        validators[validator] = ValidatorProfile({
            tier: tier,
            totalValidations: totalValidations,
            correctValidations: correctValidations,
            accuracy: accuracy,
            totalEarned: totalEarned,
            totalSlashed: totalSlashed,
            isSuspended: isSuspended
        });
    }

    /**
     * @dev Get validator profile (matches RiddlenOracleNetwork interface)
     */
    function getValidatorProfile(address validator)
        external
        view
        returns (
            uint8 tier,
            uint256 totalValidations,
            uint256 correctValidations,
            uint256 accuracy,
            uint256 totalEarned,
            uint256 totalSlashed,
            bool isSuspended
        )
    {
        ValidatorProfile memory profile = validators[validator];
        return (
            profile.tier,
            profile.totalValidations,
            profile.correctValidations,
            profile.accuracy,
            profile.totalEarned,
            profile.totalSlashed,
            profile.isSuspended
        );
    }

    /**
     * @dev Helper to increment validations for testing
     */
    function incrementValidations(address validator, uint256 amount) external {
        validators[validator].totalValidations += amount;
        validators[validator].correctValidations += amount;
    }

    /**
     * @dev Helper to suspend validator for testing
     */
    function suspendValidator(address validator) external {
        validators[validator].isSuspended = true;
    }

    /**
     * @dev Helper to unsuspend validator for testing
     */
    function unsuspendValidator(address validator) external {
        validators[validator].isSuspended = false;
    }
}
