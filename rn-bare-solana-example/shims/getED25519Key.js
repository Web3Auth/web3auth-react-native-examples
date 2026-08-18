const { ed25519 } = require("@noble/curves/ed25519");

function toBytes(privateKey) {
  if (typeof privateKey !== "string") {
    return privateKey instanceof Uint8Array ? privateKey : new Uint8Array(privateKey);
  }

  const hex = privateKey.replace(/^0x/, "");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Web3Auth may return either a 32-byte ed25519 seed (64 hex chars) or a full
 * 64-byte Solana secret key (128 hex chars). The stock @web3auth/auth helper
 * only handles the 32-byte form and throws on 64-byte input.
 */
function getED25519Key(privateKey) {
  const privKey = toBytes(privateKey);

  if (privKey.byteLength === 64) {
    return { sk: privKey, pk: privKey.slice(32) };
  }

  const pk = ed25519.getPublicKey(privKey);
  const sk = new Uint8Array(64);
  sk.set(privKey, 0);
  sk.set(pk, 32);
  return { sk, pk };
}

module.exports = { getED25519Key };
