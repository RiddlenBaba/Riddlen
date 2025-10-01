# Riddle Submission & Oracle System Design

## Problem
Currently, only CREATOR_ROLE can add riddles. We need a decentralized system where:
1. Community members can submit riddles
2. Quality is maintained through voting/curation
3. Submitters are rewarded for accepted riddles
4. System prevents spam and low-quality submissions

---

## Proposed Architecture

### Option 1: RON-Gated Submission (Simplest)
**How it works:**
- Users must hold minimum RON tokens to submit (e.g., 1,000 RON)
- Submitters stake RON when proposing riddle
- Community votes using RON weight
- Accepted riddles: stake returned + reward
- Rejected riddles: stake slashed/burned

**Pros:**
- Simple to implement
- Natural spam prevention
- Aligns with existing RON reputation system
- No complex oracle needed

**Cons:**
- Barriers to entry for new users
- Could centralize around wealthy users

---

### Option 2: DAO Voting System (Most Decentralized)
**How it works:**
- Anyone can submit riddle (small RDLN fee to prevent spam)
- 7-day voting period
- RON holders vote Yes/No
- Quorum required (e.g., 10% of circulating RON)
- Top voted riddles go live weekly

**Pros:**
- Fully decentralized
- Community-driven quality control
- Democratic process

**Cons:**
- Slow (7-day voting)
- Requires active community participation
- Complex smart contract logic

---

### Option 3: Curator Committee (Hybrid)
**How it works:**
- Users submit riddles on-chain (1 RDLN fee)
- Committee of elected curators (CURATOR_ROLE)
- Multi-sig approval (3 of 5 curators must approve)
- Submitters get 10% of riddle's prize pool if accepted
- Curators rewarded with RON for participation

**Pros:**
- Fast approval process
- Quality control maintained
- Rewards good submissions
- Can evolve to full DAO later

**Cons:**
- Semi-centralized
- Requires curator election mechanism

---

### Option 4: AI Oracle + Community Challenge (Modern)
**How it works:**
- Users submit riddles on-chain (5 RDLN fee)
- AI oracle evaluates quality score (difficulty, uniqueness, clarity)
- High-scoring riddles (>80%) auto-approved
- Medium scores (60-80%) go to community vote
- Low scores (<60%) rejected, fee burned
- Community can challenge AI decisions with stake

**Pros:**
- Fast + scalable
- AI handles obvious accept/reject
- Community override for edge cases
- Modern approach

**Cons:**
- Requires off-chain AI oracle infrastructure
- Oracle security concerns
- More complex

---

## Recommended: **Option 3 + Evolution to Option 2**

### Phase 1: Curator Committee (Now - 6 months)
Start with trusted curators to establish quality baseline and build riddle library.

### Phase 2: Hybrid System (6-12 months)
Add community voting alongside curators for gradual decentralization.

### Phase 3: Full DAO (12+ months)
Transition to pure community voting once ecosystem matures.

---

## Smart Contract Design

### New Contract: `RiddleSubmissionManager.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "./interfaces/IRDLN.sol";
import "./interfaces/IRON.sol";

/**
 * @title RiddleSubmissionManager
 * @dev Community-driven riddle submission with curator approval
 */
contract RiddleSubmissionManager is AccessControlUpgradeable, ReentrancyGuardUpgradeable {

    bytes32 public constant CURATOR_ROLE = keccak256("CURATOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IRDLN public rdlnToken;
    IRON public ronToken;

    uint256 public constant SUBMISSION_FEE = 5e18; // 5 RDLN
    uint256 public constant CURATOR_REWARD = 1e18; // 1 RON per approval
    uint256 public constant SUBMITTER_REWARD_PERCENT = 1000; // 10% of prize pool
    uint256 public constant REQUIRED_APPROVALS = 3; // 3 of 5 curators

    struct RiddleSubmission {
        uint256 submissionId;
        address submitter;
        string riddleQuestion; // IPFS hash or encrypted content
        bytes32 answerHash; // Hashed answer
        string category; // Math, Logic, Crypto, Wordplay, etc.
        uint8 difficulty; // 1-10
        uint256 submittedAt;
        uint256 approvalCount;
        uint256 rejectionCount;
        mapping(address => bool) curatorVotes;
        SubmissionStatus status;
        string rejectionReason;
    }

    enum SubmissionStatus {
        Pending,
        Approved,
        Rejected,
        Live,
        Completed
    }

    mapping(uint256 => RiddleSubmission) public submissions;
    uint256 public submissionCounter;

    mapping(address => uint256) public submitterTotalEarned;
    mapping(address => uint256) public curatorTotalVotes;

    // Events
    event RiddleSubmitted(uint256 indexed submissionId, address indexed submitter, string category, uint8 difficulty);
    event CuratorVoted(uint256 indexed submissionId, address indexed curator, bool approved);
    event RiddleApproved(uint256 indexed submissionId, address indexed submitter);
    event RiddleRejected(uint256 indexed submissionId, string reason);
    event SubmitterRewarded(uint256 indexed submissionId, address indexed submitter, uint256 amount);

    /**
     * @dev Submit a riddle for curator review
     * @param riddleQuestion IPFS hash of encrypted riddle content
     * @param answerHash Keccak256 hash of the answer
     * @param category Category of riddle
     * @param difficulty Difficulty rating 1-10
     */
    function submitRiddle(
        string memory riddleQuestion,
        bytes32 answerHash,
        string memory category,
        uint8 difficulty
    ) external nonReentrant {
        require(bytes(riddleQuestion).length > 0, "Question required");
        require(answerHash != bytes32(0), "Answer hash required");
        require(difficulty >= 1 && difficulty <= 10, "Difficulty 1-10");

        // Charge submission fee
        require(
            rdlnToken.transferFrom(msg.sender, address(this), SUBMISSION_FEE),
            "Fee payment failed"
        );

        uint256 submissionId = ++submissionCounter;

        RiddleSubmission storage submission = submissions[submissionId];
        submission.submissionId = submissionId;
        submission.submitter = msg.sender;
        submission.riddleQuestion = riddleQuestion;
        submission.answerHash = answerHash;
        submission.category = category;
        submission.difficulty = difficulty;
        submission.submittedAt = block.timestamp;
        submission.status = SubmissionStatus.Pending;

        emit RiddleSubmitted(submissionId, msg.sender, category, difficulty);
    }

    /**
     * @dev Curators vote to approve or reject riddle
     * @param submissionId ID of submission
     * @param approve True to approve, false to reject
     * @param reason Reason for rejection (optional)
     */
    function voteOnSubmission(
        uint256 submissionId,
        bool approve,
        string memory reason
    ) external onlyRole(CURATOR_ROLE) {
        RiddleSubmission storage submission = submissions[submissionId];
        require(submission.status == SubmissionStatus.Pending, "Not pending");
        require(!submission.curatorVotes[msg.sender], "Already voted");

        submission.curatorVotes[msg.sender] = true;

        if (approve) {
            submission.approvalCount++;

            // If reached required approvals, mark as approved
            if (submission.approvalCount >= REQUIRED_APPROVALS) {
                submission.status = SubmissionStatus.Approved;
                emit RiddleApproved(submissionId, submission.submitter);

                // Reward curator with RON
                ronToken.mint(msg.sender, CURATOR_REWARD);
            }
        } else {
            submission.rejectionCount++;
            submission.rejectionReason = reason;

            // If 3 rejections, mark as rejected
            if (submission.rejectionCount >= REQUIRED_APPROVALS) {
                submission.status = SubmissionStatus.Rejected;
                emit RiddleRejected(submissionId, reason);

                // Burn submission fee
                rdlnToken.burn(SUBMISSION_FEE);
            }
        }

        curatorTotalVotes[msg.sender]++;
        emit CuratorVoted(submissionId, msg.sender, approve);
    }

    /**
     * @dev Admin promotes approved riddle to live NFT
     * @param submissionId ID of approved submission
     * @param weekNumber Week to assign riddle
     * @param prizePool Prize pool for riddle
     */
    function promoteToLive(
        uint256 submissionId,
        uint256 weekNumber,
        uint256 prizePool
    ) external onlyRole(ADMIN_ROLE) {
        RiddleSubmission storage submission = submissions[submissionId];
        require(submission.status == SubmissionStatus.Approved, "Not approved");

        submission.status = SubmissionStatus.Live;

        // Calculate submitter reward (10% of prize pool)
        uint256 submitterReward = (prizePool * SUBMITTER_REWARD_PERCENT) / 10000;

        // Transfer reward to submitter
        rdlnToken.transfer(submission.submitter, submitterReward);
        submitterTotalEarned[submission.submitter] += submitterReward;

        emit SubmitterRewarded(submissionId, submission.submitter, submitterReward);

        // Call RiddleNFTv3.createRiddle() here
        // (requires integration with main contract)
    }

    /**
     * @dev Get submission details
     */
    function getSubmission(uint256 submissionId) external view returns (
        address submitter,
        string memory riddleQuestion,
        string memory category,
        uint8 difficulty,
        uint256 approvalCount,
        uint256 rejectionCount,
        SubmissionStatus status
    ) {
        RiddleSubmission storage sub = submissions[submissionId];
        return (
            sub.submitter,
            sub.riddleQuestion,
            sub.category,
            sub.difficulty,
            sub.approvalCount,
            sub.rejectionCount,
            sub.status
        );
    }

    /**
     * @dev Get pending submissions count
     */
    function getPendingCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= submissionCounter; i++) {
            if (submissions[i].status == SubmissionStatus.Pending) {
                count++;
            }
        }
        return count;
    }
}
```

---

## Frontend Integration

### Submission Flow
1. User navigates to "Submit Riddle" page
2. Fills form:
   - Riddle question (encrypted before submission)
   - Answer (hashed with salt)
   - Category dropdown
   - Difficulty slider (1-10)
3. Connects wallet & approves 5 RDLN
4. Submits transaction
5. Receives submission ID
6. Can track status on "My Submissions" page

### Curator Dashboard
1. Curators see pending submissions
2. Review riddle quality:
   - Is it solvable?
   - Is it unique?
   - Appropriate difficulty?
   - Clear wording?
3. Vote approve/reject with optional comment
4. Earn 1 RON per approval vote

---

## Security Considerations

### Spam Prevention
- 5 RDLN submission fee (burned if rejected)
- Rate limit: 1 submission per address per week
- Minimum account age (optional)

### Quality Control
- Multi-curator approval (3 of 5)
- Curators elected by RON holders
- Curator performance tracked
- Community can challenge decisions

### Answer Security
- Answers hashed before submission
- Salt added to prevent rainbow tables
- Revealed only after riddle goes live
- Verify hash matches on reveal

---

## Rewards Economics

### For Submitters
- 10% of riddle's prize pool if approved
- Example: 10M RDLN prize pool → 1M RDLN to submitter
- Encourages high-quality submissions

### For Curators
- 1 RON per approval vote
- Reputation boost in RON system
- Monthly top curator bonus
- Path to governance role

---

## Migration Path

### Week 1-4: Deploy & Test
- Deploy RiddleSubmissionManager
- Appoint initial 5 curators
- Test with small submissions

### Week 5-12: Hybrid Operation
- Admin creates 50% of riddles
- Community submits 50% of riddles
- Monitor quality

### Week 13+: Full Community
- 100% community-submitted riddles
- Curators handle all approvals
- Admin only for emergency

---

## Next Steps

1. ✅ Review this design document
2. [ ] Finalize submission fee amount (5 RDLN?)
3. [ ] Choose initial curators (trusted community members)
4. [ ] Implement `RiddleSubmissionManager.sol`
5. [ ] Add encryption library for riddle content
6. [ ] Build frontend submission form
7. [ ] Create curator dashboard
8. [ ] Test on testnet with real submissions
9. [ ] Launch on mainnet

---

**Questions to Answer:**
1. What should submission fee be? (5 RDLN? 10 RDLN?)
2. How many curators? (5? 7? 9?)
3. How to elect curators? (Admin appoints? RON vote?)
4. Submitter reward percentage? (10%? 5%? 15%?)
5. How to handle duplicate riddles?