// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title HuntCommitments
 * @notice The part of the hunt that never changes. Not upgradeable, no owner, no setters:
 *         every value is an immutable fixed at deployment, so no key and no vote can move it.
 *
 *  - mapRoot          Merkle root over the hashes of the 1,000 map fragments. Every fragment a
 *                     solved riddle reveals checks against it.
 *  - prizeCommitment  keccak256 of the grand prize's location and a salt, sealed off chain.
 *  - launchAt         when the mint-price halving clock starts.
 *  - basePrice        mint price at launch, in RDLN wei; halves every halvingPeriod.
 *  - totalRiddles     how many riddles the hunt releases before the grand prize opens.
 *  - minReleaseSpacing seconds the house must wait between releases (the published schedule).
 */
contract HuntCommitments {
    bytes32 public immutable mapRoot;
    bytes32 public immutable prizeCommitment;
    uint64 public immutable launchAt;
    uint256 public immutable basePrice;
    uint64 public immutable halvingPeriod;
    uint32 public immutable totalRiddles;
    uint64 public immutable minReleaseSpacing;

    error BadCommitment();

    constructor(
        bytes32 mapRoot_,
        bytes32 prizeCommitment_,
        uint64 launchAt_,
        uint256 basePrice_,
        uint64 halvingPeriod_,
        uint32 totalRiddles_,
        uint64 minReleaseSpacing_
    ) {
        if (mapRoot_ == bytes32(0) || prizeCommitment_ == bytes32(0)) revert BadCommitment();
        if (halvingPeriod_ == 0 || totalRiddles_ == 0) revert BadCommitment();
        mapRoot = mapRoot_;
        prizeCommitment = prizeCommitment_;
        launchAt = launchAt_;
        basePrice = basePrice_;
        halvingPeriod = halvingPeriod_;
        totalRiddles = totalRiddles_;
        minReleaseSpacing = minReleaseSpacing_;
    }

    /// @notice Mint price at a moment: basePrice halved once per elapsed halvingPeriod since launch.
    function mintPriceAt(uint256 timestamp) public view returns (uint256) {
        if (timestamp <= launchAt) return basePrice;
        uint256 halvings = (timestamp - launchAt) / halvingPeriod;
        if (halvings >= 256) return 0;
        return basePrice >> halvings;
    }
}
