import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getUserProfile } from "../../../lib/contracts";

const handleRequest = frames(async (ctx) => {
  // Get user address from Farcaster context or use a default
  // For now, use a default address - will be replaced with actual user wallet when they connect
  const userAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as `0x${string}`;

  // Fetch real user data from blockchain
  const userStats = await getUserProfile(userAddress);

  return {
    image: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #312e81 0%, #1e293b 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 50, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>
          👤 YOUR PROFILE
        </div>
        <div style={{ fontSize: 24, color: '#94a3b8', marginBottom: 30 }}>
          {userStats.address}
        </div>

        <div style={{ display: 'flex', gap: 30, marginBottom: 30 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, color: '#94a3b8', marginBottom: 5 }}>Tier</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#fbbf24' }}>{userStats.tier}</div>
            <div style={{ fontSize: 18, color: '#6ee7b7' }}>{userStats.tierMultiplier} rewards</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, color: '#94a3b8', marginBottom: 5 }}>Rank</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#60a5fa' }}>#{userStats.rank}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: '100%', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <span style={{ fontSize: 24, color: '#94a3b8' }}>🎫 NFTs Owned</span>
            <span style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>{userStats.nftsOwned}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <span style={{ fontSize: 24, color: '#94a3b8' }}>🧠 Riddles Solved</span>
            <span style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>{userStats.riddlesSolved}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <span style={{ fontSize: 24, color: '#94a3b8' }}>🏅 RON Balance</span>
            <span style={{ fontSize: 26, fontWeight: 'bold', color: '#34d399' }}>{userStats.ronBalance}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <span style={{ fontSize: 24, color: '#94a3b8' }}>💰 RDLN Balance</span>
            <span style={{ fontSize: 26, fontWeight: 'bold', color: '#fbbf24' }}>{userStats.rdlnBalance}</span>
          </div>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/frames/riddle">
        🎮 Play Riddle
      </Button>,
      <Button action="post" target="/frames/leaderboard">
        🏆 Leaderboard
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
