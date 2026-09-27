import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount, useBlockNumber, usePublicClient } from 'wagmi';
import { privateKeyToAccount } from 'viem/accounts';
import { formatEther } from 'viem';
import { DIFFICULTY, loadUnlocked, saveUnlocked, useHuntActions, useMintPrice, useMyTokens } from '../hooks/useHunt';
import { CHAIN, CONTRACTS, EXPLORER } from '../lib/wagmi';
import { HUNT_ABI } from '../lib/abi';
import { countdown, HUNT_PHASE, rdln } from './format';
import { short } from './Wallet';
import QrScanner from './QrScanner';
import * as H from '../lib/hunt';

const fmt = (v) => Number(formatEther(v ?? 0n)).toLocaleString(undefined, { maximumFractionDigits: 2 });

export function HuntPill({ phase }) {
  const p = HUNT_PHASE[phase] || HUNT_PHASE.loading;
  return <span className={`pill ${p.tone} ${p.live ? 'live' : ''}`}>{p.live && <span className="dot" />}{p.label}</span>;
}

/** The slow hash for a guess, then the local check against the riddle's roots. No transaction. */
async function checkGuess({ riddle, token, answer }) {
  const Hh = await H.answerHash({ chainId: CHAIN.id, hunt: CONTRACTS.HUNT, riddleId: riddle.id, answer });
  const tree = H.buildAnswerTree(riddle.id, Hh);
  const root = H.hex(tree.root);
  const alt = riddle.altRoots.findIndex((r) => r.toLowerCase() === root);
  const leaf = H.hex(H.leafFor(riddle.id, token.index, Hh));
  const proof = H.answerProof(tree, token.index).map(H.hex);
  const location = alt >= 0 ? await H.decryptLocation({ riddleId: riddle.id, H: Hh, cipher: H.unhex(riddle.locationCipher) }) : null;
  return { H: Hh, alt: Math.max(alt, 0), matches: alt >= 0, leaf, proof, location };
}

function Attempt({ riddle, token, actions, onChange }) {
  const [answer, setAnswer] = useState('');
  const [checking, setChecking] = useState(false);
  const [check, setCheck] = useState(null);
  const nextCost = BigInt(token.attempts + 1) * riddle.attemptStep;
  const busy = !!actions.pending;

  const doCheck = async () => {
    if (!answer.trim()) return;
    setChecking(true); setCheck(null);
    try { setCheck(await checkGuess({ riddle, token, answer })); }
    catch (e) { actions.setError(e.message); }
    finally { setChecking(false); }
  };
  const submit = async () => {
    if (!check) return;
    const ok = await actions.attempt(token.id, check.alt, check.leaf, check.proof);
    if (ok) {
      if (check.location) saveUnlocked('location', token.id, check.location);
      setCheck(null); setAnswer('');
      onChange?.();
    }
  };

  return (
    <div className="att">
      <label className="field">
        <span>Your answer</span>
        <div className="row">
          <input className="input" value={answer} onChange={(e) => { setAnswer(e.target.value); setCheck(null); }} placeholder="one word or a few" onKeyDown={(e) => e.key === 'Enter' && doCheck()} />
          <button className="btn" disabled={checking || busy || !answer.trim()} onClick={doCheck}>{checking ? 'Thinking…' : 'Check'}</button>
        </div>
        <span className="help">Checking is free and happens on your device. It takes a second on purpose. Submitting costs <b>{fmt(nextCost)} RDLN</b> on this NFT, right or wrong.</span>
      </label>
      {check && check.matches && (
        <div className="verdict ok">
          <p><strong>That&apos;s it.</strong> Submitting records the solve on this NFT and unlocks the location on chain. Cost {fmt(nextCost)} RDLN.</p>
          <button className="btn accent" disabled={busy} onClick={submit}>{actions.pending === 'Submitting your answer' ? 'Submitting…' : `Submit for ${fmt(nextCost)} RDLN`}</button>
        </div>
      )}
      {check && !check.matches && (
        <div className="verdict no">
          <p><strong>Not it.</strong> You can still submit it, but it will cost {fmt(nextCost)} RDLN and unlock nothing. Most people don&apos;t.</p>
          <button className="btn small" disabled={busy} onClick={submit}>Submit anyway</button>
        </div>
      )}
      <style jsx>{`
        .att { display: flex; flex-direction: column; gap: 12px; }
        .row { display: flex; gap: 8px; }
        .row .input { flex: 1; }
        .verdict { padding: 14px 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
        .verdict.ok { background: var(--human-bg); }
        .verdict.no { background: var(--paper-2); }
        .verdict p { margin: 0; font-size: 14px; }
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
    if (p.riddleId !== riddle.id) { actions.setError(`That code belongs to riddle #${p.riddleId}, not this one.`); return; }
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

function TokenCard({ riddle, token, actions, now, onChange }) {
  const isFirst = token.claimedAt && riddle.firstTokenId === Number(token.id);
  const inWindow = token.claimedAt && token.claimedAt <= riddle.firstClaimAt + riddle.finisherWindow;
  const share = riddle.settled ? (isFirst ? riddle.firstShare : inWindow ? riddle.finisherShare : 0n) : null;
  const state = token.collected ? 'collected' : token.claimedAt ? (isFirst ? 'first finder' : inWindow ? 'finisher' : 'late finder') : token.unlockedAt ? 'location unlocked' : 'unsolved';
  return (
    <article className="tok card">
      <header>
        <span className="mono">NFT #{token.id.toString()} · {token.index + 1} of {riddle.nftCount}</span>
        <span className={`pill ${token.claimedAt ? 'human' : token.unlockedAt ? 'accent' : ''}`}>{state}</span>
      </header>
      <div className="stats mono muted">attempts on this NFT <b>{token.attempts}</b>{!token.unlockedAt && <> · next try <b>{fmt(BigInt(token.attempts + 1) * riddle.attemptStep)} RDLN</b></>}</div>
      {!token.unlockedAt && <Attempt riddle={riddle} token={token} actions={actions} onChange={onChange} />}
      {token.unlockedAt > 0 && <Location riddle={riddle} token={token} />}
      {token.unlockedAt > 0 && !token.claimedAt && <Claim riddle={riddle} token={token} actions={actions} onChange={onChange} />}
      {token.claimedAt > 0 && <Fragment token={token} />}
      {token.claimedAt > 0 && !riddle.settled && (
        <p className="muted small">{isFirst ? 'You found it first.' : inWindow ? 'You finished inside the window.' : 'You finished after the window: the solve counts, the pot does not.'} Settles {countdown(riddle.firstClaimAt + riddle.finisherWindow - now)} after the first find; then collect your share here.</p>
      )}
      {riddle.settled && token.claimedAt > 0 && !token.collected && (
        <button className="btn primary" disabled={!!actions.pending} onClick={() => actions.collect(token.id).then((ok) => ok && onChange?.())}>{actions.pending === 'Collecting' ? 'Collecting…' : `Collect ${rdln(share)} RDLN${riddle.claimCount >= 2 ? ' and RON' : ''}`}</button>
      )}
      {token.collected && <p className="muted small">Collected. Withdraw from your <Link href="/me">dashboard</Link>.</p>}
      <style jsx>{`
        .tok { display: flex; flex-direction: column; gap: 14px; padding: 18px 20px; }
        header { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .stats { font-size: 13px; } .stats b { color: var(--ink); font-weight: 500; }
        p { margin: 0; } .small { font-size: 13px; }
        .btn { align-self: flex-start; }
      `}</style>
    </article>
  );
}

export default function HuntRiddle({ riddle, now, onChange }) {
  const { address, isConnected } = useAccount();
  const actions = useHuntActions();
  const price = useMintPrice();
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
          <span>price now <b>{fmt(price)}</b> RDLN</span>
          {riddle.firstClaimAt > 0 && <span>first found {new Date(riddle.firstClaimAt * 1000).toLocaleDateString()}</span>}
          {riddle.claimCount > 0 && <span><b>{riddle.claimCount}</b> found it</span>}
        </div>
      </header>

      <section className="act">
        {riddle.phase === 'released' && (
          <div className="box">
            <p>The house has released this riddle. A few blocks later anyone can open it, which rolls how many NFTs exist. Then it goes on sale.</p>
            <button className="btn" disabled={!canOpen || busy} onClick={() => actions.open(riddle.id).then((ok) => ok && change())}>{actions.pending === 'Opening' ? 'Opening…' : canOpen ? 'Open it' : 'Waiting for blocks…'}</button>
          </div>
        )}
        {(riddle.phase === 'open' || riddle.phase === 'found') && left > 0 && (
          <div className="box">
            <p>An NFT is the right to attempt this riddle. It never expires, it keeps its own count of tries, and everything it earns travels with it if you sell it.</p>
            {isConnected
              ? <button className="btn accent" disabled={busy} onClick={() => actions.mint(riddle.id).then((ok) => ok && change())}>{actions.pending === 'Buying' ? 'Buying…' : `Buy one for ${fmt(price)} RDLN`}</button>
              : <p className="muted small">Connect a wallet to buy. New here? The <Link href="/free">faucet</Link> gives every wallet free testnet RDLN.</p>}
          </div>
        )}
        {riddle.phase === 'settling' && (
          <div className="box">
            <p>The finisher window has passed. Anyone can settle; then finders collect.</p>
            <button className="btn" disabled={busy} onClick={() => actions.settle(riddle.id).then((ok) => ok && change())}>{actions.pending === 'Settling' ? 'Settling…' : 'Settle'}</button>
          </div>
        )}
        {actions.error && <p className="notice warn">{actions.error} <button className="link" onClick={actions.clearError}>dismiss</button></p>}
      </section>

      {isConnected && tokens.length > 0 && (
        <section className="mine">
          <h2 className="display">Your NFTs on this riddle</h2>
          {tokens.map((t) => <TokenCard key={t.id.toString()} riddle={riddle} token={t} actions={actions} now={now} onChange={change} />)}
        </section>
      )}

      <section className="how">
        <h2 className="display">How this one pays</h2>
        <ul>
          <li>Buy an NFT. Each try costs {fmt(riddle.attemptStep)} RDLN more than the last on that NFT. Every payment splits four ways: burned, grand prize, treasury, liquidity.</li>
          <li>The right answer unlocks a place. Go there and scan what you find. That is the claim; it costs {fmt(riddle.claimFee)} RDLN.</li>
          <li>First to claim takes {riddle.firstFinderBps / 100}% of the pot. Anyone who claims within {Math.round(riddle.finisherWindow / 86400)} days splits the rest. Every finder gets a piece of the map.</li>
          <li>Nothing here expires. If nobody finds it, the pot waits.</li>
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
