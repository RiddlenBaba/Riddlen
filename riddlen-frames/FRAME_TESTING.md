# Farcaster Frame Testing Guide

## Testing Tools

### 1. Frames.js Debugger (Recommended)
The official frames.js debugger lets you test your frames interactively:

**URL:** https://debugger.framesjs.org

**How to use:**
1. Open https://debugger.framesjs.org in your browser
2. Enter your frame URL: `https://frames.riddlen.com/frames/riddle`
3. Click buttons to test navigation
4. View frame metadata and responses
5. Test transactions and interactions

### 2. Warpcast Frame Validator
Validate your frame meets Farcaster specifications:

**URL:** https://warpcast.com/~/developers/frames

**How to use:**
1. Go to https://warpcast.com/~/developers/frames
2. Enter your frame URL: `https://frames.riddlen.com/frames/riddle`
3. View validation results and warnings
4. Test in Warpcast mobile app

### 3. Farcaster Frame SDK (Integrated)
We've installed `@farcaster/frame-sdk` which provides:
- Context detection (is the frame running in Farcaster?)
- User authentication
- Wallet integration
- Transaction signing

## Available Frames

All frames are accessible at `https://frames.riddlen.com/frames/`:

1. **Riddle** - `/frames/riddle` - Main entry point, shows live riddle data
2. **Mint** - `/frames/mint` - NFT minting interface with transaction handler
3. **Solve** - `/frames/solve` - Riddle solution submission
4. **Leaderboard** - `/frames/leaderboard` - Top solvers with RON balances
5. **Profile** - `/frames/profile` - User stats and wallet info

## Testing in Warpcast

### Method 1: Cast with Frame
1. Create a cast in Warpcast
2. Include your frame URL: `https://frames.riddlen.com/frames/riddle`
3. Warpcast will automatically detect and render the frame
4. Test button interactions directly in the cast

### Method 2: Direct URL
1. Open Warpcast mobile app
2. Paste frame URL in a message
3. Frame will render inline

## Local Testing

Run the debugger helper:
```bash
npm run frames
```

This will display:
- Frames.js debugger URL
- Your production frame URL

## Frame Metadata

Each frame includes proper Open Graph tags:
- `fc:frame` - Frame version
- `fc:frame:image` - Frame preview image
- `fc:frame:button:1` - Button definitions
- `fc:frame:post_url` - Action endpoints

## Transaction Testing

The mint frame (`/frames/mint`) includes a transaction handler:
- Route: `/frames/mint/tx`
- Returns transaction data for NFT minting
- Users can sign transactions in their wallet
- Uses Polygon Amoy testnet

## Blockchain Integration

All frames fetch real-time data from:
- **RDLN Token:** `0x133029184EC460F661d05b0dC57BFC916b4AB0eB`
- **RON Token:** `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635`
- **Riddle NFT:** `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3`
- **Network:** Polygon Amoy Testnet (Chain ID: 80002)

## Troubleshooting

### Buttons not working?
- Check frame metadata is correct
- Verify button targets are valid routes
- Test in frames.js debugger first

### Images not loading?
- Ensure images are publicly accessible
- Check image URLs return 200 status
- Verify Content-Type headers

### Transactions failing?
- Confirm user has MATIC for gas
- Check contract addresses are correct
- Verify user is on Polygon Amoy testnet

## Quick Test Command

```bash
# Test riddle frame
curl -I https://frames.riddlen.com/frames/riddle

# Test mint frame
curl -I https://frames.riddlen.com/frames/mint

# Test leaderboard
curl -I https://frames.riddlen.com/frames/leaderboard
```

All should return `200 OK`
