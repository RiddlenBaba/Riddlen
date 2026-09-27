import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Riddle from '../../components/Riddle';
import { useChallenge, useNow } from '../../hooks/useStump';

export default function RiddlePage() {
  const { query } = useRouter();
  const now = useNow();
  let id;
  try { id = query.id !== undefined ? BigInt(query.id) : undefined; } catch { id = undefined; }
  const { challenge, revealWindow, isLoading, refetch } = useChallenge(id, now);

  return (
    <Layout title={challenge ? `Riddle #${challenge.id}` : 'Riddle'} description={challenge?.riddle}>
      <p className="back"><Link href="/">← Board</Link></p>
      {isLoading && <p className="muted">Loading…</p>}
      {!isLoading && !challenge && id !== undefined && <p className="muted">No riddle #{String(query.id)}.</p>}
      {challenge && <Riddle c={challenge} revealWindow={revealWindow} now={now} onChange={refetch} />}
      <style jsx>{`
        .back { margin: 0 0 24px; font-size: 14px; }
        .back :global(a) { color: var(--ink-2); text-decoration: none; }
      `}</style>
    </Layout>
  );
}
