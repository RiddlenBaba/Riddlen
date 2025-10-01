import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../lib/providers';

export const metadata: Metadata = {
  title: 'Riddlen - Solve Riddles, Earn Crypto',
  description: 'Play Riddlen on Farcaster. Mint NFTs, solve riddles, and earn RDLN tokens on Polygon.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
