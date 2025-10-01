---
layout: default
title: "Riddlen Farcaster Frames - Social Gaming on Warpcast"
description: "Play Riddlen directly in your Farcaster feed with interactive frames. Mint NFTs, solve riddles, share victories, and climb leaderboards - all without leaving Warpcast. 710K+ Farcaster users, gasless onboarding."
keywords: "farcaster frames, warpcast games, riddlen frames, social crypto gaming, gasless nft minting, farcaster integration, frames.js, riddle frames"
sitemap:
  priority: 0.9
  changefreq: 'weekly'
  lastmod: 2025-10-01
schema_type: "TechArticle"
---

# 🖼️ Riddlen Farcaster Frames

**Play Riddlen directly in your Farcaster feed**

**Status**: ✅ Live at frames.riddlen.com
**Platform**: Farcaster / Warpcast
**Reach**: 710,000+ potential users
**Tech**: Frames.js + Next.js + Polygon

---

## 🎯 What Are Farcaster Frames?

**Farcaster Frames** are interactive mini-apps that live directly in your social feed on Warpcast (the main Farcaster client). Instead of clicking links to external websites, you interact with apps using buttons inside posts.

### Traditional Flow (Old Way)
```
See post → Click link → Leave Warpcast → Visit website → Connect wallet → Play game
```

### Frames Flow (New Way)
```
See frame → Click button → Play in feed → Share result → Never leave Warpcast
```

**Result**: 10x better user experience, viral sharing, and massive reach (710K+ Farcaster users).

---

## 🎮 Riddlen Frame Experience

### 7 Interactive Frames

#### 1. 🧩 Riddle Frame
**Browse and select riddles to play**

Features:
- Live riddle data from blockchain
- Shows difficulty, prize pool, winners count
- NFT mint counter (750 remaining!)
- Beautiful dynamic Open Graph images

What you see:
```
🧩 Active Riddle #42

Difficulty: MEDIUM
Prize Pool: 5,000 RDLN
NFTs Minted: 250/1000
Solved By: 89 players

[View Details] [Mint NFT]
```

**URL**: `https://frames.riddlen.com/frames/riddle`

---

#### 2. 💎 Mint Frame
**Mint riddle NFTs with gasless sponsorship**

Features:
- **First 3 mints FREE** (gas sponsored)
- One-click minting from feed
- Transaction status tracking
- Automatic redirect after mint

What you see:
```
💎 Mint Riddle NFT

Riddle #42: "The Crypto Paradox"
Price: 100 RDLN

✨ Your first 3 mints are FREE!
(You have 2 free mints remaining)

[Mint Now] [Back to Riddle]
```

**Gasless Onboarding**: New users can mint without any tokens, reducing friction from "impossible" to "one click."

**URL**: `https://frames.riddlen.com/frames/mint`

---

#### 3. 🎯 Solve Frame
**Submit your riddle answers**

Features:
- Answer submission guide
- Link to full solve UI on riddlen.com
- Hints and tips
- Live difficulty rating

What you see:
```
🎯 Solve Riddle #42

You've minted the NFT! Now solve it:

1. Read the riddle carefully
2. Submit your answer
3. Win RDLN if correct!

[Solve on riddlen.com]
```

**Note**: Full answer submission happens on main site (better UX for complex inputs).

**URL**: `https://frames.riddlen.com/frames/solve`

---

#### 4. 🏆 Victory Frame
**Share your wins with the community**

Features:
- Auto-generated when you win
- Shows your rank, prize amount
- Viral sharing mechanic
- Beautiful celebration graphics

What you see:
```
🏆 Victory!

Alice solved Riddle #42!

Rank: #1 of 89 solvers
Prize: 5,000 RDLN
Time: 12 minutes

[Try This Riddle] [View Profile]
```

**Viral Loop**: Winners share → friends see → friends try → new winners → more shares

**URL**: `https://frames.riddlen.com/frames/victory?riddleId=42&winAmount=5000&userName=Alice&rank=1`

---

#### 5. 📊 Leaderboard Frame
**Top solvers and their stats**

Features:
- Live RON balances from blockchain
- Top 10 users displayed
- Total riddles solved
- Accuracy ratings

What you see:
```
📊 Top Riddlen Solvers

1. 🥇 CryptoWizard - 45,000 RON
2. 🥈 RiddleMaster - 38,500 RON
3. 🥉 BrainChain - 32,100 RON
...

[View My Stats] [Play Now]
```

**Competition**: See where you rank, push to climb higher.

**URL**: `https://frames.riddlen.com/frames/leaderboard`

---

#### 6. 👤 Profile Frame
**Your personal Riddlen stats**

Features:
- Total riddles solved
- RON balance and rank
- Accuracy rate
- Recent activity

What you see:
```
👤 Your Riddlen Profile

RON Balance: 5,500
Rank: #47 globally
Riddles Solved: 23
Accuracy: 82%

[Solve More] [View Full Profile]
```

**Gamification**: Track your progress, show off your skills.

**URL**: `https://frames.riddlen.com/frames/profile`

---

#### 7. 🎁 Airdrop Frame
**Check eligibility and claim rewards**

Features:
- Phase 1-3 status checking
- Remaining claimable amount
- One-click claiming
- Social proof verification

What you see:
```
🎁 Riddlen Airdrop

Your Status:
✅ Phase 1: 5,000 RDLN claimed
✅ Phase 2: 3,000 RDLN claimed
⏳ Phase 3: 2,000 RDLN claimable

[Claim Phase 3] [Learn More]
```

**Integration**: Seamlessly connects with [Airdrop system](airdrop.html).

**URL**: `https://frames.riddlen.com/frames/airdrop`

---

## 🚀 Gasless Onboarding

### The Onboarding Problem

**Traditional crypto gaming**:
1. Download wallet
2. Buy crypto on exchange
3. Transfer to wallet
4. Pay gas fees
5. Finally play game

**Result**: 95% of users drop off before playing.

---

### Our Solution: Gas Sponsorship

**First 3 mints are FREE** for every new user:

```
New User Flow:
1. See frame in Warpcast feed
2. Click "Mint NFT"
3. Sign with Farcaster ID (no wallet needed initially)
4. Get NFT instantly (gas paid by Riddlen)
5. Start solving riddles

Time: 30 seconds
Cost to user: $0
```

**How it works**:
- Riddlen backend detects new Farcaster users
- Sponsors gas for first 3 transactions
- Uses Biconomy/Gelato for relayer service
- After 3 mints, users pay own gas (or buy RDLN)

**Impact**:
- 📈 10x increase in conversion rate
- 🎯 Viral growth through social sharing
- 💰 Users experience value before spending
- 🏆 Lower barrier = more players = bigger prizes

---

## 📱 How to Access Frames

### On Warpcast Mobile App

1. **Find Riddlen**:
   - Search for @riddlen in Warpcast
   - Or visit our Farcaster channel
   - Look for frame posts

2. **Interact**:
   - Tap buttons in frame
   - No external websites
   - Everything in-feed

3. **Share**:
   - Recast frames to your followers
   - Quote cast with your thoughts
   - Create viral loops

### On Desktop (Warpcast Web)

1. Visit **warpcast.com**
2. Search for **@riddlen**
3. Click frames in feed
4. Same experience as mobile

### Direct Frame URLs

Developers and power users can access frames directly:
- Riddle: `https://frames.riddlen.com/frames/riddle`
- Leaderboard: `https://frames.riddlen.com/frames/leaderboard`
- Profile: `https://frames.riddlen.com/frames/profile?fid=YOUR_FID`

**Test frames**: Use [Frames.js Debugger](https://debugger.framesjs.org)

---

## 🌐 Why Farcaster?

### The Opportunity

**710,000+ Farcaster users** (and growing):
- Crypto-native audience
- Early adopters and builders
- High engagement rates
- Viral sharing culture

**Frames adoption**:
- Hundreds of successful frame apps
- Built-in viral mechanics
- No app download needed
- Direct monetization possible

### The Riddlen Fit

**Perfect match**:
- ✅ Smart, engaged audience (riddle lovers)
- ✅ Crypto-native (understand NFTs, tokens)
- ✅ Social sharing culture (victory frames)
- ✅ Mobile-first (play anywhere)
- ✅ Community-driven (matches our ethos)

**Growth potential**:
- Start: 100-500 users (first month)
- Growth: 2,000-5,000 users (6 months)
- Scale: 10,000+ users (1 year)

---

## 🔗 Integration with Riddlen Platform

### Frames as Discovery

**Frames drive traffic to main platform**:
1. User discovers Riddlen via frame in feed
2. Plays simple riddles in frames
3. Gets hooked on gameplay
4. Clicks through to riddlen.com for full experience
5. Becomes regular player

**Funnel**:
```
Farcaster Frame (700K potential)
     ↓
Quick Play in Feed (10% engage = 70K)
     ↓
Visit riddlen.com (5% convert = 3.5K)
     ↓
Regular Player (50% retain = 1.75K)
```

### Data Sync

**All frames use live blockchain data**:
- RON balances from Polygon
- Riddle metadata from contracts
- Leaderboard rankings (real-time)
- Airdrop eligibility (on-chain)

**No separate database**, ensuring consistency between frames and main platform.

---

## 💻 Technical Stack

### Built With

- **Framework**: Next.js 14 (App Router)
- **Frames SDK**: Frames.js v0.20+
- **Web3**: Wagmi v2 + Viem
- **Wallet**: RainbowKit (MetaMask, WalletConnect, Coinbase)
- **Blockchain**: Polygon Amoy Testnet
- **Images**: @vercel/og (dynamic generation)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel / PM2 on VPS

### Performance

**Response times** (cached):
- Riddle data: ~150ms
- Leaderboard: ~200ms
- Profile: ~180ms
- OG image generation: ~300ms

**All under 500ms target** ✅

### Contracts

**Live on Polygon Amoy**:
- **RDLN Token**: `0x133029184EC460F661d05b0dC57BFC916b4AB0eB`
- **RON Token**: `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635`
- **Riddle NFT**: `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3`
- **Oracle Network**: `0xBd005201294984eFf3c353c32c9E5a96Fd640493`
- **Airdrop v6**: `0x4f3f2202f3F865074f534aA324a259DF962C6FBA`

---

## 🎯 Social Sharing Mechanics

### Victory Frame Virality

**When you solve a riddle**:
1. Victory frame auto-generated
2. Shows your achievement
3. One-click share to feed
4. Followers see frame and try riddle
5. More players = bigger prizes
6. Repeat

**Example victory post**:
```
Just solved "The Crypto Paradox" on @riddlen! 🏆

Won 5,000 RDLN in 12 minutes
Ranked #1 out of 89 solvers

Think you can beat my time?
[Try This Riddle]
```

### Leaderboard Competition

**Weekly/monthly highlights**:
- Top solver of the week spotlight
- Biggest prize winner frame
- Fastest solve time frame
- Community celebrations

**Drives**:
- Competitive engagement
- Regular check-ins
- Social proof
- FOMO (fear of missing out)

### Referral Potential (Future)

**Planned feature**:
- Custom referral frames
- "Friend challenged you" frames
- 10% bonus for referrer and referee
- Leaderboard for top referrers

---

## 📊 Analytics & Growth

### Success Metrics

**Phase 1 (Months 1-3)**:
- 500+ users connect wallet
- 100+ NFTs minted via frames
- 50+ riddles solved
- 10+ daily active players

**Phase 2 (Months 4-6)**:
- 2,000+ total frame users
- 200+ daily active players
- 50+ organic shares per week
- 5+ new riddles shared weekly

**Phase 3 (Months 7-12)**:
- 10,000+ total users
- 1,000+ daily active players
- Self-sustaining viral growth
- Frame-native riddle creation

### Tracking

**On-chain metrics**:
```javascript
// Frame interaction stats
const frameViews = await analytics.getFrameViews('riddle');
const buttonClicks = await analytics.getButtonClicks('mint');
const conversions = await analytics.getConversions();

console.log(`Views: ${frameViews}`);
console.log(`Clicks: ${buttonClicks}`);
console.log(`Conversion rate: ${(conversions/frameViews*100).toFixed(2)}%`);
```

---

## 🛠️ For Developers

### Frame Metadata Example

Every frame includes Open Graph metadata:

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://frames.riddlen.com/api/og/riddle" />
<meta property="fc:frame:button:1" content="Mint NFT" />
<meta property="fc:frame:button:2" content="View Leaderboard" />
<meta property="fc:frame:post_url" content="https://frames.riddlen.com/frames/mint" />
```

### Button Actions

**Frames.js button configuration**:
```typescript
const frame = {
  image: <RiddleImage />,
  buttons: [
    {
      label: 'Mint NFT',
      action: 'post',
      target: '/frames/mint'
    },
    {
      label: 'Leaderboard',
      action: 'post',
      target: '/frames/leaderboard'
    }
  ]
};
```

### Contract Integration

**Reading blockchain data**:
```typescript
import { useContractRead } from 'wagmi';

const { data: riddleData } = useContractRead({
  address: RIDDLE_NFT_ADDRESS,
  abi: RiddleNFTABI,
  functionName: 'getCurrentRiddle',
  cacheTime: 60_000, // 60s cache
});
```

### Gas Sponsorship

**Backend service example**:
```typescript
// Check eligibility
const canSponsor = await checkGasEligibility(farcasterFID);

if (canSponsor) {
  // Sponsor the transaction
  const tx = await biconomy.sponsorTransaction({
    to: RIDDLE_NFT_ADDRESS,
    data: mintCalldata,
    from: userAddress
  });

  // Track usage
  await trackSponsoredMint(farcasterFID);
}
```

---

## 🎨 Frame Design Best Practices

### Image Requirements

**Farcaster specs**:
- Size: 1200x630px
- Format: PNG or JPEG
- Max size: 256KB
- Aspect ratio: 1.91:1

### Button Guidelines

**Do**:
- ✅ Clear action labels ("Mint NFT", "View Stats")
- ✅ 1-4 buttons max
- ✅ Logical flow (left to right)
- ✅ Call-to-action focused

**Don't**:
- ❌ Vague labels ("Click Here", "Submit")
- ❌ More than 4 buttons
- ❌ Confusing navigation
- ❌ Dead-end frames

### User Experience

**Frame UX principles**:
1. **Instant feedback**: Show results immediately
2. **Clear navigation**: Always offer next step
3. **No dead ends**: Every frame has exit path
4. **Mobile-first**: Most users on phones
5. **Fast loading**: Under 500ms ideal

---

## 🔗 Related Resources

### Documentation
- 📖 **[Riddlen Airdrop](airdrop.html)** - Earn while playing
- 🔮 **[Oracle Network](oracle-network.html)** - Validate and earn
- 🏛️ **[Governance](governance.html)** - Vote with RON

### External Links
- 🖼️ **[Farcaster Frames Spec](https://docs.farcaster.xyz/reference/frames/spec)** - Official documentation
- 🛠️ **[Frames.js](https://framesjs.org)** - Framework we use
- 📱 **[Warpcast](https://warpcast.com/~/developers/frames)** - Frame validator
- 🧪 **[Frames Debugger](https://debugger.framesjs.org)** - Test your frames

### Community
- 💬 **[Telegram](https://t.me/RiddlenCommunity)** - Join the conversation
- 🐦 **[Twitter/X](https://twitter.com/RiddlenToken)** - Latest updates
- 👥 **[Farcaster](https://warpcast.com/riddlen)** - Follow us on Warpcast

---

## 🤔 Frequently Asked Questions

### General Questions

**Q: Do I need a crypto wallet to play frames?**
A: Not initially! Your Farcaster ID works for gasless mints. You'll need a wallet for claims/withdrawals later.

**Q: Are frames available on all Farcaster clients?**
A: Primarily optimized for Warpcast (most popular). Other clients may have varying support.

**Q: Can I play frames on desktop?**
A: Yes! Visit warpcast.com on desktop and interact with frames in feed.

### Gasless Minting Questions

**Q: How many free mints do I get?**
A: First 3 mints are free per Farcaster user. After that, you pay gas.

**Q: What happens after my 3 free mints?**
A: You'll need RDLN tokens and Polygon MATIC for gas. But you've likely earned RDLN by then!

**Q: Is there a daily limit on free mints?**
A: Yes, 100 sponsored mints per day platform-wide. Early users get priority.

### Frame-Specific Questions

**Q: Why do some buttons redirect to riddlen.com?**
A: Complex interactions (answer submission) work better on full site. Frames are for discovery.

**Q: Can I create my own Riddlen frames?**
A: Not yet, but we're exploring community frame creation. Join Telegram for updates.

**Q: Do frame stats sync with my main account?**
A: Yes! Everything reads from blockchain, so your stats are consistent everywhere.

### Technical Questions

**Q: Which blockchain do frames use?**
A: Polygon Amoy testnet currently. Mainnet after thorough testing.

**Q: What wallets are supported?**
A: MetaMask, WalletConnect, Coinbase Wallet, and any injected Web3 wallet.

**Q: Can I build on top of Riddlen frames?**
A: Absolutely! All smart contracts are open source. Check our [GitHub](https://github.com/RiddlenBaba/riddlen).

---

## 🎉 Get Started

### For Players

1. **Download Warpcast**: [iOS](https://apps.apple.com/app/farcaster/id1600555445) | [Android](https://play.google.com/store/apps/details?id=com.farcaster.mobile)
2. **Create Farcaster account**: Set up username and profile
3. **Find Riddlen**: Search @riddlen or visit our channel
4. **Click a frame**: Start playing immediately
5. **Share your wins**: Build reputation and earn

### For Developers

1. **Clone repo**: `git clone https://github.com/RiddlenBaba/riddlen`
2. **Install deps**: `cd riddlen-frames && npm install`
3. **Run local**: `npm run dev`
4. **Test frames**: Use frames.js debugger
5. **Deploy**: Vercel or custom VPS

### For Creators

1. **Join community**: Telegram or Discord
2. **Propose riddles**: Share your best puzzles
3. **Create frames**: Custom victory frames (coming soon)
4. **Earn rewards**: Creator incentives program (planned)

---

## 🚀 The Future of Social Gaming

Riddlen Farcaster Frames represent a **new paradigm in social crypto gaming**:

- ✅ **Zero friction onboarding** (gasless mints)
- ✅ **Viral by design** (social sharing built-in)
- ✅ **Play-and-earn** (not pay-to-win)
- ✅ **Community-first** (fair distribution)
- ✅ **Mobile-native** (play anywhere)

**710,000+ potential players** are already on Farcaster, crypto-native and ready to engage. Riddlen frames bring intelligent gaming to their feed, creating a sustainable play-and-earn ecosystem powered by human intelligence.

---

**Join us on Farcaster and start solving riddles today!** 🧩

Find us at **@riddlen** on Warpcast and experience the future of social crypto gaming.

*Frames: frames.riddlen.com • Platform: Farcaster/Warpcast*
*Last updated: October 2025 • Riddlen Protocol v6.0*
