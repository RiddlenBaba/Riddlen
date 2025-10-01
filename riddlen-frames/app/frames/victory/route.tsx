import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async (ctx) => {
  // Get victory data from query params
  const riddleId = ctx.searchParams.riddleId || '0';
  const winAmount = ctx.searchParams.winAmount || '0';
  const userName = ctx.searchParams.userName || 'Winner';
  const rank = ctx.searchParams.rank || '1';

  return {
    image: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>
          🎉
        </div>
        <div style={{ fontSize: 50, fontWeight: 'bold', color: 'white', marginBottom: 10, textAlign: 'center' }}>
          {userName} WON!
        </div>
        <div style={{ fontSize: 40, color: '#1a1a2e', marginBottom: 30 }}>
          #{rank} to solve Riddle #{riddleId}
        </div>
        <div style={{ fontSize: 60, fontWeight: 'bold', color: '#16a34a', marginBottom: 30, background: 'white', padding: '20px 40px', borderRadius: '20px' }}>
          +{winAmount} RDLN
        </div>
        <div style={{ fontSize: 28, color: 'white', textAlign: 'center', maxWidth: '700px' }}>
          Think you're smarter? Try this riddle!
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/frames/riddle">
        🧠 Try This Riddle
      </Button>,
      <Button action="post" target="/frames/leaderboard">
        🏆 View Leaderboard
      </Button>,
      <Button action="post" target="/frames/profile">
        👤 My Stats
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
