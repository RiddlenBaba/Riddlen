import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectInline } from '../components/Wallet';
import Layout from '../components/Layout';
import { useActions, useMe } from '../hooks/useStump';
import { rdln } from '../components/format';

// The sticker page. Scan the code, connect, get your Riddlen.
export default function Free() {
  const { address, isConnected } = useAccount();
  const me = useMe(undefined, address);
  const actions = useActions(address);
  const busy = !!actions.pending;

  return (
    <Layout title="Free Riddlen" description="Get your Riddlen. Free. Then go solve riddles the machines couldn't.">
      <section className="free">
        <h1 className="display">Free Riddlen.</h1>
        <p className="lede">Riddlen is a game. People write riddles, three frontier AIs try them first, and you get paid when you beat the machines. To play you need a little Riddlen. Here is some, free.</p>

        <div className="card box">
          {!isConnected && (
            <>
              <p>Connect a wallet on Polygon Amoy. No wallet? <a href="https://metamask.io" target="_blank" rel="noreferrer">MetaMask</a> takes two minutes.</p>
              <ConnectInline />
            </>
          )}
          {isConnected && me.faucet.available && (
            <>
              <p>One dose per wallet: <b>{rdln(me.faucet.amount)} RDLN</b>, enough for a good few riddles.</p>
              <button className="btn accent" disabled={busy} onClick={() => actions.claimFaucet().then((ok) => ok && me.refetch())}>{busy ? 'Claiming…' : 'Take your Riddlen'}</button>
            </>
          )}
          {isConnected && !me.faucet.available && (
            <>
              <p>You&apos;re riddlen. Balance: <b>{rdln(me.rdln)} RDLN</b>.</p>
              <Link href="/" legacyBehavior><a className="btn primary">Go solve something</a></Link>
            </>
          )}
          {actions.error && <p className="notice warn">{actions.error}</p>}
        </div>

        <p className="fine muted">Testnet tokens. No value, no promises, no side effects except an urge to solve riddles.</p>
      </section>
      <style jsx>{`
        .free { display: flex; flex-direction: column; gap: 22px; max-width: 640px; margin: 0 auto; text-align: center; align-items: center; padding-top: 6vh; }
        h1 { font-size: clamp(52px, 11vw, 112px); margin: 0; font-style: italic; }
        .lede { font-size: 18px; color: var(--ink-2); margin: 0; }
        .box { display: flex; flex-direction: column; gap: 14px; align-items: center; padding: 28px; width: 100%; }
        .box p { margin: 0; }
        .fine { font-size: 13px; }
      `}</style>
    </Layout>
  );
}
