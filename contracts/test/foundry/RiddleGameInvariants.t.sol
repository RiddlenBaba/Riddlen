// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../../contracts/token/RDLNUpgradeable.sol";
import "../../contracts/reputation/RONUpgradeable.sol";
import "../../contracts/nft/RiddleNFTAdvanced.sol";

/**
 * @title RiddleGameHandler
 * @dev Drives random sequences of player and game-master actions through one
 *      commit-reveal session, tracking ground truth in ghost variables.
 */
contract RiddleGameHandler is Test {
    RiddleNFTAdvanced public nft;
    uint256 public sessionId;
    bytes32 public constant SALT = keccak256("game-master-salt");

    address[] public players;
    mapping(address => uint256) public tokenOf;
    mapping(address => bool) public ghostCommittedCorrect;
    mapping(address => bool) public ghostHasCommit;
    mapping(address => bool) public ghostRevealed;
    mapping(address => bytes32) internal nonceOf;
    mapping(address => uint256) internal commitCount;

    uint256 public ghostCommits;
    uint256 public ghostCorrectReveals;
    uint256 public ghostFinalizedWithWinners;
    uint256 public ghostClaims;

    constructor(RiddleNFTAdvanced _nft, uint256 _sessionId, address[] memory _players) {
        nft = _nft;
        sessionId = _sessionId;
        players = _players;
    }

    function solution() public pure returns (string[] memory a) {
        a = new string[](2);
        a[0] = "echo";
        a[1] = "map";
    }

    function wrongAnswer() public pure returns (string[] memory a) {
        a = new string[](2);
        a[0] = "echo";
        a[1] = "globe";
    }

    function playerCount() external view returns (uint256) {
        return players.length;
    }

    function _player(uint256 seed) internal view returns (address) {
        return players[seed % players.length];
    }

    function _endTime() internal view returns (uint256 endTime) {
        (, , , , , , , endTime, , , , , , , , , , , ) = nft.riddleSessions(sessionId);
    }

    function _revealedAt() internal view returns (uint256 t) {
        (, t, , , , ) = nft.getCommitRevealState(sessionId);
    }

    // ============ PHASE-AWARE ENTRY POINT ============

    /// @dev Picks an action that makes sense for the current phase so every step advances the game
    function act(uint256 seed, bool flag, uint256 amount) external {
        uint256 roll = seed % 100;
        (, uint256 revealedAt, , , , bool finalized) = nft.getCommitRevealState(sessionId);

        if (block.timestamp < _endTime()) {
            if (roll < 40) this.join(seed >> 8);
            else if (roll < 85) this.commit(seed >> 8, flag);
            else this.warp(amount);
        } else if (revealedAt == 0) {
            if (roll < 70) this.revealSolution();
            else this.warp(amount);
        } else if (block.timestamp <= revealedAt + nft.REVEAL_WINDOW()) {
            if (roll < 65) this.revealAnswer(seed >> 8);
            else if (roll < 90) this.warp(amount);
            else this.finalize(amount);
        } else if (!finalized) {
            if (roll < 80) this.finalize(amount);
            else this.claim(seed >> 8);
        } else {
            this.claim(seed >> 8);
        }
    }

    // ============ ACTIONS ============

    function join(uint256 seed) external {
        address p = _player(seed);
        if (tokenOf[p] != 0 || block.timestamp >= _endTime()) return;
        vm.warp(block.timestamp + 31);
        if (block.timestamp >= _endTime()) return;
        vm.prank(p);
        tokenOf[p] = nft.mintRiddleAccess(sessionId);
    }

    function commit(uint256 seed, bool correct) external {
        address p = _player(seed);
        if (tokenOf[p] == 0) return;
        vm.warp(block.timestamp + 31);
        if (block.timestamp >= _endTime()) return;

        bytes32 nonce = keccak256(abi.encode(p, commitCount[p]++));
        string[] memory answers = correct ? solution() : wrongAnswer();
        bytes32 c = keccak256(abi.encode(address(nft), p, sessionId, answers, nonce));

        vm.prank(p);
        try nft.commitAnswer(sessionId, c) {
            nonceOf[p] = nonce;
            ghostHasCommit[p] = true;
            ghostCommittedCorrect[p] = correct;
            ghostCommits++;
        } catch {}
    }

    function warp(uint256 dt) external {
        // Step sizes fit each phase so sequences can reach every stage of the game
        uint256 maxStep;
        if (block.timestamp < _endTime()) maxStep = 15 minutes;
        else if (_revealedAt() == 0) maxStep = 1 hours;
        else maxStep = 12 hours;
        vm.warp(block.timestamp + bound(dt, 1, maxStep));
    }

    function revealSolution() external {
        if (block.timestamp < _endTime() || _revealedAt() != 0) return;
        nft.revealSolution(sessionId, solution(), SALT);
    }

    function revealAnswer(uint256 seed) external {
        address p = _player(seed);
        if (!ghostHasCommit[p] || ghostRevealed[p]) return;
        vm.prank(p);
        try nft.revealAnswer(
            sessionId, ghostCommittedCorrect[p] ? solution() : wrongAnswer(), nonceOf[p]
        ) {
            ghostRevealed[p] = true;
            if (ghostCommittedCorrect[p]) ghostCorrectReveals++;
        } catch {}
    }

    function finalize(uint256 steps) external {
        try nft.finalizeSession(sessionId, bound(steps, 1, 5)) {
            (, , , , uint256 winners, bool done) = nft.getCommitRevealState(sessionId);
            if (done && winners > 0) ghostFinalizedWithWinners++;
        } catch {}
    }

    function claim(uint256 seed) external {
        address p = _player(seed);
        uint256 tokenId = tokenOf[p];
        if (tokenId == 0) return;
        vm.prank(p);
        try nft.claimPrize(tokenId) {
            ghostClaims++;
        } catch {}
    }
}

contract RiddleGameInvariants is Test {
    RDLNUpgradeable rdln;
    RONUpgradeable ron;
    RiddleNFTAdvanced nft;
    RiddleGameHandler handler;
    uint256 sessionId;

    address admin = address(0xA11CE);

    function setUp() public {
        vm.warp(1_700_000_000);
        vm.startPrank(admin);

        rdln = RDLNUpgradeable(address(new ERC1967Proxy(
            address(new RDLNUpgradeable()),
            abi.encodeCall(RDLNUpgradeable.initialize, (
                admin, address(0x7EA5), admin, admin, address(0x6A4D), address(0xD0), address(0xF00D)
            ))
        )));
        rdln.initializeCreatorEconomy(address(0xC0), address(0xDA));

        ron = RONUpgradeable(address(new ERC1967Proxy(
            address(new RONUpgradeable()),
            abi.encodeCall(RONUpgradeable.initialize, (admin, 0))
        )));

        nft = RiddleNFTAdvanced(address(new ERC1967Proxy(
            address(new RiddleNFTAdvanced()),
            abi.encodeCall(RiddleNFTAdvanced.initialize, (
                admin, address(rdln), address(ron), address(0x7EA5), address(0xD0), address(0x6A4D)
            ))
        )));

        rdln.grantRole(rdln.GAME_ROLE(), address(nft));
        ron.grantRole(ron.GAME_ROLE(), address(nft));
        for (uint160 v = 1; v <= 3; v++) nft.grantRole(nft.QUESTION_VALIDATOR_ROLE(), address(0x1000 + v));

        vm.stopPrank();
        uint256[] memory qids = new uint256[](0);

        address[] memory players = new address[](8);
        for (uint160 i = 0; i < 8; i++) players[i] = address(0xB000 + i);

        vm.startPrank(admin);
        for (uint256 i = 0; i < players.length; i++) rdln.mintPrizePool(players[i], 100_000e18);
        rdln.mintPrizePool(address(nft), 100_000_000e18);
        nft.grantRole(nft.GAME_MASTER_ROLE(), admin);

        sessionId = nft.createRiddleSession(
            "t", "d", "c", RiddleNFTAdvanced.RiddleDifficulty.LEGENDARY, qids, 1 hours
        );
        handler = new RiddleGameHandler(nft, sessionId, players);
        nft.grantRole(nft.GAME_MASTER_ROLE(), address(handler));
        nft.commitSolution(
            sessionId, keccak256(abi.encode(address(nft), sessionId, handler.solution(), handler.SALT()))
        );
        nft.startRiddleSession(sessionId);
        vm.stopPrank();

        bytes4[] memory selectors = new bytes4[](1);
        selectors[0] = RiddleGameHandler.act.selector;
        targetSelector(FuzzSelector({addr: address(handler), selectors: selectors}));
        targetContract(address(handler));
    }

    function _session() internal view returns (uint256 prizePool, uint256 winnerSlots, uint256 totalPrizes) {
        (, prizePool, winnerSlots, , , , , , , , , , totalPrizes, , , , , , ) = nft.riddleSessions(sessionId);
    }

    function _prizeOf(address p) internal view returns (uint256 prize) {
        uint256 tokenId = handler.tokenOf(p);
        if (tokenId == 0) return 0;
        (, , , , prize, ) = nft.getParticipantData(tokenId);
    }

    /// @dev Scripted path through the handler; proves the fuzz actions can reach settlement
    function test_handlerHappyPath() public {
        for (uint256 i = 0; i < 8; i++) handler.join(i);
        for (uint256 i = 0; i < 8; i++) handler.commit(i, i % 3 != 0);
        assertEq(handler.ghostCommits(), 8, "commits");
        for (uint256 i = 0; i < 5; i++) handler.warp(15 minutes);
        handler.revealSolution();
        for (uint256 i = 0; i < 8; i++) handler.revealAnswer(i);
        for (uint256 i = 0; i < 5; i++) handler.warp(12 hours);
        for (uint256 i = 0; i < 4; i++) handler.finalize(5);
        assertEq(handler.ghostFinalizedWithWinners(), 1, "finalized");
        for (uint256 i = 0; i < 8; i++) handler.claim(i);
        assertGt(handler.ghostClaims(), 0, "claims");
    }

    /// @dev With every winner slot filled, total prizes must still fit the session pool
    function test_fullSlotsStayWithinPool() public {
        for (uint256 i = 0; i < 8; i++) handler.join(i);
        for (uint256 i = 0; i < 8; i++) handler.commit(i, true);
        for (uint256 i = 0; i < 5; i++) handler.warp(15 minutes);
        handler.revealSolution();
        for (uint256 i = 0; i < 8; i++) handler.revealAnswer(i);
        for (uint256 i = 0; i < 5; i++) handler.warp(12 hours);
        for (uint256 i = 0; i < 4; i++) handler.finalize(5);

        (uint256 prizePool, uint256 winnerSlots, uint256 totalPrizes) = _session();
        (, , , , uint256 winners, ) = nft.getCommitRevealState(sessionId);
        assertEq(winners, winnerSlots, "all slots filled");
        assertLe(totalPrizes, prizePool, "prizes exceed session pool");
    }

    function afterInvariant() public view {
        console2.log(
            "commits", handler.ghostCommits(), "correctReveals", handler.ghostCorrectReveals()
        );
        console2.log(
            "finalizedWithWinners", handler.ghostFinalizedWithWinners(), "claims", handler.ghostClaims()
        );
    }

    /// @dev Never more winners than slots
    function invariant_winnersWithinSlots() public view {
        (, uint256 winnerSlots, ) = _session();
        (, , , , uint256 winners, ) = nft.getCommitRevealState(sessionId);
        assertLe(winners, winnerSlots);
    }

    /// @dev Only players who actually committed the right answer can be marked correct
    function invariant_onlyTrueAnswersCountAsCorrect() public view {
        for (uint256 i = 0; i < handler.playerCount(); i++) {
            address p = handler.players(i);
            (, , bool correct) = nft.getPlayerCommit(sessionId, p);
            if (correct) assertTrue(handler.ghostCommittedCorrect(p), "wrong answer marked correct");
        }
    }

    /// @dev Only correct, revealed players ever receive a prize
    function invariant_prizesOnlyForCorrectReveals() public view {
        for (uint256 i = 0; i < handler.playerCount(); i++) {
            address p = handler.players(i);
            if (_prizeOf(p) == 0) continue;
            (, , bool correct) = nft.getPlayerCommit(sessionId, p);
            assertTrue(correct, "prize without correct answer");
            assertTrue(handler.ghostRevealed(p), "prize without reveal");
        }
    }

    /// @dev Once finalized, no correct solver who lost out committed earlier than any winner
    function invariant_winnersAreEarliestCorrectCommits() public view {
        (, , , , , bool finalized) = nft.getCommitRevealState(sessionId);
        if (!finalized) return;

        uint256 latestWinner;
        uint256 earliestLoser = type(uint256).max;
        for (uint256 i = 0; i < handler.playerCount(); i++) {
            address p = handler.players(i);
            (, uint256 at, bool correct) = nft.getPlayerCommit(sessionId, p);
            if (!correct) continue;
            if (_prizeOf(p) > 0) {
                if (at > latestWinner) latestWinner = at;
            } else if (at < earliestLoser) {
                earliestLoser = at;
            }
        }
        assertLe(latestWinner, earliestLoser, "later commit beat an earlier correct one");
    }

    /// @dev A session never promises more than its prize pool
    function invariant_prizesWithinPool() public view {
        (uint256 prizePool, , uint256 totalPrizes) = _session();
        assertLe(totalPrizes, prizePool, "prizes exceed session pool");
    }
}
