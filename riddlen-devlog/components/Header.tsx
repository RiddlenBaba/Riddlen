'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showConnectors, setShowConnectors] = useState(false);

  const handleConnect = () => {
    // If only one connector, use it directly
    if (connectors.length === 1) {
      connect({ connector: connectors[0] });
    } else {
      // Show selector if multiple connectors
      setShowConnectors(true);
    }
  };

  return (
    <header className="border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              🧠 Riddlen <span className="text-riddlen-purple">Devlog</span>
            </h1>
            <p className="text-gray-400 text-sm">
              On-chain development journey • Built with intelligence
            </p>
          </div>

          <div className="relative">
            {isConnected ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Connected</p>
                  <p className="text-sm font-mono text-riddlen-purple">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleConnect}
                  disabled={isPending}
                  className="px-4 py-2 bg-riddlen-purple hover:bg-riddlen-blue text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Connecting...' : 'Connect Wallet'}
                </button>

                {showConnectors && connectors.length > 1 && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <div className="flex justify-between items-center mb-2 px-2">
                        <p className="text-sm font-medium text-white">Select Wallet</p>
                        <button
                          onClick={() => setShowConnectors(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                      {connectors.map((connector) => (
                        <button
                          key={connector.id}
                          onClick={() => {
                            connect({ connector });
                            setShowConnectors(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-700 rounded-lg transition-colors text-white"
                        >
                          {connector.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
