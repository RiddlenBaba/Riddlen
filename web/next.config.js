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
      { source: '/how-it-works', destination: 'https://riddlen.org/hunt/', permanent: true },
      { source: '/faq', destination: 'https://riddlen.org/hunt/', permanent: true },
      { source: '/how', destination: 'https://riddlen.org/hunt/', permanent: false },
      { source: '/write', destination: '/', permanent: false },
      { source: '/hunt', destination: '/', permanent: false },
      { source: '/hunt/:id', destination: '/r/:id', permanent: false },
      ...winnings.map((source) => ({ source, destination: '/me', permanent: true })),
      ...docs.map((source) => ({ source, destination: 'https://riddlen.org/', permanent: true })),
      { source: '/docs', destination: 'https://riddlen.org/', permanent: true },
      { source: '/docs/:path*', destination: 'https://riddlen.org/:path*', permanent: true },
    ];
  },
};
