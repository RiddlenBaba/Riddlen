// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "../interfaces/IRDLN.sol";
import "../interfaces/IRON.sol";
import "./HuntCommitments.sol";

interface IHuntNFT {
    function mint(address to) external returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
}

/**
 * @title RiddlenHunt
 * @notice A scavenger hunt for the whole world, on a twenty-year schedule. The design is the
 *         whitepaper (riddlen.org/whitepaper/); this contract implements sections 4 to 8.
 *
 *  release   the house posts a riddle: text, sealed answer roots, the address of a key hidden at
 *            a place, the location clue encrypted with the answer, and a map fragment encrypted
 *            with a secret that only exists at that place. The pot is reserved.
 *  open      anyone, a few blocks later: a future block hash rolls how many NFTs exist, which
 *            fixes the share schedule.
 *  mint      buy an NFT: one right to attempt. Priced at priceBps of the pot per NFT, never
 *            below the halving floor in HuntCommitments. Paid through RDLN's game protocol.
 *  attempt   guess. The k-th guess on an NFT costs k steps, a step being stepBps of that riddle's
 *            ticket price, right or wrong. The proof is positional and bound to the token. A
 *            correct guess lets the holder decrypt the location off chain.
 *  claim     stand at the place, scan the key, sign. The k-th finder's share of the pot is
 *            pot * (1/k) / H(N); it is booked now and RELEASED WHEN releaseGap MORE FINDERS HAVE
 *            CLAIMED (one on small pots, two or three on large ones). Completion releases the
 *            rest. RON and the map fragment come at the claim.
 *  withdraw  pull payments.
 *
 *  Nothing expires, nothing settles, nothing is refunded. A riddle nobody completes keeps its
 *  pot. All progress and all claims are keyed by token id and travel with the token.
 */
contract RiddlenHunt is
    Initializable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant GAME_MASTER_ROLE = keccak256("GAME_MASTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    uint256 public constant MAX_NFTS = 1024;          // answer trees have 1024 leaves (depth 10)
    uint256 public constant TREE_DEPTH = 10;
    uint256 public constant MAX_ALTERNATIVES = 8;
    uint256 public constant MAX_TEXT_LENGTH = 4000;
    uint256 public constant ONE = 1e18;               // fixed point for the harmonic sum
    uint256 public constant BPS = 10000;
    bytes32 public constant CLAIM_TYPEHASH =
        keccak256("Claim(uint256 riddleId,uint256 tokenId,address owner)");

    struct Riddle {
        uint8 difficulty;
        uint64 releasedAt;
        uint64 firstClaimAt;
        uint16 nftCount;
        uint16 minted;
        uint16 claimCount;       // finders so far; the next finder's rank is claimCount + 1
        bool opened;
        bool complete;           // every NFT on it has found
        uint128 pot;
        uint128 booked;          // sum of shares booked so far (released or not)
        uint128 claimFee;
        uint16 stepBps;          // guess step = ticket price * stepBps / BPS
        uint16 priceBps;         // mint price = max(floor, pot * priceBps / BPS / nftCount)
        uint8 releaseGap;        // finder k is released when claimCount >= k + releaseGap
        uint64 commitBlock;
        uint64 harmonic;         // H(nftCount) * ONE, fixed at open
        uint32 firstTokenId;
        address cacheSigner;
        bytes32 fragmentCipherHash;
        bytes32[8] altRoots;
        string text;
        bytes locationCipher;
    }

    struct TokenState {
        uint32 riddleId;
        uint16 index;            // position in the answer trees, 0-based mint order
        uint32 attempts;
        uint64 unlockedAt;
        uint64 claimedAt;
        uint16 rank;             // finishing order, 1-based; 0 until found
        bool released;
        uint128 share;           // booked at the claim; owed to the holder once released
    }

    IRDLN public rdln;
    IRON public ron;
    IHuntNFT public nft;
    HuntCommitments public commitments;
    bytes32 public domainSeparator;

    uint256 public riddleCount;
    uint64 public lastReleaseAt;
    mapping(uint256 => Riddle) internal riddles;
    mapping(uint256 => TokenState) internal tokens;
    mapping(address => bool) public usedSigner;
    /// @notice riddle id => finishing rank => token id
    mapping(uint256 => mapping(uint256 => uint256)) public tokenAtRank;

    /// @notice RDLN owed, claimed with withdraw()
    mapping(address => uint256) public owed;
    /// @notice RDLN promised to riddles and to finders; never spendable twice
    uint256 public reserved;

    // Economics: admin-settable, snapshotted into each riddle at release
    uint256[4] public potByDifficulty;
    uint128 public claimFee;
    uint16 public stepBps;       // guess step as a share of the ticket price
    uint16 public priceBps;      // share of a ticket's pot value charged at mint
    uint8[4] public releaseGapByDifficulty; // finders that must follow before a share is released
    uint16 public revealDelay;   // blocks between release and open

    error BadText();
    error BadDifficulty();
    error BadSigner();
    error BadRoots();
    error BadIndex();
    error TooSoon();
    error TooManyRiddles();
    error NotReleased();
    error AlreadyOpened();
    error NotOpened();
    error SoldOut();
    error NotOwner();
    error AlreadyUnlocked();
    error NotUnlocked();
    error AlreadyClaimed();
    error Complete();
    error PoolUnderfunded(uint256 needed, uint256 available);
    error NothingOwed();

    event RiddleReleased(uint256 indexed id, uint8 difficulty, uint256 pot, address cacheSigner, uint64 commitBlock, bytes fragmentCipher);
    event RiddleOpened(uint256 indexed id, uint16 nftCount, bytes32 seed, bool fallbackSeed);
    event Minted(uint256 indexed id, uint256 indexed tokenId, address indexed to, uint16 index, uint256 price);
    event Attempted(uint256 indexed id, uint256 indexed tokenId, address indexed by, uint32 attempts, uint256 cost, bool unlocked);
    event Claimed(uint256 indexed id, uint256 indexed tokenId, address indexed by, uint16 rank, uint256 share);
    event Released(uint256 indexed id, uint256 indexed tokenId, address indexed to, uint256 amount);
    event RiddleComplete(uint256 indexed id);
    event Rekeyed(uint256 indexed id, address cacheSigner, bytes fragmentCipher);
    event GrandPrizeOpen(uint256 riddleCount);
    event Withdrawn(address indexed to, uint256 amount);
    event RONAwardFailed(uint256 indexed id, address indexed player);
    event EconomicsUpdated(uint256[4] pots, uint128 claimFee, uint16 stepBps, uint16 priceBps, uint8[4] releaseGaps, uint16 revealDelay);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin, address rdln_, address ron_, address nft_, address commitments_)
        public
        initializer
    {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        rdln = IRDLN(rdln_);
        ron = IRON(ron_);
        nft = IHuntNFT(nft_);
        commitments = HuntCommitments(commitments_);
        domainSeparator = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256("Riddlen Hunt"), keccak256("1"), block.chainid, address(this)
        ));

        potByDifficulty = [uint256(10_000 ether), 25_000 ether, 60_000 ether, 150_000 ether];
        claimFee = 5 ether;
        stepBps = 200;
        priceBps = 2000;
        releaseGapByDifficulty = [1, 1, 2, 3];
        revealDelay = 10;
    }

    // ============ THE HOUSE ============

    /**
     * @notice Post a riddle. Its NFT count is rolled later by open(), from a block the house
     *         cannot choose. The pot is reserved now.
     * @param altRoots      one 1024-leaf positional Merkle root per accepted answer (unused slots
     *                      hold roots of random leaves so the count of alternatives does not show)
     * @param cacheSigner   address of the key hidden at the place; one key serves one riddle
     * @param locationCipher the location clue, decryptable with any accepted answer
     * @param fragmentCipher this riddle's map fragment, decryptable with the secret at the place;
     *                      stored as a hash, kept whole in the event log
     */
    function release(
        string calldata text,
        uint8 difficulty,
        bytes32[8] calldata altRoots,
        address cacheSigner,
        bytes calldata locationCipher,
        bytes calldata fragmentCipher
    ) external onlyRole(GAME_MASTER_ROLE) returns (uint256 id) {
        if (bytes(text).length == 0 || bytes(text).length > MAX_TEXT_LENGTH) revert BadText();
        if (difficulty > 3) revert BadDifficulty();
        if (cacheSigner == address(0) || usedSigner[cacheSigner]) revert BadSigner();
        if (altRoots[0] == bytes32(0)) revert BadRoots();
        if (riddleCount >= commitments.totalRiddles()) revert TooManyRiddles();
        if (block.timestamp < uint256(lastReleaseAt) + commitments.minReleaseSpacing()) revert TooSoon();

        uint256 pot = potByDifficulty[difficulty];
        uint256 free = rdln.balanceOf(address(this)) - reserved;
        if (free < pot) revert PoolUnderfunded(pot, free);
        reserved += pot;

        id = ++riddleCount;
        lastReleaseAt = uint64(block.timestamp);
        usedSigner[cacheSigner] = true;

        Riddle storage r = riddles[id];
        r.difficulty = difficulty;
        r.releasedAt = uint64(block.timestamp);
        r.commitBlock = uint64(block.number);
        r.pot = uint128(pot);
        r.claimFee = claimFee;
        r.stepBps = stepBps;
        r.priceBps = priceBps;
        r.releaseGap = releaseGapByDifficulty[difficulty];
        r.cacheSigner = cacheSigner;
        r.altRoots = altRoots;
        r.text = text;
        r.locationCipher = locationCipher;
        r.fragmentCipherHash = keccak256(fragmentCipher);

        emit RiddleReleased(id, difficulty, pot, cacheSigner, r.commitBlock, fragmentCipher);
        if (id == commitments.totalRiddles()) emit GrandPrizeOpen(id);
    }

    /// @notice Roll the NFT count from a block after release, and fix the share schedule. Anyone.
    function open(uint256 id) external {
        Riddle storage r = riddles[id];
        if (r.releasedAt == 0) revert NotReleased();
        if (r.opened) revert AlreadyOpened();
        uint256 target = uint256(r.commitBlock) + revealDelay;
        if (block.number <= target) revert TooSoon();

        bytes32 seed = blockhash(target);
        bool fallbackSeed = seed == bytes32(0); // more than 256 blocks passed
        if (fallbackSeed) seed = keccak256(abi.encode(id, r.altRoots, r.cacheSigner, r.commitBlock));
        seed = keccak256(abi.encode(seed, id));

        r.nftCount = rollCount(seed);
        r.harmonic = harmonic(r.nftCount);
        r.opened = true;
        emit RiddleOpened(id, r.nftCount, seed, fallbackSeed);
    }

    /**
     * @notice How many NFTs a riddle gets, from a seed. Weighted so most riddles are scarce:
     *         50% land in 10-50, 25% in 50-200, 20% in 200-600, 5% in 600-1000.
     */
    function rollCount(bytes32 seed) public pure returns (uint16) {
        uint256 bucket = uint256(seed) % 100;
        uint256 span = uint256(keccak256(abi.encode(seed, "span")));
        uint256 lo; uint256 hi;
        if (bucket < 50) { lo = 10; hi = 50; }
        else if (bucket < 75) { lo = 50; hi = 200; }
        else if (bucket < 95) { lo = 200; hi = 600; }
        else { lo = 600; hi = 1000; }
        return uint16(lo + (span % (hi - lo + 1)));
    }

    /// @notice H(n) = 1 + 1/2 + ... + 1/n, times ONE.
    function harmonic(uint256 n) public pure returns (uint64 h) {
        uint256 sum;
        for (uint256 i = 1; i <= n; i++) sum += ONE / i;
        return uint64(sum);
    }

    /// @notice Replace the key and ciphers of a riddle whose cache was lost or destroyed.
    function rekey(uint256 id, address cacheSigner, bytes calldata locationCipher, bytes calldata fragmentCipher)
        external
        onlyRole(GAME_MASTER_ROLE)
    {
        Riddle storage r = riddles[id];
        if (r.releasedAt == 0) revert NotReleased();
        if (r.complete) revert Complete();
        if (cacheSigner == address(0) || usedSigner[cacheSigner]) revert BadSigner();
        usedSigner[cacheSigner] = true;
        r.cacheSigner = cacheSigner;
        r.locationCipher = locationCipher;
        r.fragmentCipherHash = keccak256(fragmentCipher);
        emit Rekeyed(id, cacheSigner, fragmentCipher);
    }

    // ============ PLAYERS ============

    /// @notice Buy an NFT on an open riddle. Price is a share of what the ticket is worth, floored.
    function mint(uint256 id) external nonReentrant returns (uint256 tokenId) {
        Riddle storage r = riddles[id];
        if (!r.opened) revert NotOpened();
        if (r.minted >= r.nftCount) revert SoldOut();

        uint256 price = _mintPrice(r);
        uint16 index = r.minted;
        r.minted = index + 1;
        if (price > 0) rdln.burnNFTMint(msg.sender, price);

        tokenId = nft.mint(msg.sender);
        TokenState storage t = tokens[tokenId];
        t.riddleId = uint32(id);
        t.index = index;
        emit Minted(id, tokenId, msg.sender, index, price);
    }

    /**
     * @notice Guess the answer. Costs (attempts + 1) * step, where step = ticket price * stepBps / BPS,
     *         charged whether or not it is right. `leaf` is keccak256(abi.encode(riddleId, index, H)) where H is the slow hash of
     *         the canonical answer; `proof` are the 10 siblings from the token's position up to
     *         altRoots[alt]. Nothing here is reusable by another token.
     */
    function attempt(uint256 tokenId, uint8 alt, bytes32 leaf, bytes32[10] calldata proof)
        external
        nonReentrant
        returns (bool unlocked)
    {
        TokenState storage t = tokens[tokenId];
        if (t.riddleId == 0 || nft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (t.unlockedAt != 0) revert AlreadyUnlocked();
        if (alt >= MAX_ALTERNATIVES) revert BadIndex();
        Riddle storage r = riddles[t.riddleId];

        uint32 n = t.attempts + 1;
        t.attempts = n;
        uint256 cost = uint256(n) * _step(r);
        if (cost > 0) rdln.burnNFTMint(msg.sender, cost);

        unlocked = _verify(leaf, t.index, proof, r.altRoots[alt]);
        if (unlocked) t.unlockedAt = uint64(block.timestamp);
        emit Attempted(t.riddleId, tokenId, msg.sender, n, cost, unlocked);
    }

    /**
     * @notice Prove you stood at the place: a signature by the hidden key over this token and
     *         its owner. Books this finder's share, releases the previous finder's, awards RON.
     */
    function claim(uint256 tokenId, bytes calldata signature) external nonReentrant {
        TokenState storage t = tokens[tokenId];
        if (t.riddleId == 0 || nft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (t.unlockedAt == 0) revert NotUnlocked();
        if (t.claimedAt != 0) revert AlreadyClaimed();
        Riddle storage r = riddles[t.riddleId];

        bytes32 digest = MessageHashUtils.toTypedDataHash(
            domainSeparator, keccak256(abi.encode(CLAIM_TYPEHASH, uint256(t.riddleId), tokenId, msg.sender))
        );
        if (ECDSA.recover(digest, signature) != r.cacheSigner) revert BadSigner();

        if (r.claimFee > 0) rdln.burnNFTMint(msg.sender, r.claimFee);

        uint16 rank = r.claimCount + 1;
        uint256 share = _shareFor(r, rank);
        r.claimCount = rank;
        r.booked += uint128(share);
        t.claimedAt = uint64(block.timestamp);
        t.rank = rank;
        t.share = uint128(share);
        tokenAtRank[t.riddleId][rank] = tokenId;
        if (rank == 1) {
            r.firstClaimAt = uint64(block.timestamp);
            r.firstTokenId = uint32(tokenId);
        }
        emit Claimed(t.riddleId, tokenId, msg.sender, rank, share);

        // An earlier finder is paid because enough people found it after them
        if (rank > r.releaseGap) _release(t.riddleId, tokenAtRank[t.riddleId][rank - r.releaseGap]);

        // Completion pays everyone still waiting
        if (rank == r.nftCount) {
            r.complete = true;
            uint256 from = rank > r.releaseGap ? rank - r.releaseGap + 1 : 1;
            for (uint256 k = from; k <= rank; k++) _release(t.riddleId, tokenAtRank[t.riddleId][k]);
            emit RiddleComplete(t.riddleId);
        }

        _awardRON(t.riddleId, msg.sender, r.difficulty, rank == 1);
    }

    function withdraw() external nonReentrant {
        uint256 amount = owed[msg.sender];
        if (amount == 0) revert NothingOwed();
        owed[msg.sender] = 0;
        reserved -= amount;
        require(rdln.transfer(msg.sender, amount), "transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    // ============ INTERNALS ============

    /// @dev price = max(halving floor, pot * priceBps / BPS / nftCount)
    function _mintPrice(Riddle storage r) internal view returns (uint256) {
        uint256 floor_ = commitments.mintPriceAt(block.timestamp);
        uint256 byValue = (uint256(r.pot) * r.priceBps) / BPS / r.nftCount;
        return byValue > floor_ ? byValue : floor_;
    }

    /// @dev one guess step: the ticket price at this moment times stepBps
    function _step(Riddle storage r) internal view returns (uint256) {
        return (_mintPrice(r) * r.stepBps) / BPS;
    }

    /// @dev share(k) = pot * (1/k) / H(N); the last rank takes whatever rounding left behind.
    function _shareFor(Riddle storage r, uint256 rank) internal view returns (uint256) {
        if (rank == r.nftCount) return uint256(r.pot) - uint256(r.booked);
        return (uint256(r.pot) * ONE) / (rank * uint256(r.harmonic));
    }

    /// @dev Book a finder's share to whoever holds the token now. Reserved does not change:
    ///      the amount moves from the riddle's pot to owed, and leaves on withdraw.
    function _release(uint256 id, uint256 tokenId) private {
        TokenState storage t = tokens[tokenId];
        if (t.released) return;
        t.released = true;
        address holder = nft.ownerOf(tokenId);
        owed[holder] += t.share;
        emit Released(id, tokenId, holder, t.share);
    }

    /// @dev Positional Merkle check over a 1024-leaf tree whose nodes are keccak256(leaf).
    function _verify(bytes32 leaf, uint16 index, bytes32[10] calldata proof, bytes32 root)
        internal
        pure
        returns (bool)
    {
        bytes32 node = keccak256(abi.encodePacked(leaf));
        uint256 pos = index;
        for (uint256 i = 0; i < TREE_DEPTH; i++) {
            node = (pos & 1) == 1
                ? keccak256(abi.encodePacked(proof[i], node))
                : keccak256(abi.encodePacked(node, proof[i]));
            pos >>= 1;
        }
        return node == root;
    }

    function _awardRON(uint256 id, address player, uint8 difficulty, bool first) private {
        try ron.awardRON(player, IRON.RiddleDifficulty(difficulty), first, false, "Found it") returns (uint256) {}
        catch { emit RONAwardFailed(id, player); }
    }

    // ============ ADMIN ============

    function setEconomics(
        uint256[4] calldata pots,
        uint128 claimFee_,
        uint16 stepBps_,
        uint16 priceBps_,
        uint8[4] calldata releaseGaps_,
        uint16 revealDelay_
    ) external onlyRole(ADMIN_ROLE) {
        require(revealDelay_ > 0 && revealDelay_ < 200, "delay");
        require(priceBps_ <= BPS && stepBps_ <= BPS, "bps");
        for (uint256 i = 0; i < 4; i++) require(releaseGaps_[i] >= 1 && releaseGaps_[i] <= 8, "gap");
        potByDifficulty = pots;
        claimFee = claimFee_;
        stepBps = stepBps_;
        priceBps = priceBps_;
        releaseGapByDifficulty = releaseGaps_;
        revealDelay = revealDelay_;
        emit EconomicsUpdated(pots, claimFee_, stepBps_, priceBps_, releaseGaps_, revealDelay_);
    }

    /// @notice Move unreserved RDLN out. Never touches pots or owed funds.
    function sweep(address to, uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(amount <= rdln.balanceOf(address(this)) - reserved, "reserved");
        require(rdln.transfer(to, amount), "transfer failed");
    }

    function _authorizeUpgrade(address) internal override onlyRole(UPGRADER_ROLE) {}

    // ============ VIEWS ============

    function getRiddle(uint256 id) external view returns (Riddle memory) {
        return riddles[id];
    }

    function getToken(uint256 tokenId) external view returns (TokenState memory) {
        return tokens[tokenId];
    }

    /// @notice What the finder of the given rank on this riddle gets (rank 1 = first finder).
    function shareFor(uint256 id, uint256 rank) external view returns (uint256) {
        Riddle storage r = riddles[id];
        if (!r.opened || rank == 0 || rank > r.nftCount) return 0;
        if (rank <= r.claimCount) return tokens[tokenAtRank[id][rank]].share;
        return _shareFor(r, rank);
    }

    /// @notice The halving floor under every mint price right now.
    function priceFloor() external view returns (uint256) {
        return commitments.mintPriceAt(block.timestamp);
    }

    /// @notice What the next guess on this NFT costs right now.
    function attemptCostFor(uint256 tokenId) external view returns (uint256) {
        TokenState storage t = tokens[tokenId];
        if (t.riddleId == 0) return 0;
        return uint256(t.attempts + 1) * _step(riddles[t.riddleId]);
    }

    /// @notice What the next NFT on this riddle costs. Zero until the count is rolled.
    function mintPriceFor(uint256 id) external view returns (uint256) {
        Riddle storage r = riddles[id];
        if (!r.opened) return 0;
        return _mintPrice(r);
    }

    function available() external view returns (uint256) {
        return rdln.balanceOf(address(this)) - reserved;
    }

    /// @notice Check a revealed map fragment against the committed map (sorted-pair proof).
    function verifyFragment(bytes32 fragmentHash, bytes32[] calldata proof) external view returns (bool) {
        bytes32 node = keccak256(abi.encodePacked(fragmentHash));
        for (uint256 i = 0; i < proof.length; i++) {
            node = node < proof[i]
                ? keccak256(abi.encodePacked(node, proof[i]))
                : keccak256(abi.encodePacked(proof[i], node));
        }
        return node == commitments.mapRoot();
    }

    uint256[40] private __gap;
}
