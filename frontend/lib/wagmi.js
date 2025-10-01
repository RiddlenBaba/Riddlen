import { createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id';

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    metaMask(),
    walletConnect({
      projectId,
      metadata: {
        name: 'Riddlen',
        description: 'The Web3 Riddle Economy',
        url: 'https://riddlen.org',
        icons: ['https://riddlen.org/logo.png']
      }
    }),
    coinbaseWallet({
      appName: 'Riddlen',
      appLogoUrl: 'https://riddlen.org/logo.png'
    }),
  ],
  transports: {
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology/')
  },
});

export const CONTRACTS = {
  RDLN: "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
  RON: "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
  RIDDLE_NFT: "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3",
  AIRDROP: "0x330275259AfCeC8822A861ecbbdfD026dB1B0A13"
};

export const NETWORK_CONFIG = {
  chainId: 80002,
  name: 'Polygon Amoy Testnet',
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
};