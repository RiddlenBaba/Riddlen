import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount, useBlockNumber, usePublicClient } from 'wagmi';
import { privateKeyToAccount } from 'viem/accounts';
import { formatEther } from 'viem';
import { DIFFICULTY, loadUnlocked, mintPriceOf, saveUnlocked, shareFor, stepOf, useHuntActions, useMyTokens, usePriceFloor } from '../hooks/useHunt';
import { CHAIN, CONTRACTS, EXPLORER } from '../lib/wagmi';
import { HUNT_ABI } from '../lib/abi';
import { HUNT_PHASE, rdln } from './format';
import { short } from './Wallet';
import QrScanner from './QrScanner';
import * as H from '../lib/hunt';

const fmt = (v) => Number(formatEther(v ?? 0n)).toLocaleString(undefined, { maximumFractionDigits: 2 });

export function HuntPill({ phase }) {
  const p = HUNT_PHASE[phase] || HUNT_PHASE.loading;
  return <span className={`pill ${p.tone} ${p.live ? 'live' : ''}`}>{p.live && <span className="dot" />}{p.label}</span>;
}

/** Build the on-chain guess for a token: slow hash, own subtree, positional proof. The site never
 *  tells you whether a guess is right before you pay; the chain does, after. */
async function buildGuess({ riddle, token, answer }) {
  const Hh = await H.answerHash({ chainId: CHAIN.id, hunt: CONTRACTS.HUNT, riddleId: riddle.id, answer });
  const tree = H.buildAnswerTree(riddle.id, Hh);
  const root = H.hex(tree.root);
  const alt = Math.max(riddle.altRoots.findIndex((r) => r.toLowerCase() === root), 0);
  return { H: Hh, alt, leaf: H.hex(H.leafFor(riddle.id, token.index, Hh)), proof: H.answerProof(tree, token.index).map(H.hex) };
}

function Attempt({ riddle, token, actions, onChange, step }) {
  const [answer, setAnswer] = useState('');
  const [preparing, setPreparing] = useState(false);
  const [last, setLast] = useState(null); // { answer, cost } of the most recent wrong guess
  const nextCost = BigInt(token.attempts + 1) * step;
  const busy = !!actions.pending || preparing;

  const submit = async () => {
    const text = answer.trim();
    if (!text) return;
    setPreparing(true);
    let g;
    try { g = await buildGuess({ riddle, token, answer: text }); }
    catch (e) { actions.setError(e.message); setPreparing(false); return; }
    setPreparing(false);
    const cost = nextCost;
    const ok = await actions.attempt(token.id, g.alt, g.leaf, g.proof);
    if (!ok) return;
    // Only now, with the chain's verdict, may the browser look at the location
    const loc = await H.decryptLocation({ riddleId: riddle.id, H: g.H, cipher: H.unhex(riddle.locationCipher) });
    if (loc) { saveUnlocked('location', token.id, loc); setLast(null); }
    else setLast({ answer: text, cost });
    setAnswer('');
    onChange?.();
  };

  return (
    <div className="att">
      <label className="field">
        <span>Your guess</span>
        <div className="row">
          <input className="input" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="one word or a few" disabled={busy} onKeyDown={(e) => e.key === 'Enter' && submit()} />
          <button className="btn accent" disabled={busy || !answer.trim()} onClick={submit}>{preparing ? 'Sealing…' : actions.pending === 'Submitting your answer' ? 'Guessing…' : `Guess for ${fmt(nextCost)} RDLN`}</button>
        </div>
        <span className="help">Every guess costs. This one is <b>{fmt(nextCost)} RDLN</b> on this NFT; the next is {fmt(nextCost + step)}. Spelling and capitals don&apos;t matter; the words do. The right one unlocks the place.</span>
      </label>
      {last && <p className="verdict no"><strong>Not it.</strong> &ldquo;{last.answer}&rdquo; cost {fmt(last.cost)} RDLN. Think before the next one.</p>}
      <style jsx>{`
        .att { display: flex; flex-direction: column; gap: 12px; }
        .row { display: flex; gap: 8px; }
        .row .input { flex: 1; }
        .verdict { margin: 0; padding: 12px 16px; border-radius: 12px; font-size: 14px; background: var(--paper-2); }
        .help b { color: var(--ink); }
      `}</style>
    </div>
  );
}

function Location({ riddle, token }) {
  const [loc, setLoc] = useState(() => loadUnlocked('location', token.id));
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const reveal = async () => {
    setBusy(true); setMsg(null);
    try {
      const Hh = await H.answerHash({ chainId: CHAIN.id, hunt: CONTRACTS.HUNT, riddleId: riddle.id, answer });
      const l = await H.decryptLocation({ riddleId: riddle.id, H: Hh, cipher: H.unhex(riddle.locationCipher) });
      if (l) { saveUnlocked('location', token.id, l); setLoc(l); } else setMsg('That answer does not open it.');
    } finally { setBusy(false); }
  };
  if (loc) return (
    <div className="loc">
      <span className="eyebrow">Where to go</span>
      <p className="where">{loc}</p>
      <style jsx>{`
        .loc { display: flex; flex-direction: column; gap: 6px; padding: 16px 18px; border-radius: 12px; background: var(--human-bg); }
        .where { margin: 0; font-family: var(--display); font-size: 20px; line-height: 1.35; }
      `}</style>
    </div>
  );
  return (
    <div className="loc">
      <span className="eyebrow">Where to go</span>
      <p className="muted small">This NFT is solved, but the location is encrypted with the answer and this browser does not have it. If you bought the NFT, the seller has the answer. Type it to reveal the place; nothing is sent anywhere.</p>
      <div className="row">
        <input className="input" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="the answer" />
        <button className="btn small" disabled={busy || !answer.trim()} onClick={reveal}>{busy ? 'Thinking…' : 'Reveal'}</button>
      </div>
      {msg && <p className="notice warn">{msg}</p>}
      <style jsx>{`
        .loc { display: flex; flex-direction: column; gap: 8px; padding: 16px 18px; border-radius: 12px; background: var(--paper-2); }
        .row { display: flex; gap: 8px; } .row .input { flex: 1; }
        p { margin: 0; } .small { font-size: 14px; }
      `}</style>
    </div>
  );
}

function Fragment({ token }) {
  const frag = loadUnlocked('fragment', token.id);
  if (!frag) return <p className="muted small">The map fragment for this NFT is not in this browser. It was shown when the claim was made; whoever scanned the code has it.</p>;
  let text = null;
  try { const bytes = H.unhex(frag); const t = new TextDecoder('utf-8', { fatal: true }).decode(bytes); if (/^[\x09\x0a\x0d\x20-\x7e -￿]*$/.test(t)) text = t; } catch { /* binary */ }
  return (
    <div className="frag">
      <span className="eyebrow">Your piece of the map</span>
      {text ? <p className="piece mono">{text}</p> : <p className="muted small">{(frag.length - 2) / 2} bytes of the map. <a download={`riddlen-fragment-${token.riddleId}.bin`} href={`data:application/octet-stream;base64,${typeof window !== 'undefined' ? btoa(String.fromCharCode(...H.unhex(frag))) : ''}`}>Download</a></p>}
      <p className="muted small">Kept only in this browser. <Link href="/map">See everything you hold</Link>.</p>
      <style jsx>{`
        .frag { display: flex; flex-direction: column; gap: 6px; padding: 16px 18px; border-radius: 12px; border: 1px dashed var(--line-strong); }
        .piece { margin: 0; white-space: pre-wrap; word-break: break-all; font-size: 13px; }
        p { margin: 0; } .small { font-size: 13px; }
      `}</style>
    </div>
  );
}

function Claim({ riddle, token, actions, onChange }) {
  const { address } = useAccount();
  const pub = usePublicClient();
  const [scanning, setScanning] = useState(false);
  const [pasted, setPasted] = useState('');
  const [payload, setPayload] = useState(null);
  const busy = !!actions.pending;

  const onCode = useCallback((text) => {
    const p = H.parseCachePayload(text);
    setScanning(false);
    if (!p) { actions.setError('That is not a Riddlen cache code.'); return; }
    if (p.riddleId !== Number(riddle.id)) { actions.setError(`That code belongs to riddle #${p.riddleId}, not this one.`); return; }
    setPayload(p);
  }, [riddle.id, actions]);

  const claim = async () => {
    if (!payload || !address) return;
    let sig;
    try {
      const account = privateKeyToAccount(H.hex(payload.signingKey));
      const td = H.claimTypedData({ chainId: CHAIN.id, hunt: CONTRACTS.HUNT, riddleId: riddle.id, tokenId: token.id, owner: address });
      sig = await account.signTypedData(td);
    } catch (e) { actions.setError(`Could not sign with that code: ${e.message}`); return; }
    const ok = await actions.claim(token.id, sig);
    if (!ok) return;
    // The fragment ciphertext lives in the release (or latest rekey) event
    try {
      const [released, rekeyed] = await Promise.all([
        pub.getContractEvents({ address: CONTRACTS.HUNT, abi: HUNT_ABI, eventName: 'RiddleReleased', args: { id: BigInt(riddle.id) }, fromBlock: 0n }),
        pub.getContractEvents({ address: CONTRACTS.HUNT, abi: HUNT_ABI, eventName: 'Rekeyed', args: { id: BigInt(riddle.id) }, fromBlock: 0n }),
      ]);
      const ev = [...released, ...rekeyed].sort((a, b) => Number(b.blockNumber - a.blockNumber))[0];
      const bytes = ev ? await H.decryptFragment({ riddleId: riddle.id, fragmentSecret: payload.fragmentSecret, cipher: H.unhex(ev.args.fragmentCipher) }) : null;
      if (bytes) saveUnlocked('fragment', token.id, H.hex(bytes));
    } catch { /* the claim stands; the fragment can be re-read from the code later */ }
    setPayload(null);
    onChange?.();
  };

  return (
    <div className="claim">
      <span className="eyebrow">At the place</span>
      {!payload && !scanning && (
        <>
          <p className="small">Found it? Scan the code on it with this device, using the wallet that holds this NFT. The code signs your claim here in the browser and is never sent anywhere.</p>
          <div className="row">
            <button className="btn accent" onClick={() => setScanning(true)}>Scan the code</button>
            <input className="input" value={pasted} onChange={(e) => setPasted(e.target.value)} placeholder="or paste it: riddlen://cache?…" />
            <button className="btn" disabled={!pasted.trim()} onClick={() => onCode(pasted)}>Use</button>
          </div>
        </>
      )}
      {scanning && <QrScanner onResult={onCode} onClose={() => setScanning(false)} />}
      {payload && (
        <div className="ready">
          <p><strong>Code read.</strong> Claim this NFT as {short(address)}. Costs {fmt(riddle.claimFee)} RDLN.</p>
          <div className="row">
            <button className="btn accent" disabled={busy} onClick={claim}>{actions.pending === 'Claiming' ? 'Claiming…' : 'Claim'}</button>
            <button className="btn small" disabled={busy} onClick={() => setPayload(null)}>Forget code</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .claim { display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; border-radius: 12px; border: 1px solid var(--line-strong); }
        .row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; } .row .input { flex: 1; min-width: 200px; }
        .ready { display: flex; flex-direction: column; gap: 10px; background: var(--human-bg); padding: 12px 14px; border-radius: 10px; }
        p { margin: 0; } .small { font-size: 14px; }
      `}</style>
    </div>
  );
}

function TokenCard({ riddle, token, actions, onChange, step }) {
  const state = token.claimedAt ? (token.released ? 'paid' : 'found · waiting') : token.unlockedAt ? 'location unlocked' : 'unsolved';
  const nextShare = shareFor(riddle, riddle.claimCount + 1);
  const stillNeeded = token.claimedAt && !token.released ? Math.max(0, token.rank + riddle.releaseGap - riddle.claimCount) : 0;
  return (
    <article className="tok card">
      <header>
        <span className="mono">NFT #{token.id.toString()} · {token.index + 1} of {riddle.nftCount}</span>
        <span className={`pill ${token.claimedAt ? 'human' : token.unlockedAt ? 'accent' : ''}`}>{state}</span>
      </header>
      <div className="stats mono muted">
        attempts on this NFT <b>{token.attempts}</b>
        {!token.unlockedAt && <> · next try <b>{fmt(BigInt(token.attempts + 1) * step)} RDLN</b></>}
        {!token.claimedAt && !riddle.complete && <> · finding it now pays <b>{rdln(nextShare)} RDLN</b> (finder #{riddle.claimCount + 1})</>}
      </div>
      {!token.unlockedAt && <Attempt riddle={riddle} token={token} actions={actions} onChange={onChange} step={step} />}
      {token.unlockedAt > 0 && <Location riddle={riddle} token={token} />}
      {token.unlockedAt > 0 && !token.claimedAt && <Claim riddle={riddle} token={token} actions={actions} onChange={onChange} />}
      {token.claimedAt > 0 && (
        <p className="muted small">
          Finder #{token.rank}. Share <b>{rdln(token.share)} RDLN</b>.{' '}
          {token.released
            ? <>Released. Withdraw from your <Link href="/me">dashboard</Link>.</>
            : <>It is released when {stillNeeded === 1 ? 'the next person finds it' : `${stillNeeded} more people find it`}, so leave the code where it is. If you sell this NFT first, the share goes to the buyer.</>}
        </p>
      )}
      {token.claimedAt > 0 && <Fragment token={token} />}
      <style jsx>{`
        .tok { display: flex; flex-direction: column; gap: 14px; padding: 18px 20px; }
        header { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .stats { font-size: 13px; } .stats b { color: var(--ink); font-weight: 500; }
        p { margin: 0; } .small { font-size: 13px; } p b { color: var(--ink); font-weight: 500; }
      `}</style>
    </article>
  );
}

export default function HuntRiddle({ riddle, onChange }) {
  const { address, isConnected } = useAccount();
  const actions = useHuntActions();
  const floor = usePriceFloor();
  const price = mintPriceOf(riddle, floor);
  const step = stepOf(riddle, floor);
  const { tokens, refetch } = useMyTokens(address, riddle.id);
  const { data: block } = useBlockNumber({ watch: true });
  const busy = !!actions.pending;
  const change = () => { refetch(); onChange?.(); };
  useEffect(() => { actions.clearError(); }, [riddle.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const canOpen = riddle.phase === 'released' && block !== undefined && Number(block) > riddle.commitBlock + 10;
  const left = riddle.nftCount - riddle.minted;

  return (
    <article className="riddle">
      <header>
        <div className="top">
          <span className="eyebrow">Riddle #{riddle.id.toString()} · {DIFFICULTY[riddle.difficulty]}</span>
          <HuntPill phase={riddle.phase} />
        </div>
        <p className="text">{riddle.text}</p>
        <div className="meta mono muted">
          <span><b>{rdln(riddle.pot)}</b> RDLN pot</span>
          {riddle.opened ? <span><b>{left}</b> of {riddle.nftCount} NFTs left</span> : <span>count not rolled yet</span>}
          {riddle.opened && <span>NFT price <b>{fmt(price)}</b> RDLN</span>}
          {riddle.opened && !riddle.complete && <span>next finder gets <b>{rdln(shareFor(riddle, riddle.claimCount + 1))}</b> RDLN</span>}
          {riddle.claimCount > 0 && <span><b>{riddle.claimCount}</b> found it{riddle.firstClaimAt > 0 ? `, first on ${new Date(riddle.firstClaimAt * 1000).toLocaleDateString()}` : ''}</span>}
        </div>
      </header>

      <section className="act">
        {riddle.phase === 'released' && (
          <div className="box">
            <p>The house has released this riddle. A few blocks later anyone can open it, which rolls how many NFTs exist. Then it goes on sale.</p>
            <button className="btn" disabled={!canOpen || busy} onClick={() => actions.open(riddle.id).then((ok) => ok && change())}>{actions.pending === 'Opening' ? 'Opening…' : canOpen ? 'Open it' : 'Waiting for blocks…'}</button>
          </div>
        )}
        {['open', 'found'].includes(riddle.phase) && left > 0 && (
          <div className="box">
            <p>An NFT is the right to attempt this riddle. It never expires, it keeps its own count of tries, and everything it earns travels with it if you sell it. The price is a fifth of what one ticket is worth: the pot divided by the number of NFTs.</p>
            {isConnected
              ? <button className="btn accent" disabled={busy} onClick={() => actions.mint(riddle.id).then((ok) => ok && change())}>{actions.pending === 'Buying' ? 'Buying…' : `Buy one for ${fmt(price)} RDLN`}</button>
              : <p className="muted small">Connect a wallet to buy. New here? The <Link href="/free">faucet</Link> gives every wallet free testnet RDLN.</p>}
          </div>
        )}
        {actions.error && <p className="notice warn">{actions.error} <button className="link" onClick={actions.clearError}>dismiss</button></p>}
      </section>

      {isConnected && tokens.length > 0 && (
        <section className="mine">
          <h2 className="display">Your NFTs on this riddle</h2>
          {tokens.map((t) => <TokenCard key={t.id.toString()} riddle={riddle} token={t} actions={actions} onChange={change} step={step} />)}
        </section>
      )}

      <section className="how">
        <h2 className="display">How this one pays</h2>
        <ul>
          <li>Buy an NFT. Each try on it costs {fmt(step)} RDLN more than the last, {riddle.stepBps / 100}% of the ticket per step. Every payment splits four ways: burned, grand prize, treasury, liquidity.</li>
          <li>The right answer unlocks a place. Go there and scan what you find. That is the claim; it costs {fmt(riddle.claimFee)} RDLN.</li>
          <li>Every finder gets a share, largest for the first: finder #1 gets {rdln(shareFor(riddle, 1))} RDLN, #2 {rdln(shareFor(riddle, 2))}, #10 {rdln(shareFor(riddle, Math.min(10, riddle.nftCount || 10)))}, and so on down to the last NFT.</li>
          <li>A share is released when {riddle.releaseGap === 1 ? 'the next person finds it: the first finder is paid by the second, the second by the third' : `${riddle.releaseGap} more people have found it, because the pot is large`}. Completion pays everyone still waiting. So the code stays where it is.</li>
          <li>Nothing here expires. If nobody finds it, the pot waits, and a finder who is last for now waits with it.</li>
        </ul>
        <p className="muted small">Contract <a href={`${EXPLORER}/address/${CONTRACTS.HUNT}`} target="_blank" rel="noreferrer">{short(CONTRACTS.HUNT)}</a> · cache key {short(riddle.cacheSigner)}</p>
      </section>

      <style jsx>{`
        .riddle { display: flex; flex-direction: column; gap: 28px; max-width: 820px; }
        header { display: flex; flex-direction: column; gap: 14px; }
        .top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .text { font-family: var(--display); font-size: clamp(24px, 3.6vw, 36px); line-height: 1.25; margin: 0; white-space: pre-wrap; }
        .meta { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 13px; } .meta b { color: var(--ink); font-weight: 500; }
        .act { display: flex; flex-direction: column; gap: 12px; }
        .box { display: flex; flex-direction: column; gap: 12px; padding: 18px 20px; border: 1px solid var(--line-strong); border-radius: 14px; align-items: flex-start; }
        .box p { margin: 0; }
        .mine { display: flex; flex-direction: column; gap: 14px; }
        h2 { font-size: 22px; margin: 0; }
        .how ul { margin: 8px 0 0; padding-left: 18px; color: var(--ink-2); font-size: 15px; display: flex; flex-direction: column; gap: 6px; }
        .small { font-size: 13px; }
        .link { border: none; background: none; text-decoration: underline; cursor: pointer; padding: 0; font-size: inherit; }
      `}</style>
    </article>
  );
}
