import Link from 'next/link';
import { useAccount } from 'wagmi';
import Layout from '../components/Layout';
import { ConnectInline, useWalletTotals } from '../components/Wallet';
import { AddTokenButton, GasButton } from '../components/Onboard';
import { useActions, useMe } from '../hooks/useStump';
import { rdln } from '../components/format';

// The sticker page. Scan the code, connect, get gas, get your Riddlen, see it in your wallet.
export default function Free() {
  const { address, isConnected, connector } = useAccount();
  const me = useMe(undefined, address);
  const totals = useWalletTotals(address);
  const actions = useActions(address);
  const busy = !!actions.pending;
  const hasGas = totals.gas >= 10n ** 16n;
  const hasRdln = totals.rdln > 0n;

  const steps = [
    {
      title: 'Connect a wallet',
      done: isConnected,
      body: isConnected
        ? <span className="muted">Connected with {connector?.name || 'your wallet'}.</span>
        : <>
            <p>Any browser wallet works. No wallet? <a href="https://metamask.io" target="_blank" rel="noreferrer">MetaMask</a> takes two minutes. The site will ask to switch to the Polygon Amoy testnet.</p>
            <ConnectInline />
          </>,
    },
    {
      title: 'Get a splash of gas',
      done: hasGas,
      body: hasGas
        ? <span className="muted">You have gas. Every transaction burns a tiny bit of test POL.</span>
        : <>
            <p>Transactions on Amoy need test POL, which is free but annoying to find. We&apos;ll send you some.</p>
            {isConnected ? <GasButton address={address} className="btn accent" /> : <span className="muted">Connect first.</span>}
          </>,
    },
    {
      title: 'Take your Riddlen',
      done: hasRdln || (isConnected && !me.faucet.available),
      body: hasRdln
        ? <span className="muted">You&apos;re riddlen. Balance: <b>{rdln(totals.rdln)} RDLN</b>.</span>
        : isConnected && me.faucet.available
          ? <>
              <p>One dose per wallet: <b>{rdln(me.faucet.amount)} RDLN</b>, enough for a good few riddles.</p>
              <button className="btn accent" disabled={busy || !hasGas} onClick={() => actions.claimFaucet().then((ok) => ok && me.refetch())}>{busy ? 'Claiming…' : hasGas ? 'Take your Riddlen' : 'Get gas first'}</button>
              {actions.error && <p className="notice warn">{actions.error}</p>}
            </>
          : <span className="muted">Connect first.</span>,
    },
    {
      title: 'See it in your wallet',
      done: false,
      body: <>
        <p>RDLN is new, so wallets don&apos;t list it until you add it. One tap registers it; your balance then shows next to your other tokens.</p>
        {isConnected ? <AddTokenButton className="btn" /> : <span className="muted">Connect first.</span>}
      </>,
    },
  ];

  return (
    <Layout title="Free Riddlen" description="Get your Riddlen. Free. Then go solve riddles the machines couldn't.">
      <section className="free">
        <h1 className="display">Free Riddlen.</h1>
        <p className="lede">Riddlen is a game. People write riddles, three frontier AIs try them first, and you get paid when you beat the machines. To play you need a little Riddlen. Here is some, free, in four steps.</p>

        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} className={s.done ? 'done' : ''}>
              <span className="n mono">{s.done ? '✓' : i + 1}</span>
              <div className="body"><strong>{s.title}</strong><div>{s.body}</div></div>
            </li>
          ))}
        </ol>

        {hasRdln && <p className="go"><Link href="/" legacyBehavior><a className="btn primary">Go solve something</a></Link></p>}
        <p className="fine muted">Testnet tokens. No value, no promises, no side effects except an urge to solve riddles.</p>
      </section>
      <style jsx>{`
        .free { display: flex; flex-direction: column; gap: 22px; max-width: 680px; margin: 0 auto; padding-top: 4vh; }
        h1 { font-size: clamp(52px, 11vw, 112px); margin: 0; font-style: italic; text-align: center; }
        .lede { font-size: 18px; color: var(--ink-2); margin: 0; text-align: center; }
        .steps { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        li { display: flex; gap: 14px; padding: 16px 18px; border: 1px solid var(--line); border-radius: 14px; }
        li.done { opacity: 0.75; border-color: var(--human); }
        .n { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--line-strong); flex: none; font-size: 12px; }
        li.done .n { background: var(--human); color: var(--paper); border-color: var(--human); }
        .body { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .body :global(p) { margin: 0; }
        .go { text-align: center; margin: 0; }
        .fine { font-size: 13px; text-align: center; margin: 0; }
      `}</style>
    </Layout>
  );
}
