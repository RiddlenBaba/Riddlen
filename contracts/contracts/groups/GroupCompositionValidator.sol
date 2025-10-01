// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "../interfaces/IGroupCompositionValidator.sol";

/**
 * @title GroupCompositionValidator
 * @dev Validates group composition and calculates pooled RON
 *
 * Key Responsibilities:
 * - Enforce tier diversity (must have low, mid, and high tier members)
 * - Validate tier limits (max 2 high, 4 mid, 5 low)
 * - Calculate pooled RON for group access level
 * - Validate reward distribution constraints (1% min, 70% max)
 *
 * Security:
 * - View-only functions (no state changes)
 * - Pure calculation functions for gas efficiency
 * - Immutable tier thresholds matching RON contract
 */
contract GroupCompositionValidator is IGroupCompositionValidator {

    // =============================================================
    //                        CONSTANTS
    // =============================================================

    // Group size limits
    uint256 public constant MIN_MEMBERS = 3;
    uint256 public constant MAX_MEMBERS = 11;

    // Tier distribution limits
    uint256 public constant MAX_HIGH_TIER = 2;   // Max Oracle + High combined
    uint256 public constant MAX_MID_TIER = 4;
    uint256 public constant MAX_LOW_TIER = 5;

    // RON tier thresholds (must match IRON interface)
    uint256 public constant SOLVER_THRESHOLD = 1_000 * 10**18;      // 1K RON
    uint256 public constant EXPERT_THRESHOLD = 10_000 * 10**18;     // 10K RON
    uint256 public constant ORACLE_THRESHOLD = 100_000 * 10**18;    // 100K RON

    // Distribution constraints
    uint256 public constant MIN_SHARE_PERCENT = 1;   // 1%
    uint256 public constant MAX_SHARE_PERCENT = 70;  // 70%

    // External contracts
    address public immutable ronContract;

    // =============================================================
    //                        CONSTRUCTOR
    // =============================================================

    constructor(address _ronContract) {
        require(_ronContract != address(0), "Invalid RON contract");
        ronContract = _ronContract;
    }

    // =============================================================
    //                        VALIDATION FUNCTIONS
    // =============================================================

    /**
     * @dev Validate group composition meets tier distribution requirements
     */
    function validateComposition(address[] calldata members)
        external
        view
        override
        returns (bool valid, string memory reason)
    {
        // Check size
        if (members.length < MIN_MEMBERS) {
            return (false, "Group too small - minimum 3 members required");
        }

        if (members.length > MAX_MEMBERS) {
            return (false, "Group too large - maximum 11 members allowed");
        }

        // Count tiers
        (
            uint256 oracleCount,
            uint256 highCount,
            uint256 midCount,
            uint256 lowCount
        ) = this.countTiers(members);

        // Must have at least one from each tier category
        if (lowCount == 0) {
            return (false, "Must have at least 1 low-tier member (0-999 RON)");
        }

        if (midCount == 0) {
            return (false, "Must have at least 1 mid-tier member (1K-9.9K RON)");
        }

        if (highCount == 0 && oracleCount == 0) {
            return (false, "Must have at least 1 high-tier or oracle member (10K+ RON)");
        }

        // Check maximum limits
        uint256 highTotal = highCount + oracleCount;
        if (highTotal > MAX_HIGH_TIER) {
            return (false, "Too many high-tier members - maximum 2 allowed");
        }

        if (midCount > MAX_MID_TIER) {
            return (false, "Too many mid-tier members - maximum 4 allowed");
        }

        if (lowCount > MAX_LOW_TIER) {
            return (false, "Too many low-tier members - maximum 5 allowed");
        }

        return (true, "");
    }

    /**
     * @dev Count members in each tier
     */
    function countTiers(address[] calldata members)
        external
        view
        override
        returns (
            uint256 oracleCount,
            uint256 highCount,
            uint256 midCount,
            uint256 lowCount
        )
    {
        for (uint256 i = 0; i < members.length; i++) {
            uint256 ron = _getRON(members[i]);

            if (ron >= ORACLE_THRESHOLD) {
                oracleCount++;
            } else if (ron >= EXPERT_THRESHOLD) {
                highCount++;
            } else if (ron >= SOLVER_THRESHOLD) {
                midCount++;
            } else {
                lowCount++;
            }
        }
    }

    // =============================================================
    //                        POOLED RON CALCULATIONS
    // =============================================================

    /**
     * @dev Calculate pooled (average) effective RON for group
     */
    function calculatePooledRON(address[] calldata members)
        external
        view
        override
        returns (uint256 pooledRON)
    {
        if (members.length == 0) return 0;

        uint256 totalEffectiveRON = 0;

        for (uint256 i = 0; i < members.length; i++) {
            totalEffectiveRON += _getEffectiveRON(members[i]);
        }

        return totalEffectiveRON / members.length;
    }

    /**
     * @dev Determine what riddle tier group can access
     */
    function getAccessibleRiddleTier(address[] calldata members)
        external
        view
        override
        returns (string memory accessTier)
    {
        uint256 pooledRON = this.calculatePooledRON(members);

        if (pooledRON >= ORACLE_THRESHOLD) return "ORACLE";
        if (pooledRON >= EXPERT_THRESHOLD) return "EXPERT";
        if (pooledRON >= SOLVER_THRESHOLD) return "SOLVER";
        return "NOVICE";
    }

    /**
     * @dev Check if group can access specific riddle tier
     */
    function canAccessRiddleTier(
        address[] calldata members,
        uint256 requiredRON
    ) external view override returns (bool canAccess, uint256 pooledRON) {
        pooledRON = this.calculatePooledRON(members);
        canAccess = pooledRON >= requiredRON;
    }

    // =============================================================
    //                        REWARD DISTRIBUTION
    // =============================================================

    /**
     * @dev Validate distribution limits (1% min, 70% max)
     */
    function validateDistributionLimits(
        uint256[] calldata shares,
        uint256 totalAmount
    ) external pure override returns (
        bool valid,
        uint256[] memory violatingIndices
    ) {
        uint256 minShare = (totalAmount * MIN_SHARE_PERCENT) / 100;
        uint256 maxShare = (totalAmount * MAX_SHARE_PERCENT) / 100;

        // First pass: count violations
        uint256 violationCount = 0;
        for (uint256 i = 0; i < shares.length; i++) {
            if (shares[i] < minShare || shares[i] > maxShare) {
                violationCount++;
            }
        }

        if (violationCount == 0) {
            return (true, new uint256[](0));
        }

        // Second pass: collect violating indices
        violatingIndices = new uint256[](violationCount);
        uint256 index = 0;
        for (uint256 i = 0; i < shares.length; i++) {
            if (shares[i] < minShare || shares[i] > maxShare) {
                violatingIndices[index++] = i;
            }
        }

        return (false, violatingIndices);
    }

    /**
     * @dev Calculate RON-weighted distribution shares
     */
    function calculateDistribution(
        address[] calldata members,
        uint256[] calldata effectiveRONs,
        uint256 totalAmount
    ) external pure override returns (
        uint256[] memory shares,
        uint256[] memory percentages
    ) {
        require(members.length == effectiveRONs.length, "Length mismatch");
        require(members.length > 0, "Empty members array");

        shares = new uint256[](members.length);
        percentages = new uint256[](members.length);

        // Calculate total effective RON
        uint256 totalEffectiveRON = 0;
        for (uint256 i = 0; i < effectiveRONs.length; i++) {
            totalEffectiveRON += effectiveRONs[i];
        }

        require(totalEffectiveRON > 0, "Zero total RON");

        // Calculate shares
        uint256 minShare = (totalAmount * MIN_SHARE_PERCENT) / 100;
        uint256 maxShare = (totalAmount * MAX_SHARE_PERCENT) / 100;

        for (uint256 i = 0; i < members.length; i++) {
            // Calculate proportional share
            uint256 share = (totalAmount * effectiveRONs[i]) / totalEffectiveRON;

            // Apply constraints
            if (share < minShare) share = minShare;
            if (share > maxShare) share = maxShare;

            shares[i] = share;

            // Calculate percentage in basis points
            percentages[i] = (effectiveRONs[i] * 10000) / totalEffectiveRON;
        }

        return (shares, percentages);
    }

    // =============================================================
    //                        GROUP STATISTICS
    // =============================================================

    /**
     * @dev Get comprehensive group composition analysis
     */
    function analyzeGroupComposition(address[] calldata members)
        external
        override
        returns (
            uint256[4] memory tierCounts,
            uint256 pooledRON,
            string memory accessTier,
            bool valid,
            string memory reason
        )
    {
        // Count tiers
        (
            tierCounts[0], // oracle
            tierCounts[1], // high
            tierCounts[2], // mid
            tierCounts[3]  // low
        ) = this.countTiers(members);

        // Calculate pooled RON
        pooledRON = this.calculatePooledRON(members);

        // Determine access tier
        accessTier = this.getAccessibleRiddleTier(members);

        // Validate composition
        (valid, reason) = this.validateComposition(members);

        emit CompositionValidated(members, valid, reason, block.timestamp);
        emit PooledRONCalculated(members, pooledRON * members.length, pooledRON, accessTier);
        emit TierDistributionAnalyzed(tierCounts[0], tierCounts[1], tierCounts[2], tierCounts[3]);
    }

    // =============================================================
    //                        CONFIGURATION
    // =============================================================

    /**
     * @dev Get tier distribution limits
     */
    function getTierLimits()
        external
        pure
        override
        returns (
            uint256 minMembers,
            uint256 maxMembers,
            uint256 maxHighTier,
            uint256 maxMidTier,
            uint256 maxLowTier
        )
    {
        return (MIN_MEMBERS, MAX_MEMBERS, MAX_HIGH_TIER, MAX_MID_TIER, MAX_LOW_TIER);
    }

    /**
     * @dev Get distribution constraint limits
     */
    function getDistributionLimits()
        external
        pure
        override
        returns (
            uint256 minSharePercent,
            uint256 maxSharePercent
        )
    {
        return (MIN_SHARE_PERCENT, MAX_SHARE_PERCENT);
    }

    // =============================================================
    //                        INTERNAL FUNCTIONS
    // =============================================================

    /**
     * @dev Get base RON for user from RON contract
     */
    function _getRON(address user) internal view returns (uint256) {
        (bool success, bytes memory result) = ronContract.staticcall(
            abi.encodeWithSignature("balanceOf(address)", user)
        );

        if (!success || result.length == 0) return 0;
        return abi.decode(result, (uint256));
    }

    /**
     * @dev Get effective RON (with dilution) for user
     */
    function _getEffectiveRON(address user) internal view returns (uint256) {
        // Try to call getEffectiveRON if available (extended RON)
        (bool success, bytes memory result) = ronContract.staticcall(
            abi.encodeWithSignature("getEffectiveRON(address)", user)
        );

        if (success && result.length > 0) {
            return abi.decode(result, (uint256));
        }

        // Fallback to base RON if extension not available
        return _getRON(user);
    }
}