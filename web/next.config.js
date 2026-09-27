/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // The old riddlen.com was indexed for a year. Keep those URLs alive.
  async redirects() {
    const home = ['/game', '/landing', '/how-it-works', '/quick-start', '/faq', '/dashboard', '/leaderboard', '/oracle-guide', '/dao-guide'];
    const winnings = ['/airdrop', '/airdrop-guide'];
    const docs = ['/whitepaper', '/tokenomics', '/tokenomics-deep'];
    return [
      ...home.map((source) => ({ source, destination: '/', permanent: true })),
      ...winnings.map((source) => ({ source, destination: '/winnings', permanent: true })),
      ...docs.map((source) => ({ source, destination: 'https://riddlen.org/', permanent: true })),
      { source: '/docs', destination: 'https://riddlen.org/', permanent: true },
      { source: '/docs/:path*', destination: 'https://riddlen.org/:path*', permanent: true },
    ];
  },
};
