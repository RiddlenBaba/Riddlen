# 🧠 Riddlen Devlog

**On-chain microblog for the Riddlen development journey**

## Overview

An immutable, on-chain devlog where we document our development progress, technical decisions, milestones, and lessons learned. Built with Next.js and stored permanently on Polygon blockchain.

## Features

- ✅ **On-chain storage**: Posts are immutable and stored on Polygon
- ✅ **Markdown support**: Rich text formatting
- ✅ **Categories & tags**: Organize by topic
- ✅ **Public read**: Anyone can view the devlog
- ✅ **Authenticated write**: Only authorized wallets can post
- ✅ **Block timestamps**: Each post records block number and timestamp
- ✅ **Beautiful UI**: Clean microblog interface

## Tech Stack

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Wagmi v2**: Ethereum React hooks
- **Viem**: Lightweight Web3 client
- **Tailwind CSS**: Styling
- **React Markdown**: Markdown rendering
- **Solidity**: Smart contract

## Quick Start

### 1. Deploy Smart Contract

```bash
cd /var/www/riddlen/contracts
npx hardhat run scripts/deploy-devlog.js --network polygonAmoy
```

### 2. Configure Environment

Update `.env.local`:
```env
NEXT_PUBLIC_DEVLOG_CONTRACT=0x... # Your deployed contract
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

### 3. Install Dependencies

```bash
cd /var/www/riddlen/riddlen-devlog
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3004

## Production Deployment

### Build & Start

```bash
npm run build
npm start
```

### PM2 (Recommended)

```bash
npm run build
pm2 start npm --name riddlen-devlog -- start
pm2 save
```

### Nginx Configuration

Create `/etc/nginx/sites-available/devlog.riddlen.com`:

```nginx
server {
    listen 80;
    server_name devlog.riddlen.com;

    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/devlog.riddlen.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate

```bash
sudo certbot --nginx -d devlog.riddlen.com
```

### DNS Configuration

Add A record:
- Host: `devlog`
- Points to: Your server IP

## Smart Contract

### RiddlenDevlog.sol

**Key Features**:
- UUPS upgradeable pattern
- Role-based access control (WRITER_ROLE, ADMIN_ROLE)
- Immutable posts (no edits or deletes)
- Categories and tags for organization
- Efficient pagination
- Event emissions for indexing

**Functions**:
- `createPost(title, content, category, tags)`: Create new post
- `getTotalPosts()`: Get total post count
- `getPost(postId)`: Get specific post
- `getRecentPosts(offset, limit)`: Get paginated posts
- `getPostsByCategory(category)`: Filter by category
- `getPostsByTag(tag)`: Filter by tag

## Categories

- `general`: General updates
- `oracle`: Oracle Network development
- `dao`: DAO governance updates
- `nft`: NFT system changes
- `frames`: Farcaster Frames work
- `milestone`: Major achievements
- `technical`: Technical decisions

## Usage Example

### Writing a Post

1. Connect your wallet (must have WRITER_ROLE)
2. Click "Write New Post"
3. Fill in:
   - **Title**: "Deployed Oracle Network v1.0"
   - **Category**: oracle
   - **Tags**: milestone, v6.0, launch
   - **Content** (markdown):
   ```markdown
   ## What We Built

   Successfully deployed RiddlenOracleNetwork to Polygon Amoy!

   **Features**:
   - Enterprise data validation
   - RON-based validator system
   - Consensus mechanism
   - Fee distribution

   Contract: `0x123...abc`

   Next steps: Testnet integration and first validation request.
   ```
4. Click "Publish to Blockchain"
5. Sign transaction in wallet
6. Wait for confirmation (immutable forever!)

## Adding Writers

Only contract admin can add new writers:

```solidity
// In Hardhat console or script
const devlog = await ethers.getContractAt("RiddlenDevlog", CONTRACT_ADDRESS);
await devlog.addWriter("0xWriterAddress");
```

## Development Philosophy

This devlog is:
- **Transparent**: Public development in the open
- **Immutable**: History can't be rewritten
- **Permanent**: Stored on blockchain forever
- **Honest**: Documenting failures and successes

## Live Links

- **Production**: https://devlog.riddlen.com (after deployment)
- **Contract**: https://amoy.polygonscan.com/address/[CONTRACT]
- **Testnet Faucet**: https://faucet.polygon.technology/

## License

MIT

---

Built with 💙 by the Riddlen team
