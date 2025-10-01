import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getCurrentRiddleData, CONTRACTS } from "../../../lib/contracts";
import { checkSponsorshipEligibility, getSponsorshipStats } from "../../../lib/gasSponsorship";

const handleRequest = frames(async (ctx) => {
  const riddleData = await getCurrentRiddleData();

  // Get user's FID from context
  const userFid = ctx.message?.requesterFid?.toString() || 'unknown';

  // Check if user clicked "Mint NFT" button
  if (ctx.message?.buttonIndex === 1) {
    // Check gas sponsorship eligibility
    const eligibility = checkSponsorshipEligibility(userFid);
    const stats = getSponsorshipStats(userFid);

    if (eligibility.eligible) {
      // Show gas-sponsored mint success
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
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              fontFamily: 'sans-serif',
              padding: '40px',
            }}
          >
            <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
              🎁 FREE MINT!
            </div>
            <div style={{ fontSize: 32, color: '#d1fae5', textAlign: 'center', marginBottom: 20 }}>
              Gas sponsored by Riddlen
            </div>
            <div style={{ fontSize: 28, color: '#a7f3d0', marginBottom: 20 }}>
              Free mints remaining: {stats.mintsRemaining}
            </div>
            <div style={{ fontSize: 24, color: 'white', textAlign: 'center', marginTop: 30 }}>
              Confirm transaction to mint your NFT
            </div>
          </div>
        ),
        buttons: [
          <Button action="tx" target="/frames/mint/tx" post_url="/frames/mint">
            ✅ Mint Now (FREE)
          </Button>,
          <Button action="post" target="/frames/riddle">
            ← Back
          </Button>,
        ],
      };
    }
    // Return transaction request
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
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            fontFamily: 'sans-serif',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
            ✅ Minting...
          </div>
          <div style={{ fontSize: 32, color: '#d1fae5', textAlign: 'center' }}>
            Confirm transaction in your wallet
          </div>
          <div style={{ fontSize: 28, color: '#a7f3d0', marginTop: 30 }}>
            Cost: {riddleData.mintPrice} RDLN
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" target="/frames/riddle">
          ← Back to Riddle
        </Button>,
      ],
    };
  }

  // Initial mint screen
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
          background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
          🎫 MINT RIDDLE NFT
        </div>
        <div style={{ fontSize: 36, color: '#fbbf24', marginBottom: 30 }}>
          Riddle #{riddleData.riddleId}
        </div>
        <div style={{ fontSize: 28, color: 'white', display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'center' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            💰 Mint Cost: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{riddleData.mintPrice} RDLN</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            🏆 Prize Pool: <span style={{ color: '#34d399', fontWeight: 'bold' }}>{riddleData.prizePool} RDLN</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px 40px', borderRadius: '12px' }}>
            🎯 Available: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{riddleData.nftsAvailable} / 999</span>
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#c4b5fd', marginTop: 30, textAlign: 'center', maxWidth: '600px' }}>
          Mint an NFT to unlock the riddle. Solve it to earn RDLN rewards!
        </div>
      </div>
    ),
    buttons: [
      <Button
        action="tx"
        target={`/frames/mint/tx`}
        post_url="/frames/mint"
      >
        💎 Mint NFT
      </Button>,
      <Button action="post" target="/frames/riddle">
        ← Back
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
