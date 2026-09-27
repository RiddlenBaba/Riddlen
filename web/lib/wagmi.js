import { createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const CHAIN = polygonAmoy;

// Every installed wallet announces itself (EIP-6963) and shows up as its own connector, so
// MetaMask, Rabby, Crypto.com and friends are all offered instead of whichever injected first.
// A generic "Browser wallet" is kept for wallets that don't announce. WalletConnect covers
// phones when a project id is configured.
const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const config = createConfig({
  chains: [CHAIN],
  connectors: [
    injected({ shimDisconnect: true }),
    ...(wcProjectId ? [walletConnect({
      projectId: wcProjectId,
      metadata: { name: 'Riddlen', description: 'Riddles the machines could not solve', url: 'https://riddlen.com', icons: [] },
      showQrModal: true,
    })] : []),
  ],
  multiInjectedProviderDiscovery: true,
  transports: { [CHAIN.id]: http(process.env.NEXT_PUBLIC_AMOY_RPC_URL || 'https://polygon-amoy-bor-rpc.publicnode.com') },
  ssr: true,
});

export const CONTRACTS = {
  STUMP: process.env.NEXT_PUBLIC_STUMP_ADDRESS || '0x660cEF782AEc87b0667De610B2077A9A4B81dB14',
  FAUCET: process.env.NEXT_PUBLIC_FAUCET_ADDRESS || '0xb6860Af03bb0FbD9b63322a7EbDaC29fd9aB7f7E',
  RDLN: process.env.NEXT_PUBLIC_RDLN_ADDRESS || '0x133029184EC460F661d05b0dC57BFC916b4AB0eB',
  RON: process.env.NEXT_PUBLIC_RON_ADDRESS || '0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635',
};

export const EXPLORER = 'https://amoy.polygonscan.com';
export const GAS_FAUCET = 'https://faucet.polygon.technology/';
