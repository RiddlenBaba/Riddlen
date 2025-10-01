import { createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { metaMask, walletConnect, coinbaseWallet, injected } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId,
      metadata: {
        name: 'Riddlen Frames',
        description: 'Farcaster Frames for Riddlen',
        url: 'https://frames.riddlen.com',
        icons: ['https://riddlen.com/logo.png']
      }
    }),
    coinbaseWallet({
      appName: 'Riddlen Frames',
      appLogoUrl: 'https://riddlen.com/logo.png'
    }),
  ],
  transports: {
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology/')
  },
});
