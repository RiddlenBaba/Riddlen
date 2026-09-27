// House smoke test on a live network: buys one NFT on riddle RIDDLE (default 1) with the house key,
// makes a wrong attempt and then the right one, decrypts the location. Leaves the claim alone.
//   RIDDLE=1 npx hardhat run scripts/hunt/smoke.js --network amoy

const { ethers } = require("hardhat");
const H = require("./lib/huntCrypto");
const { house, loadSecret } = require("./lib");
async function main() {
  const { signer, hunt, nft, chainId, address } = await house();
  const id = Number(process.env.RIDDLE || 1);
  const secret = loadSecret(id);
  const rdln = await ethers.getContractAt("IRDLN", await hunt.rdln(), signer);
  let bal = await rdln.balanceOf(signer.address);
  console.log("house RDLN", ethers.formatEther(bal));
  if (bal < ethers.parseEther("200")) { await (await rdln.mintPrizePool(signer.address, ethers.parseEther("1000"))).wait(); console.log("minted 1000 RDLN to house"); }
  const price = await hunt.mintPrice();
  let tx = await hunt.mint(id); let rc = await tx.wait();
  const tokenId = (await nft.nextId()) - 1n;
  console.log(`minted token ${tokenId} for ${ethers.formatEther(price)} RDLN in ${rc.hash}`);
  const t = await hunt.getToken(tokenId);
  const guess = async (answer) => {
    const Hh = await H.answerHash({ chainId, hunt: address, riddleId: id, answer });
    const a = H.attemptFor(id, Number(t.index), Hh, 0);
    return { ...a, leaf: H.hex(a.leaf), proof: a.proof.map(H.hex), H: Hh };
  };
  for (const ans of ["a rope", secret.answers[0]]) {
    const g = await guess(ans);
    const before = await rdln.balanceOf(signer.address);
    tx = await hunt.attempt(tokenId, g.alt, g.leaf, g.proof); rc = await tx.wait();
    const tt = await hunt.getToken(tokenId);
    const loc = tt.unlockedAt > 0n ? await H.decryptLocation({ riddleId: id, H: g.H, cipher: H.unhex((await hunt.getRiddle(id)).locationCipher) }) : null;
    console.log(`attempt "${ans}": cost ${ethers.formatEther(before - await rdln.balanceOf(signer.address))} RDLN, unlocked ${tt.unlockedAt > 0n}${loc ? `, location: ${loc.slice(0, 60)}…` : ""} (${rc.hash})`);
  }
  console.log("claim left for the user to test with the printed QR");
}
main().catch((e) => { console.error(e); process.exit(1); });
