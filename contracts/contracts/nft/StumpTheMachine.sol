// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../interfaces/IRDLN.sol";
import "../interfaces/IRON.sol";

/**
 * @title StumpTheMachine
 * @notice Riddles written by humans, tried by machines first, solved by humans for RDLN.
 *
 * A challenge pays out only when it proves two things at once:
 *   1. a panel of frontier AI models, answering before any human, got it wrong, and
 *   2. at least MIN_HUMAN_SOLVERS players got it right.
 * So a riddle that AI can solve earns its author nothing, and a solver who pastes the riddle
 * into a model gets the same wrong answer the panel already gave. The better the machines get,
 * the harder the riddles have to be. That is the point.
 *
 * Lifecycle
 *   submit      author stakes RDLN (progressive burn) and commits a salted answer
 *   open        game master commits the sealed panel answers and opens entries
 *   enter       solvers pay the entry cost (burned via RDLN) and seal an answer
 *   close       entries stop at endTime
 *   revealAnswer   author reveals within REVEAL_WINDOW; missing it voids the challenge
 *   revealPanel    game master reveals the panel answers (verified against the commitment)
 *   revealGuess    solvers reveal within REVEAL_WINDOW of the author's reveal
 *   finalize    anyone; scores everything, books payouts, refunds on void
 *   withdraw    pull payments, so a paused or blacklisting token can't jam settlement
 *
 * Every hash uses the canonical answer form in scripts/game/riddleAnswers.js. Authors may list
 * up to MAX_ANSWERS accepted alternatives; a solver reveals exactly one answer.
 */
contract StumpTheMachine is
    Initializable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant GAME_MASTER_ROLE = keccak256("GAME_MASTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    uint256 public constant REVEAL_WINDOW = 2 days;
    uint256 public constant MIN_DURATION = 10 minutes;
    uint256 public constant MAX_DURATION = 30 days;
    uint256 public constant MAX_PANEL_ANSWERS = 32;
    uint256 public constant MAX_RIDDLE_LENGTH = 2000;
    /// @notice Humans who must solve a riddle before it counts as human-solvable
    uint256 public constant MIN_HUMAN_SOLVERS = 1;
    /// @notice Seconds a solver must wait between entering and sealing (keeps bots honest)
    uint256 public constant MIN_SOLVE_TIME = 30;

    enum Status { NONE, SUBMITTED, OPEN, VOID, REJECTED, FINALIZED }
    enum Difficulty { EASY, MEDIUM, HARD, LEGENDARY }
    enum Outcome { PENDING, STUMPED, MACHINE_SOLVED, UNSOLVED, VOIDED }

    struct Challenge {
        address author;
        Status status;
        Difficulty difficulty;
        Outcome outcome;
        uint64 endTime;
        uint64 authorRevealedAt;
        uint32 entrants;
        uint32 correct;
        uint32 finalizeCursor;
        bool panelRevealed;
        bool panelSolved;
        bytes32 answerCommitment; // keccak256(abi.encode(this, author, answers, salt))
        bytes32 answerHash;       // keccak256(abi.encode(answers)) once revealed
        bytes32 panelCommitment;  // keccak256(abi.encode(this, id, panelAnswers, salt))
        uint256 pool;             // RDLN reserved for this challenge
        uint256 entryCost;
        string riddle;
        string[] answers;         // author's canonical answers after reveal
        string[] panelAnswers;    // what the machines said, after reveal
        address[] solvers;
    }

    struct Entry {
        uint64 enteredAt;
        uint64 committedAt;
        bytes32 commitment;       // keccak256(abi.encode(this, solver, id, answers, nonce))
        bool revealed;
        bool correct;
        bool refunded;
    }

    IRDLN public rdln;
    IRON public ron;

    uint256 public challengeCount;
    mapping(uint256 => Challenge) internal challenges;
    mapping(uint256 => mapping(address => Entry)) internal entries;

    /// @notice RDLN owed to players and authors, claimed with withdraw()
    mapping(address => uint256) public owed;
    /// @notice RDLN promised to open challenges and unpaid winners; never spendable twice
    uint256 public reserved;

    /// @notice Prize pool per difficulty, split author 40% / solvers 60% when a riddle stumps
    uint256[4] public poolByDifficulty;
    /// @notice Entry cost per difficulty, burned through RDLN's game protocol
    uint256[4] public entryCostByDifficulty;
    /// @notice Share of the solver pool still paid when the machines also solved it (bps)
    uint256 public machineSolvedSolverBps;
    uint256 public constant AUTHOR_BPS = 4000;
    uint256 public constant BPS = 10000;

    error NotAuthor();
    error NotSubmitted();
    error NotOpen();
    error EntriesClosed();
    error EntriesOpen();
    error AlreadyEntered();
    error NotEntered();
    error AuthorCannotPlay();
    error TooSoon();
    error CommitmentMismatch();
    error AlreadyRevealed();
    error NotRevealable();
    error RevealWindowClosed();
    error RevealWindowOpen();
    error AuthorRevealMissing();
    error PanelRevealMissing();
    error AlreadyFinalized();
    error BadDuration();
    error BadRiddle();
    error BadPanel();
    error PoolUnderfunded(uint256 needed, uint256 available);
    error NothingOwed();

    event ChallengeSubmitted(uint256 indexed id, address indexed author, Difficulty difficulty, uint256 stake);
    event ChallengeOpened(uint256 indexed id, uint64 endTime, uint256 pool, uint256 entryCost);
    event ChallengeRejected(uint256 indexed id, string reason);
    event Entered(uint256 indexed id, address indexed solver);
    event GuessSealed(uint256 indexed id, address indexed solver);
    event AuthorRevealed(uint256 indexed id, string[] answers);
    event PanelRevealed(uint256 indexed id, string[] answers);
    event GuessRevealed(uint256 indexed id, address indexed solver, bool correct);
    event ChallengeFinalized(uint256 indexed id, Outcome outcome, uint32 correct, uint256 authorPaid, uint256 perSolver);
    event Withdrawn(address indexed to, uint256 amount);
    event RONAwardFailed(uint256 indexed id, address indexed player);
    event EconomicsUpdated(uint256[4] pools, uint256[4] entryCosts, uint256 machineSolvedSolverBps);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin, address rdln_, address ron_) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        rdln = IRDLN(rdln_);
        ron = IRON(ron_);

        poolByDifficulty = [
            uint256(10_000 ether), 25_000 ether, 60_000 ether, 150_000 ether
        ];
        entryCostByDifficulty = [
            uint256(10 ether), 25 ether, 50 ether, 100 ether
        ];
        machineSolvedSolverBps = 2500;
    }

    // ============ AUTHOR ============

    /**
     * @notice Submit a riddle. The stake is RDLN's progressive question-submission burn.
     * @param answerCommitment keccak256(abi.encode(address(this), msg.sender, answers, salt))
     */
    function submit(string calldata riddle, Difficulty difficulty, bytes32 answerCommitment)
        external
        nonReentrant
        returns (uint256 id)
    {
        if (bytes(riddle).length == 0 || bytes(riddle).length > MAX_RIDDLE_LENGTH) revert BadRiddle();
        if (answerCommitment == bytes32(0)) revert CommitmentMismatch();

        uint256 stake = rdln.burnQuestionSubmission(msg.sender);

        id = ++challengeCount;
        Challenge storage c = challenges[id];
        c.author = msg.sender;
        c.status = Status.SUBMITTED;
        c.difficulty = difficulty;
        c.answerCommitment = answerCommitment;
        c.riddle = riddle;

        emit ChallengeSubmitted(id, msg.sender, difficulty, stake);
    }

    /// @notice Reveal the answer once entries have closed. Missing the window voids the challenge.
    function revealAnswer(uint256 id, string[] calldata answers, bytes32 salt) external {
        Challenge storage c = challenges[id];
        if (msg.sender != c.author) revert NotAuthor();
        if (c.status != Status.OPEN) revert NotOpen();
        if (block.timestamp < c.endTime) revert EntriesOpen();
        if (c.authorRevealedAt != 0) revert AlreadyRevealed();
        if (block.timestamp > c.endTime + REVEAL_WINDOW) revert RevealWindowClosed();
        if (keccak256(abi.encode(address(this), msg.sender, answers, salt)) != c.answerCommitment) {
            revert CommitmentMismatch();
        }
        if (answers.length == 0 || answers.length > MAX_ANSWERS) revert BadRiddle();

        c.answerHash = keccak256(abi.encode(answers));
        c.authorRevealedAt = uint64(block.timestamp);
        c.answers = answers;
        for (uint256 i = 0; i < answers.length; i++) {
            if (bytes(answers[i]).length == 0) revert BadRiddle();
            accepted[id][keccak256(bytes(answers[i]))] = true;
        }
        emit AuthorRevealed(id, answers);
    }

    // ============ GAME MASTER ============

    /**
     * @notice Open a submitted challenge with the panel's sealed answers.
     * @param panelCommitment keccak256(abi.encode(address(this), id, panelAnswers, salt))
     */
    function open(uint256 id, bytes32 panelCommitment, uint256 duration)
        external
        onlyRole(GAME_MASTER_ROLE)
    {
        Challenge storage c = challenges[id];
        if (c.status != Status.SUBMITTED) revert NotSubmitted();
        if (panelCommitment == bytes32(0)) revert BadPanel();
        if (duration < MIN_DURATION || duration > MAX_DURATION) revert BadDuration();

        uint256 pool = poolByDifficulty[uint256(c.difficulty)];
        uint256 free = rdln.balanceOf(address(this)) - reserved;
        if (free < pool) revert PoolUnderfunded(pool, free);
        reserved += pool;

        c.status = Status.OPEN;
        c.panelCommitment = panelCommitment;
        c.pool = pool;
        c.entryCost = entryCostByDifficulty[uint256(c.difficulty)];
        c.endTime = uint64(block.timestamp + duration);
        emit ChallengeOpened(id, c.endTime, pool, c.entryCost);
    }

    /// @notice Decline a submission (spam, abuse, not a riddle). The stake stays burned.
    function reject(uint256 id, string calldata reason) external onlyRole(GAME_MASTER_ROLE) {
        Challenge storage c = challenges[id];
        if (c.status != Status.SUBMITTED) revert NotSubmitted();
        c.status = Status.REJECTED;
        c.outcome = Outcome.VOIDED;
        emit ChallengeRejected(id, reason);
    }

    /// @notice Reveal what the machines answered. Verified against the commitment made at open.
    function revealPanel(uint256 id, string[] calldata panelAnswers, bytes32 salt)
        external
        onlyRole(GAME_MASTER_ROLE)
    {
        Challenge storage c = challenges[id];
        if (c.status != Status.OPEN) revert NotOpen();
        if (block.timestamp < c.endTime) revert EntriesOpen();
        if (c.panelRevealed) revert AlreadyRevealed();
        if (panelAnswers.length == 0 || panelAnswers.length > MAX_PANEL_ANSWERS) revert BadPanel();
        if (keccak256(abi.encode(address(this), id, panelAnswers, salt)) != c.panelCommitment) {
            revert CommitmentMismatch();
        }
        c.panelRevealed = true;
        c.panelAnswers = panelAnswers;
        emit PanelRevealed(id, panelAnswers);
    }

    // ============ SOLVERS ============

    function enter(uint256 id) external nonReentrant {
        Challenge storage c = challenges[id];
        if (c.status != Status.OPEN) revert NotOpen();
        if (block.timestamp >= c.endTime) revert EntriesClosed();
        if (msg.sender == c.author) revert AuthorCannotPlay();
        Entry storage e = entries[id][msg.sender];
        if (e.enteredAt != 0) revert AlreadyEntered();

        rdln.burnNFTMint(msg.sender, c.entryCost);
        e.enteredAt = uint64(block.timestamp);
        c.entrants++;
        emit Entered(id, msg.sender);
    }

    /**
     * @notice Seal a guess. Re-sealing replaces it.
     * @param commitment keccak256(abi.encode(address(this), msg.sender, id, answers, nonce))
     */
    function sealGuess(uint256 id, bytes32 commitment) external {
        Challenge storage c = challenges[id];
        if (c.status != Status.OPEN) revert NotOpen();
        if (block.timestamp >= c.endTime) revert EntriesClosed();
        Entry storage e = entries[id][msg.sender];
        if (e.enteredAt == 0) revert NotEntered();
        if (block.timestamp < e.enteredAt + MIN_SOLVE_TIME) revert TooSoon();
        if (commitment == bytes32(0)) revert CommitmentMismatch();

        e.commitment = commitment;
        e.committedAt = uint64(block.timestamp);
        emit GuessSealed(id, msg.sender);
    }

    /// @notice Reveal a sealed guess within REVEAL_WINDOW of the author's reveal.
    function revealGuess(uint256 id, string[] calldata answers, bytes32 nonce) external {
        Challenge storage c = challenges[id];
        if (c.status != Status.OPEN) revert NotOpen();
        if (c.authorRevealedAt == 0) revert NotRevealable();
        if (block.timestamp > c.authorRevealedAt + REVEAL_WINDOW) revert RevealWindowClosed();
        Entry storage e = entries[id][msg.sender];
        if (e.commitment == bytes32(0)) revert NotEntered();
        if (e.revealed) revert AlreadyRevealed();
        if (keccak256(abi.encode(address(this), msg.sender, id, answers, nonce)) != e.commitment) {
            revert CommitmentMismatch();
        }

        e.revealed = true;
        e.correct = answers.length == 1 && accepted[id][keccak256(bytes(answers[0]))];
        if (e.correct) {
            c.correct++;
            c.solvers.push(msg.sender);
        }
        emit GuessRevealed(id, msg.sender, e.correct);
    }

    // ============ SETTLEMENT ============

    /**
     * @notice Settle a challenge. Anyone may call once the reveal window has passed.
     *  - author never revealed: VOIDED, every entrant is refunded their entry cost from the pool
     *  - panel matched the answer: MACHINE_SOLVED, correct solvers split a reduced pool
     *  - panel missed and enough humans solved: STUMPED, author 40%, solvers split 60%
     *  - panel missed and humans missed: UNSOLVED, nothing paid
     * Paginated over entrants only to award RON; payouts are booked to `owed`.
     */
    function finalize(uint256 id) external nonReentrant {
        Challenge storage c = challenges[id];
        if (c.status != Status.OPEN) revert NotOpen();
        if (block.timestamp < c.endTime) revert EntriesOpen();

        uint256 authorPaid;
        uint256 perSolver;

        if (c.authorRevealedAt == 0) {
            if (block.timestamp <= c.endTime + REVEAL_WINDOW) revert RevealWindowOpen();
            c.outcome = Outcome.VOIDED;
            // Keep just enough of the pool to refund every entrant (claimed lazily via
            // claimRefund so no loop can run out of gas); release the rest now.
            uint256 refunds = uint256(c.entrants) * c.entryCost;
            if (refunds > c.pool) refunds = c.pool;
            reserved = reserved - c.pool + refunds;
            c.pool = refunds;
        } else {
            if (block.timestamp <= c.authorRevealedAt + REVEAL_WINDOW) revert RevealWindowOpen();
            if (!c.panelRevealed) revert PanelRevealMissing();

            c.panelSolved = _panelMatches(id, c);
            uint256 solverPool;
            if (c.panelSolved) {
                c.outcome = Outcome.MACHINE_SOLVED;
                solverPool = (c.pool * machineSolvedSolverBps) / BPS;
            } else if (c.correct >= MIN_HUMAN_SOLVERS) {
                c.outcome = Outcome.STUMPED;
                authorPaid = (c.pool * AUTHOR_BPS) / BPS;
                solverPool = c.pool - authorPaid;
            } else {
                c.outcome = Outcome.UNSOLVED;
            }

            if (c.correct > 0 && solverPool > 0) perSolver = solverPool / c.correct;
            uint256 paid = authorPaid + perSolver * c.correct;
            if (authorPaid > 0) {
                owed[c.author] += authorPaid;
                _awardRON(id, c.author, c.difficulty, true);
            }
            for (uint256 i = 0; i < c.solvers.length; i++) {
                owed[c.solvers[i]] += perSolver;
                _awardRON(id, c.solvers[i], c.difficulty, false);
            }
            reserved = reserved - c.pool + paid; // paid stays reserved until withdrawn
            c.pool = paid;
        }

        c.status = Status.FINALIZED;
        emit ChallengeFinalized(id, c.outcome, c.correct, authorPaid, perSolver);
    }

    /// @notice On a voided challenge, an entrant claims back their entry cost from the pool.
    function claimRefund(uint256 id) external {
        Challenge storage c = challenges[id];
        if (c.status != Status.FINALIZED || c.outcome != Outcome.VOIDED) revert NotRevealable();
        Entry storage e = entries[id][msg.sender];
        if (e.enteredAt == 0) revert NotEntered();
        if (e.refunded) revert AlreadyRevealed();
        e.refunded = true;
        uint256 amount = c.entryCost;
        if (amount > c.pool) amount = c.pool;
        c.pool -= amount;
        owed[msg.sender] += amount;
    }

    function withdraw() external nonReentrant {
        uint256 amount = owed[msg.sender];
        if (amount == 0) revert NothingOwed();
        owed[msg.sender] = 0;
        reserved -= amount;
        require(rdln.transfer(msg.sender, amount), "transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    function _panelMatches(uint256 id, Challenge storage c) private view returns (bool) {
        string[] storage panel = c.panelAnswers;
        for (uint256 i = 0; i < panel.length; i++) {
            if (accepted[id][keccak256(bytes(panel[i]))]) return true;
        }
        return false;
    }

    function isAccepted(uint256 id, string calldata answer) external view returns (bool) {
        return accepted[id][keccak256(bytes(answer))];
    }

    function _awardRON(uint256 id, address player, Difficulty difficulty, bool isAuthor) private {
        try ron.awardRON(player, IRON.RiddleDifficulty(uint8(difficulty)), isAuthor, false,
            isAuthor ? "Stumped the machine" : "Solved a human riddle") returns (uint256) {}
        catch { emit RONAwardFailed(id, player); }
    }

    // ============ ADMIN ============

    function setEconomics(uint256[4] calldata pools, uint256[4] calldata entryCosts, uint256 solverBps)
        external
        onlyRole(ADMIN_ROLE)
    {
        require(solverBps <= BPS, "bps");
        poolByDifficulty = pools;
        entryCostByDifficulty = entryCosts;
        machineSolvedSolverBps = solverBps;
        emit EconomicsUpdated(pools, entryCosts, solverBps);
    }

    /// @notice Move unreserved RDLN out (e.g. to a new game contract). Never touches owed funds.
    function sweep(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(amount <= rdln.balanceOf(address(this)) - reserved, "reserved");
        require(rdln.transfer(to, amount), "transfer failed");
    }

    function _authorizeUpgrade(address) internal override onlyRole(UPGRADER_ROLE) {}

    // ============ VIEWS ============

    function getChallenge(uint256 id) external view returns (
        address author, Status status, Difficulty difficulty, Outcome outcome,
        uint64 endTime, uint64 authorRevealedAt, uint32 entrants, uint32 correct,
        bool panelRevealed, bool panelSolved, uint256 pool, uint256 entryCost, string memory riddle
    ) {
        Challenge storage c = challenges[id];
        return (
            c.author, c.status, c.difficulty, c.outcome, c.endTime, c.authorRevealedAt,
            c.entrants, c.correct, c.panelRevealed, c.panelSolved, c.pool, c.entryCost, c.riddle
        );
    }

    function getReveals(uint256 id) external view returns (
        string[] memory answers, string[] memory panelAnswers, address[] memory solvers
    ) {
        Challenge storage c = challenges[id];
        return (c.answers, c.panelAnswers, c.solvers);
    }

    function getEntry(uint256 id, address solver) external view returns (Entry memory) {
        return entries[id][solver];
    }

    function available() external view returns (uint256) {
        return rdln.balanceOf(address(this)) - reserved;
    }

    /// @notice Accepted answer hashes per challenge (keccak256 of each canonical answer), set at reveal
    mapping(uint256 => mapping(bytes32 => bool)) internal accepted;
    /// @notice Maximum alternative answers an author may list
    uint256 public constant MAX_ANSWERS = 8;

    uint256[39] private __gap;
}
