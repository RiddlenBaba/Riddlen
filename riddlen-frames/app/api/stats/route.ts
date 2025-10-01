import { NextResponse } from 'next/server';
import { getEcosystemStats } from '../../../lib/ecosystemStats';

export async function GET() {
  try {
    const stats = await getEcosystemStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

// Cache for 2 minutes
export const revalidate = 120;
