// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/governance/IGovernor.sol";
import "../interfaces/IRON.sol";

/**
 * @title RiddlenDAO
 * @dev DAO governance with transferable/dissolvable founder role
 *
 * Key Features:
 * - Founder role gives executive powers (not token allocation)
 * - Founder can transfer role to anyone (or DAO itself)
 * - Founder can dissolve role permanently (after 1 year)
 * - Voting power = earned RON (proportional, 1 RON = 1 vote)
 * - Proposal thresholds follow biennial halving (10K → 5K → 2.5K RON)
 * - Quorum increases over eras (5% → 10% → 15%)
 *
 * Three Governance Phases:
 * 1. Builder Control (Phase 1): Founder executes instantly
 * 2. Shared Control (Phase 2): DAO proposes, Founder can veto
 * 3. Full DAO Control (Phase 3): Founder role transferred/dissolved
 */
contract RiddlenDAO is
    Initializable,
    GovernorUpgradeable,
    GovernorSettingsUpgradeable,
    GovernorCountingSimpleUpgradeable,
    GovernorVotesUpgradeable,
    GovernorVotesQuorumFractionUpgradeable,
    GovernorTimelockControlUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    // =============================================================
    //                        ROLES
    // =============================================================

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // =============================================================
    //                        FOUNDER STATE
    // =============================================================

    address public founder;
    bool public founderRoleActive;
    uint256 public immutable deploymentTime;

    // Proposal veto tracking
    mapping(uint256 => bool) public founderVetoed;
    mapping(uint256 => string) public vetoReason;

    // =============================================================
    //                        ERA SYSTEM
    // =============================================================

    uint256 public GENESIS_TIME; // Matches ecosystem genesis
    uint256 public constant BIENNIAL_PERIOD = 730 days; // 2 years

    // Era-based proposal thresholds (halving)
    uint256 public constant INITIAL_PROPOSAL_THRESHOLD = 10_000e18; // 10K RON Era 0
    mapping(uint256 => uint256) public eraProposalThresholds;

    // Era-based quorum (increasing)
    uint256 public constant INITIAL_QUORUM_NUMERATOR = 5; // 5% Era 0
    uint256 public constant MAX_QUORUM_NUMERATOR = 15; // 15% cap
    uint256 public constant QUORUM_INCREASE_PER_ERA = 1; // +1% per era

    // =============================================================
    //                        EVENTS
    // =============================================================

    event FounderRoleTransferred(address indexed from, address indexed to);
    event FounderRoleTransferredToDAO(address indexed oldFounder);
    event FounderRoleDissolved(address indexed founder, uint256 timestamp);
    event FounderExecutedProposal(uint256 indexed proposalId);
    event FounderVetoedProposal(uint256 indexed proposalId, string reason);
    event FounderActionExecuted(
        address indexed founder,
        address indexed target,
        bytes data,
        string description
    );

    // =============================================================
    //                        ERRORS
    // =============================================================

    error NotActiveFounder();
    error FounderRoleLocked(); // Cannot dissolve yet (< 1 year)
    error ProposalVetoed();
    error InvalidTransfer();

    // =============================================================
    //                        MODIFIERS
    // =============================================================

    modifier onlyFounder() {
        if (msg.sender != founder || !founderRoleActive) {
            revert NotActiveFounder();
        }
        _;
    }

    // =============================================================
    //                        INITIALIZATION
    // =============================================================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        deploymentTime = block.timestamp;
        _disableInitializers();
    }

    function initialize(
        IRON _ronToken,
        TimelockControllerUpgradeable _timelock,
        address _founder,
        uint256 _genesisTime
    ) public initializer {
        __Governor_init("RiddlenDAO");
        __GovernorSettings_init(
            7200, // 1 day voting delay (1 block = 12 sec)
            50400, // 1 week voting period
            0 // Initial proposal threshold (use era-based)
        );
        __GovernorCountingSimple_init();
        __GovernorVotes_init(IVotes(address(_ronToken)));
        __GovernorVotesQuorumFraction_init(INITIAL_QUORUM_NUMERATOR);
        __GovernorTimelockControl_init(_timelock);
        __AccessControl_init();
        __UUPSUpgradeable_init();

        founder = _founder;
        founderRoleActive = true;
        GENESIS_TIME = _genesisTime;

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, _founder);
        _grantRole(UPGRADER_ROLE, _founder);
        _grantRole(PAUSER_ROLE, _founder);

        // Initialize era thresholds (first 10 eras)
        _initializeEraThresholds();

        emit FounderRoleTransferred(address(0), _founder);
    }

    function _initializeEraThresholds() internal {
        uint256 threshold = INITIAL_PROPOSAL_THRESHOLD;
        for (uint256 era = 0; era < 10; era++) {
            eraProposalThresholds[era] = threshold;
            threshold = threshold / 2; // Halve every era
        }
    }

    // =============================================================
    //                        ERA FUNCTIONS
    // =============================================================

    /**
     * @dev Get current era (0, 1, 2, 3...)
     */
    function getCurrentEra() public view returns (uint256) {
        if (block.timestamp < GENESIS_TIME) return 0;
        return (block.timestamp - GENESIS_TIME) / BIENNIAL_PERIOD;
    }

    /**
     * @dev Get current proposal threshold for era
     */
    function getCurrentProposalThreshold() public view returns (uint256) {
        uint256 currentEra = getCurrentEra();
        return eraProposalThresholds[currentEra];
    }

    /**
     * @dev Get current quorum numerator for era
     * Starts at 5%, increases 1% per era, caps at 15%
     */
    function getCurrentQuorumNumerator() public view returns (uint256) {
        uint256 currentEra = getCurrentEra();
        uint256 quorum = INITIAL_QUORUM_NUMERATOR +
            (currentEra * QUORUM_INCREASE_PER_ERA);

        return quorum > MAX_QUORUM_NUMERATOR
            ? MAX_QUORUM_NUMERATOR
            : quorum;
    }

    // =============================================================
    //                        FOUNDER POWERS
    // =============================================================

    /**
     * @dev Founder executes any action instantly (no vote needed)
     * Use during Phase 1 for fast iteration
     * @param target Contract to call
     * @param data Encoded function call
     * @param description Public description of action
     */
    function executeAsFounder(
        address target,
        bytes calldata data,
        string calldata description
    ) external onlyFounder {
        (bool success, ) = target.call(data);
        require(success, "Execution failed");

        emit FounderActionExecuted(msg.sender, target, data, description);
    }

    /**
     * @dev Founder executes a DAO proposal that passed (advisory)
     * Shows founder listens to community
     */
    function executeAdvisoryProposal(uint256 proposalId)
        external
        onlyFounder
    {
        require(
            state(proposalId) == ProposalState.Succeeded,
            "Proposal not passed"
        );

        _executeOperations(
            proposalId,
            _getProposalTargets(proposalId),
            _getProposalValues(proposalId),
            _getProposalCalldatas(proposalId),
            keccak256(bytes(_getProposalDescription(proposalId)))
        );

        emit FounderExecutedProposal(proposalId);
    }

    /**
     * @dev Founder vetoes a proposal (with public reason)
     * @param proposalId Proposal to veto
     * @param reason Public explanation for veto
     */
    function vetoProposal(uint256 proposalId, string calldata reason)
        external
        onlyFounder
    {
        require(
            state(proposalId) == ProposalState.Succeeded,
            "Proposal not passed"
        );

        founderVetoed[proposalId] = true;
        vetoReason[proposalId] = reason;

        emit FounderVetoedProposal(proposalId, reason);
    }

    /**
     * @dev Check if proposal was vetoed by founder
     */
    function isVetoed(uint256 proposalId) public view returns (bool) {
        return founderVetoed[proposalId];
    }

    // =============================================================
    //                        ROLE MANAGEMENT
    // =============================================================

    /**
     * @dev Founder transfers role to another address
     * Use case: Stepping back but system needs guidance
     * @param newFounder Address of new founder
     */
    function transferFounderRole(address newFounder)
        external
        onlyFounder
    {
        if (newFounder == address(0)) revert InvalidTransfer();
        if (newFounder == founder) revert InvalidTransfer();

        address oldFounder = founder;
        founder = newFounder;

        // Transfer admin roles
        _grantRole(DEFAULT_ADMIN_ROLE, newFounder);
        _grantRole(UPGRADER_ROLE, newFounder);
        _grantRole(PAUSER_ROLE, newFounder);

        _revokeRole(DEFAULT_ADMIN_ROLE, oldFounder);
        _revokeRole(UPGRADER_ROLE, oldFounder);
        _revokeRole(PAUSER_ROLE, oldFounder);

        emit FounderRoleTransferred(oldFounder, newFounder);
    }

    /**
     * @dev Transfer founder role to the DAO itself
     * DAO becomes "founder" = proposals execute via normal governance
     */
    function transferFounderRoleToDAO()
        external
        onlyFounder
    {
        address oldFounder = founder;
        founder = address(this);

        emit FounderRoleTransferredToDAO(oldFounder);
    }

    /**
     * @dev Dissolve founder role permanently
     * This is IRREVERSIBLE - role ceases to exist forever
     * Requires 1 year minimum after deployment
     */
    function dissolveFounderRole()
        external
        onlyFounder
    {
        if (block.timestamp < deploymentTime + 365 days) {
            revert FounderRoleLocked();
        }

        founderRoleActive = false;

        emit FounderRoleDissolved(founder, block.timestamp);
    }

    /**
     * @dev Check if founder role is still active
     */
    function hasActiveFounder() public view returns (bool) {
        return founderRoleActive && founder != address(this);
    }

    // =============================================================
    //                        PROPOSAL EXECUTION
    // =============================================================

    /**
     * @dev Override execute to check for founder veto and active founder
     * Phase 1 (Active Founder): Founder must execute
     * Phase 2 (Transferred to DAO): Auto-executes via timelock
     * Phase 3 (Dissolved): Auto-executes via timelock
     */
    function execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public payable override returns (uint256) {
        uint256 proposalId = hashProposal(targets, values, calldatas, descriptionHash);

        // Check if vetoed by founder
        if (founderVetoed[proposalId]) {
            revert ProposalVetoed();
        }

        // If founder role active, only founder can execute
        if (hasActiveFounder()) {
            revert("Founder must execute or proposal expires");
        }

        // Otherwise, execute via timelock
        return super.execute(targets, values, calldatas, descriptionHash);
    }

    // =============================================================
    //                        OVERRIDES
    // =============================================================

    /**
     * @dev Proposal threshold uses era-based halving
     */
    function proposalThreshold()
        public
        view
        override(GovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return getCurrentProposalThreshold();
    }

    /**
     * @dev Quorum uses era-based increase (5% → 15%)
     */
    function quorumNumerator()
        public
        view
        override(GovernorVotesQuorumFractionUpgradeable)
        returns (uint256)
    {
        return getCurrentQuorumNumerator();
    }

    function state(uint256 proposalId)
        public
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(uint256 proposalId)
        public
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(GovernorUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (address)
    {
        return super._executor();
    }

    // =============================================================
    //                        UPGRADE
    // =============================================================

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    // =============================================================
    //                        HELPER GETTERS (Internal)
    // =============================================================

    // Note: These internal getters access proposal data
    // In production, you may need to store proposal data in mappings
    // or use a different approach depending on your needs

    function _getProposalTargets(uint256 /*proposalId*/)
        internal
        pure
        returns (address[] memory)
    {
        // Placeholder - implement based on your proposal storage
        return new address[](0);
    }

    function _getProposalValues(uint256 /*proposalId*/)
        internal
        pure
        returns (uint256[] memory)
    {
        return new uint256[](0);
    }

    function _getProposalCalldatas(uint256 /*proposalId*/)
        internal
        pure
        returns (bytes[] memory)
    {
        return new bytes[](0);
    }

    function _getProposalDescription(uint256 /*proposalId*/)
        internal
        pure
        returns (string memory)
    {
        return "";
    }
}
