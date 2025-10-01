// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IGroupCompositionValidator
 * @dev Interface for validating group composition and calculating pooled RON
 *
 * Purpose: Ensures groups meet tier diversity requirements and calculates group access level
 *
 * Validation Rules:
 * - Group size: 3-11 members
 * - Must have at least 1 each of: Low-tier, Mid-tier, High/Oracle-tier
 * - Max limits: 2 High-tier, 4 Mid-tier, 5 Low-tier
 * - Pooled RON determines accessible riddle tier
 *
 * Usage:
 * - Called by RiddleGroupManager during finalization
 * - Called by RiddleNFTv3 to check riddle access
 */
interface IGroupCompositionValidator {

    // ============ EVENTS ============

    event CompositionValidated(
        address[] members,
        bool valid,
        string reason,
        uint256 timestamp
    );

    event PooledRONCalculated(
        address[] members,
        uint256 totalEffectiveRON,
        uint256 averageEffectiveRON,
        string accessTier
    );

    event TierDistributionAnalyzed(
        uint256 oracleCount,
        uint256 highCount,
        uint256 midCount,
        uint256 lowCount
    );

    // ============ VALIDATION FUNCTIONS ============

    /**
     * @dev Validate group composition meets tier distribution requirements
     * @param members Array of member addresses
     * @return valid True if composition is valid
     * @return reason Error message if invalid, empty if valid
     *
     * Requirements:
     * - Size: 3-11 members
     * - At least 1 Low-tier (0-999 RON)
     * - At least 1 Mid-tier (1K-9.9K RON)
     * - At least 1 High/Oracle-tier (10K+ RON)
     * - Max 2 High-tier members
     * - Max 4 Mid-tier members
     * - Max 5 Low-tier members
     */
    function validateComposition(address[] calldata members)
        external
        view
        returns (bool valid, string memory reason);

    /**
     * @dev Count members in each tier
     * @param members Array of member addresses
     * @return oracleCount Number of Oracle-tier members (100K+ RON)
     * @return highCount Number of High-tier members (10K-99.9K RON)
     * @return midCount Number of Mid-tier members (1K-9.9K RON)
     * @return lowCount Number of Low-tier members (0-999 RON)
     */
    function countTiers(address[] calldata members)
        external
        view
        returns (
            uint256 oracleCount,
            uint256 highCount,
            uint256 midCount,
            uint256 lowCount
        );

    // ============ POOLED RON CALCULATIONS ============

    /**
     * @dev Calculate pooled (average) effective RON for group
     * @param members Array of member addresses
     * @return pooledRON Average of all members' effective RON
     *
     * Formula: pooledRON = sum(effectiveRON) / memberCount
     *
     * Purpose: Determines what riddle tier group can access
     */
    function calculatePooledRON(address[] calldata members)
        external
        view
        returns (uint256 pooledRON);

    /**
     * @dev Determine what riddle tier group can access
     * @param members Array of member addresses
     * @return accessTier String representation of tier
     *
     * Tier Thresholds:
     * - "ORACLE": pooledRON >= 100,000
     * - "EXPERT": pooledRON >= 10,000
     * - "SOLVER": pooledRON >= 1,000
     * - "NOVICE": pooledRON < 1,000
     */
    function getAccessibleRiddleTier(address[] calldata members)
        external
        view
        returns (string memory accessTier);

    /**
     * @dev Check if group can access specific riddle tier
     * @param members Array of member addresses
     * @param requiredRON Minimum pooled RON required
     * @return canAccess True if group's pooled RON meets requirement
     * @return pooledRON Group's calculated pooled RON
     */
    function canAccessRiddleTier(
        address[] calldata members,
        uint256 requiredRON
    ) external view returns (bool canAccess, uint256 pooledRON);

    // ============ REWARD DISTRIBUTION VALIDATION ============

    /**
     * @dev Validate distribution limits (1% min, 70% max)
     * @param shares Array of distribution amounts
     * @param totalAmount Total amount being distributed
     * @return valid True if all shares meet constraints
     * @return violatingIndices Array of indices violating constraints
     *
     * Constraints:
     * - No member receives < 1% of total
     * - No member receives > 70% of total
     */
    function validateDistributionLimits(
        uint256[] calldata shares,
        uint256 totalAmount
    ) external pure returns (
        bool valid,
        uint256[] memory violatingIndices
    );

    /**
     * @dev Calculate RON-weighted distribution shares
     * @param members Array of member addresses
     * @param effectiveRONs Array of effective RON values
     * @param totalAmount Amount to distribute
     * @return shares Array of calculated shares per member
     * @return percentages Array of percentage shares (in basis points)
     *
     * Formula: memberShare = (totalAmount × memberEffectiveRON) / totalEffectiveRON
     *
     * Post-calculation: Applies 1%-70% constraints
     */
    function calculateDistribution(
        address[] calldata members,
        uint256[] calldata effectiveRONs,
        uint256 totalAmount
    ) external pure returns (
        uint256[] memory shares,
        uint256[] memory percentages
    );

    // ============ GROUP STATISTICS ============

    /**
     * @dev Get comprehensive group composition analysis
     * @param members Array of member addresses
     * @return tierCounts Array [oracle, high, mid, low]
     * @return pooledRON Average effective RON
     * @return accessTier Accessible riddle tier
     * @return valid Whether composition is valid
     * @return reason Error message if invalid
     */
    function analyzeGroupComposition(address[] calldata members)
        external
        returns (
            uint256[4] memory tierCounts,
            uint256 pooledRON,
            string memory accessTier,
            bool valid,
            string memory reason
        );

    // ============ CONFIGURATION ============

    /**
     * @dev Get tier distribution limits
     * @return minMembers Minimum group size (3)
     * @return maxMembers Maximum group size (11)
     * @return maxHighTier Maximum high-tier members (2)
     * @return maxMidTier Maximum mid-tier members (4)
     * @return maxLowTier Maximum low-tier members (5)
     */
    function getTierLimits()
        external
        pure
        returns (
            uint256 minMembers,
            uint256 maxMembers,
            uint256 maxHighTier,
            uint256 maxMidTier,
            uint256 maxLowTier
        );

    /**
     * @dev Get distribution constraint limits
     * @return minSharePercent Minimum share percentage (1%)
     * @return maxSharePercent Maximum share percentage (70%)
     */
    function getDistributionLimits()
        external
        pure
        returns (
            uint256 minSharePercent,
            uint256 maxSharePercent
        );
}