import { formatEther } from 'viem';

export const rdln = (v) => Number(formatEther(v ?? 0n)).toLocaleString(undefined, { maximumFractionDigits: 0 });

export function countdown(seconds) {
  if (seconds <= 0) return 'now';
  const d = Math.floor(seconds / 86400), h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${s.toString().padStart(2, '0')}s`;
  return `${s}s`;
}

/** Short human label per phase, plus a pill tone */
export const PHASE = {
  pending: { label: 'Machines thinking', tone: 'machine', live: true },
  open: { label: 'Open', tone: 'human', live: true },
  'awaiting-author': { label: 'Closed · awaiting author', tone: '' },
  'void-ready': { label: 'Author missed reveal', tone: 'accent' },
  reveal: { label: 'Revealing', tone: 'accent', live: true },
  'awaiting-panel': { label: 'Awaiting machine reveal', tone: 'machine' },
  finalizing: { label: 'Ready to settle', tone: 'accent' },
  complete: { label: 'Settled', tone: '' },
  rejected: { label: 'Declined', tone: '' },
  loading: { label: '…', tone: '' },
};

export const OUTCOME_LABEL = {
  stumped: 'Stumped the machine',
  'machine-solved': 'Machine solved it',
  unsolved: 'Nobody solved it',
  voided: 'Voided',
  pending: 'Pending',
};

export function deadline(c, revealWindow) {
  if (!revealWindow) return null;
  if (c.phase === 'open') return { label: 'closes in', at: Number(c.endTime) };
  if (c.phase === 'awaiting-author') return { label: 'author has', at: Number(c.endTime + revealWindow) };
  if (c.phase === 'reveal') return { label: 'reveals close in', at: Number(c.authorRevealedAt + revealWindow) };
  return null;
}

/** Hunt phases */
export const HUNT_PHASE = {
  released: { label: 'Rolling the count', tone: 'machine', live: true },
  open: { label: 'On sale', tone: 'human', live: true },
  'sold-out': { label: 'Sold out · unsolved', tone: '' },
  found: { label: 'Found · window open', tone: 'accent', live: true },
  settling: { label: 'Ready to settle', tone: 'accent' },
  settled: { label: 'Settled', tone: '' },
  loading: { label: '…', tone: '' },
};
