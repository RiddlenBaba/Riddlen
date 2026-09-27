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

/** Hunt phases */
export const HUNT_PHASE = {
  released: { label: 'Rolling the count', tone: 'machine', live: true },
  open: { label: 'On sale', tone: 'human', live: true },
  'sold-out': { label: 'Sold out · unfound', tone: '' },
  found: { label: 'Found · still on sale', tone: 'accent', live: true },
  'found-sold-out': { label: 'Found · sold out', tone: 'accent', live: true },
  complete: { label: 'Complete', tone: 'human' },
  loading: { label: '…', tone: '' },
};
