import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getCurrentRiddleData } from "../../../lib/contracts";

const handleRequest = frames(async (ctx) => {
  // Fetch real riddle data from blockchain
  const riddleData = await getCurrentRiddleData();

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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
          🧠 RIDDLEN #{riddleData.riddleId}
        </div>
        <div style={{ fontSize: 40, color: '#ffd700', marginBottom: 30 }}>
          {riddleData.isLive ? '🟢 LIVE NOW' : '⏸️ UPCOMING'}
        </div>
        <div style={{ fontSize: 28, color: 'white', display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div>💰 Prize Pool: {riddleData.prizePool} RDLN</div>
          <div>🏆 Winners: {riddleData.currentWinners}/{riddleData.totalWinners}</div>
          <div>🎫 NFTs: {riddleData.nftsAvailable} / 999</div>
          <div>⚡ Difficulty: {riddleData.difficulty}</div>
          <div>💎 Mint Price: {riddleData.mintPrice} RDLN</div>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/frames/mint">
        💎 Mint NFT
      </Button>,
      <Button action="post" target="/frames/solve">
        🧩 Solve Riddle
      </Button>,
      <Button action="post" target="/frames/airdrop">
        🎁 Airdrop
      </Button>,
      <Button action="post" target="/frames/validate">
        🔮 Oracle
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
