import { createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const CHAIN = polygonAmoy;

export const config = createConfig({
  chains: [CHAIN],
  connectors: [injected()],
  transports: { [CHAIN.id]: http(process.env.NEXT_PUBLIC_AMOY_RPC_URL || 'https://polygon-amoy-bor-rpc.publicnode.com') },
  ssr: true,
});

export const CONTRACTS = {
  STUMP: process.env.NEXT_PUBLIC_STUMP_ADDRESS || '0x660cEF782AEc87b0667De610B2077A9A4B81dB14',
  FAUCET: process.env.NEXT_PUBLIC_FAUCET_ADDRESS || '0xb6860Af03bb0FbD9b63322a7EbDaC29fd9aB7f7E',
  RDLN: process.env.NEXT_PUBLIC_RDLN_ADDRESS || '0x133029184EC460F661d05b0dC57BFC916b4AB0eB',
};

export const EXPLORER = 'https://amoy.polygonscan.com';
