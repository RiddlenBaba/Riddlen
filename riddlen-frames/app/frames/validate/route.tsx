import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async (ctx) => {
  const buttonIndex = ctx.message?.buttonIndex;

  // Handle validation task selection
  if (buttonIndex === 1) {
    // View active validation tasks
    return {
      image: (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            fontFamily: 'sans-serif',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: 50, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
            📋 ACTIVE VALIDATION TASKS
          </div>
          <div style={{ fontSize: 24, color: '#e0e7ff', marginBottom: 30 }}>
            Oracle Network Requests
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: '700px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(0,0,0,0.3)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              <div style={{ fontSize: 28, color: '#fbbf24', marginBottom: 10 }}>
                Request #1: Data Hash Validation
              </div>
              <div style={{ fontSize: 20, color: 'white', marginBottom: 5 }}>
                🏆 Reward: 3,333 RDLN per validator
              </div>
              <div style={{ fontSize: 18, color: '#93c5fd' }}>
                ⚡ Status: 2/3 validators assigned
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(0,0,0,0.3)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              <div style={{ fontSize: 28, color: '#fbbf24', marginBottom: 10 }}>
                Request #2: Riddle Solution Check
              </div>
              <div style={{ fontSize: 20, color: 'white', marginBottom: 5 }}>
                🏆 Reward: 5,000 RDLN per validator
              </div>
              <div style={{ fontSize: 18, color: '#34d399' }}>
                ⚡ Status: Open for validation
              </div>
            </div>
          </div>
          <div style={{ fontSize: 20, color: '#c7d2fe', marginTop: 30 }}>
            Join solver groups to validate together!
          </div>
        </div>
      ),
      buttons: [
        <Button action="link" target="https://riddlen.com/oracle">
          🔍 Start Validating
        </Button>,
        <Button action="post" target="/frames/validate">
          ← Back
        </Button>,
      ],
    };
  }

  if (buttonIndex === 2) {
    // Join/Create Solver Group
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
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            fontFamily: 'sans-serif',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
            👥 SOLVER GROUPS
          </div>
          <div style={{ fontSize: 36, color: '#fef3c7', marginBottom: 30 }}>
            Team Up & Share Rewards
          </div>
          <div style={{ fontSize: 24, color: 'white', display: 'flex', flexDirection: 'column', gap: 15, textAlign: 'center', maxWidth: '700px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              🤝 Pool NFTs together
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              🎯 Combine validation power
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              💰 Share rewards automatically
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              📊 Track group performance
            </div>
          </div>
          <div style={{ fontSize: 22, color: '#fce7f3', marginTop: 30 }}>
            Enhanced rewards with group mechanics!
          </div>
        </div>
      ),
      buttons: [
        <Button action="link" target="https://riddlen.com/groups">
          👥 Browse Groups
        </Button>,
        <Button action="post" target="/frames/validate">
          ← Back
        </Button>,
      ],
    };
  }

  if (buttonIndex === 3) {
    // Validator Stats
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
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            fontFamily: 'sans-serif',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
            📊 YOUR VALIDATOR STATS
          </div>
          <div style={{ fontSize: 28, color: 'white', display: 'flex', flexDirection: 'column', gap: 15, textAlign: 'center', maxWidth: '700px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
              ✅ Total Validations: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>0</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
              🎯 Accuracy Rate: <span style={{ color: '#34d399', fontWeight: 'bold' }}>N/A</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
              💰 Total Earned: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>0 RDLN</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
              🏅 Validator Tier: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Bronze</span>
            </div>
          </div>
          <div style={{ fontSize: 20, color: '#ccfbf1', marginTop: 30 }}>
            Requirements: 1,000+ RON to validate
          </div>
        </div>
      ),
      buttons: [
        <Button action="link" target="https://riddlen.com/oracle/stats">
          📊 View Full Stats
        </Button>,
        <Button action="post" target="/frames/validate">
          ← Back
        </Button>,
      ],
    };
  }

  // Main Oracle/Validate overview
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
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
          🔮 ORACLE NETWORK
        </div>
        <div style={{ fontSize: 36, color: '#fef3c7', marginBottom: 30 }}>
          Earn Through Participation
        </div>
        <div style={{ fontSize: 26, color: 'white', display: 'flex', flexDirection: 'column', gap: 15, textAlign: 'center', maxWidth: '700px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            🔍 Validate riddle solutions
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            💰 Earn RDLN per validation
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            👥 Join solver groups
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            🎁 Qualify for Phase 3 airdrop
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#ddd6fe', marginTop: 30 }}>
          Requires 100+ RON to participate
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/frames/validate">
        📋 View Tasks
      </Button>,
      <Button action="post" target="/frames/validate">
        👥 Solver Groups
      </Button>,
      <Button action="post" target="/frames/validate">
        📊 My Stats
      </Button>,
      <Button action="post" target="/frames/riddle">
        ← Back
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
