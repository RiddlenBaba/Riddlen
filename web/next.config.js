/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // The old riddlen.com was indexed for a year. Keep those URLs alive.
  async redirects() {
    const home = ['/game', '/landing', '/quick-start', '/leaderboard', '/oracle-guide', '/dao-guide'];
    const winnings = ['/airdrop', '/airdrop-guide', '/winnings', '/dashboard'];
    const docs = ['/whitepaper', '/tokenomics', '/tokenomics-deep'];
    return [
      ...home.map((source) => ({ source, destination: '/', permanent: true })),
      { source: '/how-it-works', destination: '/how', permanent: true },
      { source: '/faq', destination: '/how', permanent: true },
      ...winnings.map((source) => ({ source, destination: '/me', permanent: true })),
      ...docs.map((source) => ({ source, destination: 'https://riddlen.org/', permanent: true })),
      { source: '/docs', destination: 'https://riddlen.org/', permanent: true },
      { source: '/docs/:path*', destination: 'https://riddlen.org/:path*', permanent: true },
    ];
  },
};
