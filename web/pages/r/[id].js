import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import HuntRiddle from '../../components/HuntRiddle';
import { useRiddle } from '../../hooks/useHunt';
import { useNow } from '../../hooks/useFaucet';

export default function HuntRiddlePage() {
  const { query } = useRouter();
  const now = useNow();
  let id;
  try { id = query.id !== undefined ? BigInt(query.id) : undefined; } catch { id = undefined; }
  const { riddle, isLoading, refetch } = useRiddle(id, now);

  return (
    <Layout title={riddle ? `Riddle #${riddle.id}` : 'Riddle'} description={riddle?.text}>
      <p className="back"><Link href="/">← All riddles</Link></p>
      {isLoading && <p className="muted">Loading…</p>}
      {!isLoading && !riddle && id !== undefined && <p className="muted">No riddle #{String(query.id)}.</p>}
      {riddle && <HuntRiddle riddle={riddle} now={now} onChange={refetch} />}
      <style jsx>{`
        .back { margin: 0 0 24px; font-size: 14px; }
        .back :global(a) { color: var(--ink-2); text-decoration: none; }
      `}</style>
    </Layout>
  );
}
