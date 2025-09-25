import { useState } from 'react';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/introduction' },
      { title: 'How to Play', href: '/docs/how-to-play' },
      { title: 'Quick Start', href: '/docs/quick-start' },
    ]
  },
  {
    title: 'Game Mechanics',
    items: [
      { title: 'Riddle NFTs', href: '/docs/riddle-nfts' },
      { title: 'Solving Process', href: '/docs/solving-process' },
      { title: 'Rewards System', href: '/docs/rewards-system' },
    ]
  },
  {
    title: 'Tokenomics',
    items: [
      { title: 'RDLN Token', href: '/docs/rdln-token' },
      { title: 'Burn Protocol', href: '/docs/burn-protocol' },
      { title: 'Distribution', href: '/docs/distribution' },
    ]
  },
  {
    title: 'Platform',
    items: [
      { title: 'Smart Contracts', href: '/docs/smart-contracts' },
      { title: 'Security', href: '/docs/security' },
      { title: 'API Reference', href: '/docs/api-reference' },
    ]
  },
  {
    title: 'Community',
    items: [
      { title: 'Governance', href: '/docs/governance' },
      { title: 'Roadmap', href: '/docs/roadmap' },
      { title: 'Contributing', href: '/docs/contributing' },
    ]
  }
];

export default function DocsLayout({ children, currentPath = '' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const address = useAddress();

  return (
    <div className="min-h-screen text-white" style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 30%, #16213e 70%, #0f0f0f 100%)'
    }}>
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20% left-10% opacity-10">
          <div className="text-6xl animate-pulse" style={{
            animation: 'float 8s ease-in-out infinite',
            color: 'rgba(255, 215, 0, 0.1)'
          }}>🧩</div>
        </div>
        <div className="absolute top-60% right-20% opacity-10">
          <div className="text-6xl animate-pulse" style={{
            animation: 'float 8s ease-in-out infinite 2s',
            color: 'rgba(255, 215, 0, 0.1)'
          }}>🔐</div>
        </div>
        <div className="absolute bottom-20% left-20% opacity-10">
          <div className="text-6xl animate-pulse" style={{
            animation: 'float 8s ease-in-out infinite 4s',
            color: 'rgba(255, 215, 0, 0.1)'
          }}>💎</div>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50" style={{
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
      }}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold" style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF6347)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
              }}>
                RIDDLEN
              </span>
              <span className="text-sm text-gray-400 font-semibold">DOCS</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://riddlen.org"
              target="_blank"
              className="text-sm text-gray-300 hover:text-yellow-400 transition-colors relative"
            >
              Play Game
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 hover:w-full"></span>
            </a>
            <ConnectWallet theme="dark" />
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 pt-16 lg:pt-0
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `} style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 215, 0, 0.1)'
        }}>
          <div className="h-full overflow-y-auto px-4 py-6">
            <nav className="space-y-8">
              {navigation.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{
                    color: '#FFD700',
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                  }}>
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className={`
                            block px-3 py-2 rounded-md text-sm transition-all duration-300 relative
                            ${currentPath === item.href
                              ? 'text-yellow-400'
                              : 'text-gray-300 hover:text-white'
                            }
                          `}
                          style={currentPath === item.href ? {
                            background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
                            textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                          } : {}}
                          onMouseEnter={(e) => {
                            if (currentPath !== item.href) {
                              e.target.style.background = 'rgba(255, 215, 0, 0.05)';
                              e.target.style.border = '1px solid rgba(255, 215, 0, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPath !== item.href) {
                              e.target.style.background = 'transparent';
                              e.target.style.border = '1px solid transparent';
                            }
                          }}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>

        {/* Table of Contents (right sidebar for larger screens) */}
        <aside className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-20 p-6">
            <h4 className="text-sm font-semibold text-gray-400 mb-4">ON THIS PAGE</h4>
            <div className="text-sm text-gray-500 space-y-2">
              {/* This would be populated with page headings */}
              <a href="#overview" className="block hover:text-white">Overview</a>
              <a href="#features" className="block hover:text-white">Features</a>
              <a href="#examples" className="block hover:text-white">Examples</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}