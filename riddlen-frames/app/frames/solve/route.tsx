import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getCurrentRiddleData } from "../../../lib/contracts";

const handleRequest = frames(async (ctx) => {
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
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
          🧩 SUBMIT SOLUTION
        </div>
        <div style={{ fontSize: 36, color: '#fbbf24', marginBottom: 30 }}>
          Riddle #{riddleData.riddleId}
        </div>
        <div style={{ fontSize: 28, color: 'white', display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            🏆 Prize Pool: <span style={{ color: '#34d399', fontWeight: 'bold' }}>{riddleData.prizePool} RDLN</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            ⚡ Difficulty: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{riddleData.difficulty}</span>
          </div>
        </div>
        <div style={{ fontSize: 24, color: '#fca5a5', marginTop: 30, textAlign: 'center', maxWidth: '600px', lineHeight: 1.5 }}>
          To submit your solution, visit riddlen.com with your minted NFT.
          Enter your answer and earn RDLN rewards!
        </div>
      </div>
    ),
    buttons: [
      <Button action="link" target="https://riddlen.com">
        🌐 Visit riddlen.com
      </Button>,
      <Button action="post" target="/frames/riddle">
        ← Back
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
