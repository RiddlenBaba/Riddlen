import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getLeaderboard } from "../../../lib/contracts";

const handleRequest = frames(async (ctx) => {
  // Fetch real leaderboard data from blockchain
  const topSolvers = await getLeaderboard();

  return {
    image: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #7c2d12 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 50, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
          🏆 TOP SOLVERS
        </div>
        <div style={{ fontSize: 24, color: '#fbbf24', marginBottom: 30 }}>
          Global Leaderboard
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: '700px' }}>
          {topSolvers.map((solver) => (
            <div
              key={solver.rank}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.3)',
                padding: '15px 25px',
                borderRadius: '12px',
                border: '2px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              <div style={{ fontSize: 28, color: 'white', display: 'flex', gap: 20 }}>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>#{solver.rank}</span>
                <span>{solver.address}</span>
              </div>
              <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                <span style={{ fontSize: 20, color: '#93c5fd' }}>{solver.tier}</span>
                <span style={{ fontSize: 26, fontWeight: 'bold', color: '#34d399' }}>{solver.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/frames/riddle">
        🎮 Play Riddle
      </Button>,
      <Button action="post" target="/frames/profile">
        👤 My Profile
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
