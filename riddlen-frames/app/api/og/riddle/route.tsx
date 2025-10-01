import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const riddleId = searchParams.get('riddleId') || '0';
    const prizePool = searchParams.get('prizePool') || '0';
    const nftsAvailable = searchParams.get('nftsAvailable') || '999';
    const mintPrice = searchParams.get('mintPrice') || '1000';
    const isLive = searchParams.get('isLive') !== 'false';

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui',
            padding: '40px',
          }}
        >
          <div style={{ fontSize: 70, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>
            🧠 RIDDLEN #{riddleId}
          </div>
          <div style={{ fontSize: 50, color: '#ffd700', marginBottom: 40 }}>
            {isLive ? '🟢 LIVE NOW' : '⏸️ UPCOMING'}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              fontSize: 32,
              color: 'white',
            }}
          >
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '15px 30px', borderRadius: '12px' }}>
              💰 Prize Pool: {prizePool} RDLN
            </div>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '15px 30px', borderRadius: '12px' }}>
              🎫 NFTs Available: {nftsAvailable} / 999
            </div>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '15px 30px', borderRadius: '12px' }}>
              💎 Mint Price: {mintPrice} RDLN
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
