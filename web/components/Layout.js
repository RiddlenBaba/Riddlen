import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CONTRACTS, EXPLORER } from '../lib/wagmi';
import { WalletButton, short } from './Wallet';

export { short };

export default function Layout({ title, description, children }) {
  const { pathname } = useRouter();
  const nav = [['/', 'Riddles'], ['/map', 'The map'], ['/me', 'Dashboard'], ['/free', 'Free Riddlen'], ['https://riddlen.org/hunt/', 'How it works'], ['https://riddlen.org', 'Docs']];
  const tabs = [['/', 'Riddles'], ['/map', 'Map'], ['/me', 'Me'], ['/free', 'Free']];
  const fullTitle = title ? `${title} · Riddlen` : 'Riddlen';
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description || 'Riddlen: a scavenger hunt for the whole world. Buy a riddle, solve it, go find what was hidden, get paid in RDLN.'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description || 'A scavenger hunt for the whole world.'} />
      </Head>
      <header className="hdr">
        <div className="container row">
          <Link href="/" legacyBehavior><a className="brand display">Riddlen</a></Link>
          <nav>
            {nav.map(([href, label]) => href.startsWith('http')
              ? <a key={href} href={href} target="_blank" rel="noreferrer">{label} ↗</a>
              : <Link key={href} href={href} legacyBehavior><a className={pathname === href || (href !== '/' && pathname.startsWith(href)) ? 'on' : ''}>{label}</a></Link>)}
          </nav>
          <div className="wallet"><WalletButton /></div>
        </div>
      </header>
      <main className="container main">{children}</main>
      <nav className="tabs" aria-label="Primary">
        {tabs.map(([href, label]) => (
          <Link key={href} href={href} legacyBehavior><a className={pathname === href || (href !== '/' && pathname.startsWith(href)) ? 'on' : ''}>{label}</a></Link>
        ))}
      </nav>
      <footer className="ftr">
        <div className="container">
          <div className="cols">
            <div>
              <div className="brand display">Riddlen</div>
              <p className="muted">A scavenger hunt for the whole world, paid in RDLN. Every attempt burns. Running on Polygon Amoy testnet: the tokens have no value yet.</p>
            </div>
            <div className="links">
              <a href="https://riddlen.org" target="_blank" rel="noreferrer">Docs</a>
              <a href="https://riddlen.org/next/" target="_blank" rel="noreferrer">The design</a>
              <a href={`${EXPLORER}/address/${CONTRACTS.HUNT}`} target="_blank" rel="noreferrer">Hunt contract</a>
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
        .brand { font-size: 24px; font-style: italic; font-weight: 500; text-decoration: none; letter-spacing: -0.01em; color: var(--accent); }
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
