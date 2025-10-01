import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async (ctx) => {
  // Handle phase claim navigation
  const buttonIndex = ctx.message?.buttonIndex;

  if (buttonIndex === 1) {
    // Phase 1: Social Proof
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
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            fontFamily: 'sans-serif',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
            🎁 PHASE 1: SOCIAL PROOF
          </div>
          <div style={{ fontSize: 36, color: '#fef3c7', marginBottom: 30 }}>
            Earn 5,000 RDLN
          </div>
          <div style={{ fontSize: 24, color: 'white', display: 'flex', flexDirection: 'column', gap: 15, textAlign: 'center', maxWidth: '700px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              ✅ Follow Riddlen on Twitter
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              ✅ Join Riddlen Telegram
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              ✅ Share a Riddlen post
            </div>
          </div>
          <div style={{ fontSize: 20, color: '#bae6fd', marginTop: 30 }}>
            Complete tasks, then claim at riddlen.com
          </div>
        </div>
      ),
      buttons: [
        <Button action="link" target="https://riddlen.com/airdrop">
          🎁 Claim Phase 1
        </Button>,
        <Button action="post" target="/frames/airdrop">
          ← Back
        </Button>,
      ],
    };
  }

  if (buttonIndex === 2) {
    // Phase 2: RON Reputation
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
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            fontFamily: 'sans-serif',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
            🏅 PHASE 2: RON REPUTATION
          </div>
          <div style={{ fontSize: 36, color: '#fef3c7', marginBottom: 30 }}>
            Earn up to 5,000 RDLN
          </div>
          <div style={{ fontSize: 26, color: 'white', display: 'flex', flexDirection: 'column', gap: 15, textAlign: 'center', maxWidth: '700px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              🥉 Tier 1 (1K-5K RON): 2,000 RDLN
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              🥈 Tier 2 (5K-10K RON): 3,000 RDLN
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              🥇 Tier 3 (10K-25K RON): 4,000 RDLN
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              💎 Tier 4 (25K+ RON): 5,000 RDLN
            </div>
          </div>
          <div style={{ fontSize: 20, color: '#ddd6fe', marginTop: 30 }}>
            Passive rewards based on your RON holdings
          </div>
        </div>
      ),
      buttons: [
        <Button action="link" target="https://riddlen.com/airdrop">
          🏅 Check Eligibility
        </Button>,
        <Button action="post" target="/frames/airdrop">
          ← Back
        </Button>,
      ],
    };
  }

  if (buttonIndex === 3) {
    // Phase 3: Validation Earning
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
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            fontFamily: 'sans-serif',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
            💼 PHASE 3: VALIDATION WORK
          </div>
          <div style={{ fontSize: 36, color: '#fef3c7', marginBottom: 30 }}>
            Earn up to 5,000 RDLN
          </div>
          <div style={{ fontSize: 24, color: 'white', display: 'flex', flexDirection: 'column', gap: 15, textAlign: 'center', maxWidth: '700px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              💰 500 RDLN per validation
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              🎁 25% bonus at 10+ validations
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
              ⚡ Must hold 1,000+ RON
            </div>
          </div>
          <div style={{ fontSize: 20, color: '#d1fae5', marginTop: 30 }}>
            Earn by validating Oracle Network data
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" target="/frames/validate">
          🔍 Start Validating
        </Button>,
        <Button action="post" target="/frames/airdrop">
          ← Back
        </Button>,
      ],
    };
  }

  // Main airdrop overview
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
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
          🎁 RIDDLEN AIRDROP
        </div>
        <div style={{ fontSize: 36, color: '#422006', marginBottom: 30 }}>
          100M RDLN Total Pool
        </div>
        <div style={{ fontSize: 28, color: 'white', display: 'flex', flexDirection: 'column', gap: 15, textAlign: 'center', maxWidth: '700px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            🎁 Phase 1: 33M RDLN (Social Proof)
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            🏅 Phase 2: 33M RDLN (RON Reputation)
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            💼 Phase 3: 34M RDLN (Validation Work)
          </div>
        </div>
        <div style={{ fontSize: 24, color: '#fef3c7', marginTop: 30, fontWeight: 'bold' }}>
          Max: 15,000 RDLN per wallet
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/frames/airdrop">
        🎁 Phase 1
      </Button>,
      <Button action="post" target="/frames/airdrop">
        🏅 Phase 2
      </Button>,
      <Button action="post" target="/frames/airdrop">
        💼 Phase 3
      </Button>,
      <Button action="post" target="/frames/riddle">
        ← Back
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
