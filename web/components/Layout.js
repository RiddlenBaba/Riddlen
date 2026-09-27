import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CONTRACTS, EXPLORER } from '../lib/wagmi';
import { WalletButton, short } from './Wallet';

export { short };

const NAV = [['/', 'Riddles'], ['/map', 'The map'], ['/me', 'Dashboard'], ['/free', 'Free Riddlen'], ['https://riddlen.org/hunt/', 'How it works'], ['https://riddlen.org', 'Docs']];

export default function Layout({ title, description, children }) {
  const { pathname } = useRouter();
  const nav = NAV;
  const [menu, setMenu] = useState(false);
  useEffect(() => { setMenu(false); }, [pathname]);
  const isOn = (href) => pathname === href || (href !== '/' && !href.startsWith('http') && pathname.startsWith(href));
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
          <button className="burger" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <Link href="/" legacyBehavior><a className="brand display">Riddlen</a></Link>
          <nav className="topnav">
            {nav.map(([href, label]) => href.startsWith('http')
              ? <a key={href} href={href}>{label}</a>
              : <Link key={href} href={href} legacyBehavior><a className={isOn(href) ? 'on' : ''}>{label}</a></Link>)}
          </nav>
          <div className="wallet"><WalletButton /></div>
        </div>
        {menu && (
          <nav className="menu container" aria-label="Primary">
            {nav.map(([href, label]) => href.startsWith('http')
              ? <a key={href} href={href}>{label}</a>
              : <Link key={href} href={href} legacyBehavior><a className={isOn(href) ? 'on' : ''}>{label}</a></Link>)}
            <div className="socials">
              <a href="https://x.com/RiddlenToken" target="_blank" rel="noreferrer">X</a>
              <a href="https://t.me/RiddlenToken" target="_blank" rel="noreferrer">Telegram</a>
              <a href="https://github.com/RiddlenBaba/Riddlen" target="_blank" rel="noreferrer">Source</a>
            </div>
          </nav>
        )}
      </header>
      <main className="container main">{children}</main>
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
              <a href="https://t.me/RiddlenToken" target="_blank" rel="noreferrer">Telegram</a>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>{`
        .hdr { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--paper) 88%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
        .row { display: flex; align-items: center; gap: 20px; height: 60px; }
        .brand { font-size: 24px; font-style: italic; font-weight: 500; text-decoration: none; letter-spacing: -0.01em; color: var(--accent); }
        .topnav { display: flex; gap: 4px; margin-left: 8px; }
        .topnav a { padding: 6px 10px; border-radius: 8px; text-decoration: none; font-size: 14px; color: var(--ink-2); }
        .topnav a.on { color: var(--ink); background: var(--paper-2); }
        .wallet { margin-left: auto; }
        .main { padding: 32px 16px 96px; min-height: 70vh; }
        .burger { display: none; width: 40px; height: 40px; align-items: center; justify-content: center; border: 1px solid var(--line-strong); border-radius: 10px; background: transparent; cursor: pointer; color: var(--ink); }
        .menu { display: none; }
        @media (max-width: 719px) {
          .topnav { display: none; }
          .burger { display: inline-flex; }
          .menu { display: flex; flex-direction: column; padding: 8px 16px 16px; border-top: 1px solid var(--line); }
          .menu a { padding: 12px 4px; text-decoration: none; font-size: 17px; color: var(--ink); border-bottom: 1px solid var(--line); }
          .menu a.on { color: var(--accent); }
          .socials { display: flex; gap: 18px; padding-top: 12px; }
          .socials a { border: none; font-size: 14px; color: var(--ink-2); padding: 4px 0; }
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
        @media (max-width: 480px) { .brand { font-size: 20px; } .row { gap: 10px; } }
      `}</style>
    </>
  );
}
