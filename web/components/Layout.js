import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { CHAIN, CONTRACTS, EXPLORER } from '../lib/wagmi';

export const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '');

function Wallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  if (!isConnected) {
    const injected = connectors.find((c) => c.id === 'injected' || c.type === 'injected') || connectors[0];
    return (
      <button className="btn primary small" disabled={isPending || !injected} onClick={() => connect({ connector: injected })}>
        {isPending ? 'Connecting…' : 'Connect wallet'}
      </button>
    );
  }
  if (chainId !== CHAIN.id) {
    return <button className="btn accent small" onClick={() => switchChain({ chainId: CHAIN.id })}>Switch to Amoy</button>;
  }
  return (
    <button className="btn small mono" title="Disconnect" onClick={() => disconnect()}>{short(address)}</button>
  );
}

export default function Layout({ title, description, children }) {
  const { pathname } = useRouter();
  const nav = [['/', 'Board'], ['/write', 'Write'], ['/how', 'How it works'], ['/winnings', 'Winnings'], ['/free', 'Free Riddlen']];
  const tabs = [['/', 'Board'], ['/write', 'Write'], ['/how', 'How'], ['/winnings', 'Winnings'], ['/free', 'Free']];
  const fullTitle = title ? `${title} · Riddlen` : 'Riddlen';
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description || 'Riddles the machines could not solve. Written by people, tried by AI first, paid in RDLN when the machines lose.'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description || 'Riddles the machines could not solve.'} />
      </Head>
      <header className="hdr">
        <div className="container row">
          <Link href="/" legacyBehavior><a className="brand display">Riddlen</a></Link>
          <nav>
            {nav.map(([href, label]) => (
              <Link key={href} href={href} legacyBehavior><a className={pathname === href ? 'on' : ''}>{label}</a></Link>
            ))}
          </nav>
          <div className="wallet"><Wallet /></div>
        </div>
      </header>
      <main className="container main">{children}</main>
      <nav className="tabs" aria-label="Primary">
        {tabs.map(([href, label]) => (
          <Link key={href} href={href} legacyBehavior><a className={pathname === href ? 'on' : ''}>{label}</a></Link>
        ))}
      </nav>
      <footer className="ftr">
        <div className="container">
          <div className="cols">
            <div>
              <div className="brand display">Riddlen</div>
              <p className="muted">Riddles written by people, tried by machines first, paid in RDLN when the machines lose. Running on Polygon Amoy testnet: the tokens have no value yet.</p>
            </div>
            <div className="links">
              <a href={`${EXPLORER}/address/${CONTRACTS.STUMP}`} target="_blank" rel="noreferrer">Game contract</a>
              <a href={`${EXPLORER}/address/${CONTRACTS.RDLN}`} target="_blank" rel="noreferrer">RDLN token</a>
              <a href="https://github.com/RiddlenBaba/Riddlen" target="_blank" rel="noreferrer">Source</a>
              <a href="https://x.com/RiddlenToken" target="_blank" rel="noreferrer">X</a>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>{`
        .hdr { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--paper) 88%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
        .row { display: flex; align-items: center; gap: 20px; height: 60px; }
        .brand { font-size: 24px; font-style: italic; font-weight: 500; text-decoration: none; letter-spacing: -0.01em; }
        nav { display: flex; gap: 4px; margin-left: 8px; }
        nav a { padding: 6px 10px; border-radius: 8px; text-decoration: none; font-size: 14px; color: var(--ink-2); }
        nav a.on { color: var(--ink); background: var(--paper-2); }
        .wallet { margin-left: auto; }
        .main { padding: 32px 16px 96px; min-height: 70vh; }
        .tabs { display: none; }
        @media (max-width: 719px) {
          nav:not(.tabs) { display: none; }
          .tabs { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; position: fixed; left: 0; right: 0; bottom: 0; z-index: 10; padding: 6px 8px calc(6px + env(safe-area-inset-bottom)); background: color-mix(in srgb, var(--paper) 92%, transparent); backdrop-filter: blur(10px); border-top: 1px solid var(--line); }
          .tabs a { text-align: center; padding: 9px 4px; border-radius: 8px; font-size: 13px; font-weight: 500; text-decoration: none; color: var(--ink-2); }
          .tabs a.on { color: var(--ink); background: var(--paper-2); }
          .ftr { padding-bottom: 96px; }
        }
        @media (min-width: 720px) { .main { padding: 56px 32px 96px; } }
        .ftr { border-top: 1px solid var(--line); padding: 40px 0 48px; font-size: 14px; }
        .cols { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 720px) { .cols { grid-template-columns: 1.4fr 1fr; } }
        .ftr .brand { font-size: 20px; }
        .ftr p { max-width: 46ch; margin: 6px 0 0; }
        .links { display: flex; flex-wrap: wrap; gap: 8px 20px; align-content: start; }
        .links a { color: var(--ink-2); text-decoration: none; border-bottom: 1px solid var(--line); }
        .links a:hover { color: var(--ink); border-color: var(--ink); }
        @media (max-width: 480px) { nav a { padding: 6px 7px; font-size: 13px; } .brand { font-size: 20px; } .row { gap: 10px; } }
      `}</style>
    </>
  );
}
