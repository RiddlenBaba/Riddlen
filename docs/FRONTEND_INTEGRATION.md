# 🎮 Frontend Integration Guide

## **Riddlen v6.0 Testnet Integration**

Ready to build the frontend for the revolutionary Riddlen ecosystem? This guide covers everything you need to integrate with our live testnet contracts.

---

## **🔗 Quick Start**

### **Network Configuration**
```javascript
// Polygon Amoy Testnet
const networkConfig = {
  chainId: 80002,
  name: 'Polygon Amoy Testnet',
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  }
}
```

### **Contract Addresses**
```javascript
const CONTRACTS = {
  RDLN: "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
  RON: "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
  RIDDLE_NFT: "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3"
}
```

---

## **🎯 Core Features to Implement**

### **1. Tiered Reward System**

The heart of Riddlen v5.1 - show users exactly what they'll earn based on solve position:

```javascript
// Preview tiered rewards before solving
async function previewRewards(prizePool, totalWinners, solvePosition) {
  const riddleNFT = new ethers.Contract(CONTRACTS.RIDDLE_NFT, RiddleNFTABI, signer)

  const reward = await riddleNFT.previewTieredReward(
    ethers.parseEther(prizePool.toString()),
    totalWinners,
    solvePosition
  )

  return ethers.formatEther(reward)
}

// Example: Show user what they'd earn in each tier
const tier1Reward = await previewRewards("1000000", 20, 3)  // Position 3 = Tier 1
const tier2Reward = await previewRewards("1000000", 20, 10) // Position 10 = Tier 2
const tier3Reward = await previewRewards("1000000", 20, 18) // Position 18 = Tier 3

console.log(`Tier 1: ${tier1Reward} RDLN`)
console.log(`Tier 2: ${tier2Reward} RDLN`)
console.log(`Tier 3: ${tier3Reward} RDLN`)
```

**UI Suggestion**: Create a dynamic reward calculator that shows:
- "Solve now and earn ~88,888 RDLN (Tier 1)"
- "15 positions left in Tier 1 - hurry!"

### **2. RON Tier System**

Show users their progression path and access levels:

```javascript
// Check user's current tier and progression
async function getUserProgression(userAddress) {
  const ron = new ethers.Contract(CONTRACTS.RON, RONABI, provider)

  const ronBalance = await ron.balanceOf(userAddress)
  const currentTier = await ron.getUserTier(userAddress)
  const nextTierRequirement = await ron.getNextTierRequirement(userAddress)

  return {
    ronBalance: ethers.formatEther(ronBalance),
    currentTier: getTierName(currentTier),
    nextTierRequirement: ethers.formatEther(nextTierRequirement),
    canAccessMedium: currentTier >= 1, // SOLVER tier
    canAccessHard: currentTier >= 2,   // EXPERT tier
    canAccessOracle: currentTier >= 3  // ORACLE tier
  }
}

function getTierName(tierNumber) {
  const tiers = ["NEWCOMER", "SOLVER", "EXPERT", "ORACLE"]
  return tiers[tierNumber] || "UNKNOWN"
}
```

**UI Suggestion**: Progress bar showing:
- "SOLVER (1,247/1,000 RON) → EXPERT (0/10,000 RON needed)"
- Locked/unlocked riddle difficulty indicators

### **3. Treasury Transparency**

Build trust by showing the rug-proof treasury system in action:

```javascript
// Get treasury transparency info
async function getTreasuryInfo() {
  const rdln = new ethers.Contract(CONTRACTS.RDLN, RDLNABI, provider)

  const [
    monthlyAmount,
    daysUntilNext,
    emergenciesUsed,
    daysUntilEmergency,
    maxEmergency,
    nextTimestamp
  ] = await rdln.getSupplyProtectionInfo()

  return {
    monthlyReleaseAmount: ethers.formatEther(monthlyAmount),
    daysUntilNextRelease: daysUntilNext.toString(),
    totalEmergencyUsed: ethers.formatEther(emergenciesUsed),
    daysUntilEmergencyAvailable: daysUntilEmergency.toString(),
    maxEmergencyPerYear: ethers.formatEther(maxEmergency),
    nextReleaseDate: new Date(Number(nextTimestamp) * 1000)
  }
}

// Check if monthly release can be executed (and execute it!)
async function executeMonthlyRelease() {
  const rdln = new ethers.Contract(CONTRACTS.RDLN, RDLNABI, signer)

  const canExecute = await rdln.canExecuteMonthlyRelease()

  if (canExecute) {
    const tx = await rdln.executeMonthlyOperationsRelease()
    await tx.wait()
    console.log("Monthly release executed! 1M RDLN released to operations.")
    return true
  }

  return false
}
```

**UI Suggestion**: Treasury dashboard showing:
- "Next release: 1,000,000 RDLN in 23 days"
- "Holder protection: Max 5M emergency/year (0 used)"
- Button to execute releases when ready

### **4. Complete User Journey**

Guide users through the full Riddlen experience:

```javascript
// Step 1: Check user's starting point
async function getUserStartingPoint(userAddress) {
  const progression = await getUserProgression(userAddress)
  const rdlnBalance = await getRDLNBalance(userAddress)

  if (rdlnBalance === 0) {
    return "NEED_RDLN" // Direct to faucet/DEX
  }

  if (progression.currentTier === "NEWCOMER") {
    return "START_EASY" // Direct to EASY riddles
  }

  return "CHOOSE_DIFFICULTY" // Show all available options
}

// Step 2: Mint riddle access
async function mintRiddleAccess(sessionId) {
  const riddleNFT = new ethers.Contract(CONTRACTS.RIDDLE_NFT, RiddleNFTABI, signer)

  // Get mint cost first
  const session = await riddleNFT.riddleSessions(sessionId)
  const mintCost = session.currentMintCost

  // Approve RDLN spending
  const rdln = new ethers.Contract(CONTRACTS.RDLN, RDLNABI, signer)
  await rdln.approve(CONTRACTS.RIDDLE_NFT, mintCost)

  // Mint access NFT
  const tx = await riddleNFT.mintRiddleAccess(sessionId)
  const receipt = await tx.wait()

  // Find the token ID from events
  const event = receipt.logs.find(log =>
    log.topics[0] === ethers.id("RiddleAccessMinted(uint256,uint256,address,uint256)")
  )

  return ethers.parseInt(event.topics[2]) // tokenId
}

// Step 3: Submit answer (with anti-cheat delay)
async function submitAnswer(sessionId, questionIndex, answer, tokenId) {
  const riddleNFT = new ethers.Contract(CONTRACTS.RIDDLE_NFT, RiddleNFTABI, signer)

  // Check anti-cheat timing
  const participant = await riddleNFT.participantData(tokenId)
  const timeSinceAccess = Date.now() / 1000 - participant.accessTime

  if (timeSinceAccess < 30) {
    const waitTime = 30 - Math.floor(timeSinceAccess)
    throw new Error(`Please wait ${waitTime} more seconds before submitting`)
  }

  // Submit answer
  const answerHash = ethers.keccak256(ethers.toUtf8Bytes(answer))
  const tx = await riddleNFT.submitAnswer(sessionId, questionIndex, answerHash)

  return await tx.wait()
}
```

---

## **🎨 UI/UX Recommendations**

### **Tiered Rewards Display**
```jsx
function TierRewardDisplay({ prizePool, totalWinners, currentPosition }) {
  return (
    <div className="tier-rewards">
      <h3>🎯 Solve Fast, Earn More!</h3>

      <div className="tier tier-1">
        <span className="tier-label">🥇 Tier 1 (Top 25%)</span>
        <span className="multiplier">2.0x</span>
        <span className="reward">{calculateReward(prizePool, totalWinners, 1)} RDLN</span>
      </div>

      <div className="tier tier-2">
        <span className="tier-label">🥈 Tier 2 (Middle 50%)</span>
        <span className="multiplier">1.0x</span>
        <span className="reward">{calculateReward(prizePool, totalWinners, 10)} RDLN</span>
      </div>

      <div className="tier tier-3">
        <span className="tier-label">🥉 Tier 3 (Bottom 25%)</span>
        <span className="multiplier">0.5x</span>
        <span className="reward">{calculateReward(prizePool, totalWinners, 18)} RDLN</span>
      </div>

      <div className="current-position">
        You're solving for position ~{currentPosition}
      </div>
    </div>
  )
}
```

### **RON Progression Display**
```jsx
function RONProgressDisplay({ userProgression }) {
  return (
    <div className="ron-progression">
      <h3>🏆 Your Intelligence Level</h3>

      <div className="current-tier">
        <span className="tier-badge">{userProgression.currentTier}</span>
        <span className="ron-balance">{userProgression.ronBalance} RON</span>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{width: calculateProgress(userProgression)}}></div>
      </div>

      <div className="unlocked-features">
        <div className={userProgression.canAccessMedium ? "unlocked" : "locked"}>
          🧩 Medium Riddles
        </div>
        <div className={userProgression.canAccessHard ? "unlocked" : "locked"}>
          🔥 Hard Riddles
        </div>
        <div className={userProgression.canAccessOracle ? "unlocked" : "locked"}>
          🌟 Oracle Network
        </div>
      </div>
    </div>
  )
}
```

### **Anti-Cheat Timer**
```jsx
function AntiCheatTimer({ timeRemaining }) {
  if (timeRemaining <= 0) {
    return <button className="submit-answer">Submit Answer</button>
  }

  return (
    <div className="anti-cheat-timer">
      <div className="timer-display">{timeRemaining}s</div>
      <div className="timer-message">
        ⏳ Think carefully... {timeRemaining} seconds remaining
      </div>
    </div>
  )
}
```

---

## **🧪 Testing Workflow**

### **Complete User Journey Test**
```javascript
async function testCompleteJourney() {
  console.log("🧪 Testing complete Riddlen journey...")

  // 1. Get test tokens from faucet
  console.log("1. Getting RDLN tokens...")
  // (Implement faucet integration or DEX swap)

  // 2. Start with EASY riddle
  console.log("2. Minting EASY riddle access...")
  const tokenId = await mintRiddleAccess(easySessionId)

  // 3. Wait for anti-cheat delay
  console.log("3. Waiting for anti-cheat delay...")
  await new Promise(resolve => setTimeout(resolve, 30000))

  // 4. Submit correct answer
  console.log("4. Submitting answer...")
  await submitAnswer(easySessionId, 0, "correct_answer", tokenId)

  // 5. Check rewards and RON earned
  console.log("5. Checking rewards...")
  const newProgression = await getUserProgression(userAddress)
  console.log(`Earned RON! New tier: ${newProgression.currentTier}`)

  // 6. Try MEDIUM riddle if unlocked
  if (newProgression.canAccessMedium) {
    console.log("6. MEDIUM riddles now unlocked!")
  }

  console.log("✅ Complete journey test successful!")
}
```

---

## **📱 Key Frontend Features**

### **Must-Have Features**
- ✅ **Tiered reward calculator** - Show earning potential
- ✅ **RON progression tracker** - Gamify the experience
- ✅ **Anti-cheat timer** - 30-second solve delay
- ✅ **Treasury transparency** - Build holder trust
- ✅ **Difficulty progression** - Clear unlock path

### **Nice-to-Have Features**
- 🎨 **Reward animations** - Celebrate tier achievements
- 📊 **Leaderboards** - Show top solvers
- 🔔 **Monthly release notifications** - Community engagement
- 📈 **Personal stats** - Track solving history
- 🎯 **Strategy tips** - Help users optimize rewards

---

## **🚀 Next Steps**

1. **Set up wallet connection** with Polygon Amoy
2. **Implement tiered reward display** - This is the killer feature!
3. **Build RON progression UI** - Show the unlock journey
4. **Add treasury transparency** - Build trust and community
5. **Test complete user flow** - EASY → MEDIUM → HARD progression

**Ready to revolutionize riddle gaming? The contracts are live and waiting for your frontend magic!**

---

## **💡 Questions & Support**

- **Contracts**: All deployed and verified on Polygonscan
- **ABIs**: Available in `/artifacts/contracts/` directory
- **Tests**: See working examples in `/test/` directory
- **Issues**: Open GitHub issues for technical questions

**Let's build the future of intelligence-based gaming together! 🧠⚡**