import type { TransactionSigner } from "@solana/signers";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// IMP START - Blockchain Calls
/**
 * Returns the Solana public key (base58 address) from the TransactionSigner.
 *
 * After login, access the signer via `web3Auth.signer` from `useWeb3Auth()`.
 * Cast it to `TransactionSigner` when the chain namespace is SOLANA.
 */
export function getSolanaAddress(signer: TransactionSigner): string {
  // `signer.address` is an opaque `Address` type that is a base58 string at runtime
  return String(signer.address);
}

/**
 * Returns the SOL balance for the signer's address.
 *
 * @param signer  TransactionSigner from `web3Auth.signer`
 * @param rpcUrl  Solana RPC endpoint (from web3authConfig.ts)
 */
export async function getSolanaBalance(signer: TransactionSigner, rpcUrl: string): Promise<string> {
  const connection = new Connection(rpcUrl, "confirmed");
  const pubkey = new PublicKey(getSolanaAddress(signer));
  const lamports = await connection.getBalance(pubkey);
  return `${(lamports / LAMPORTS_PER_SOL).toFixed(4)} SOL`;
}

/**
 * Signs a UTF-8 message with the user's Solana key.
 *
 * Uses the `signMessages` method from the `@solana/signers` v2 API.
 * Returns the base64-encoded signature.
 */
export async function signSolanaMessage(signer: TransactionSigner, message: string): Promise<string> {
  // `signMessages` is available on MessageSigningCapableSignerAccount (KeyPairSigner)
  const signingCapable = signer as TransactionSigner & {
    signMessages: (msgs: { content: Uint8Array }[]) => Promise<{ signature: Uint8Array }[]>;
  };
  const encoded = new TextEncoder().encode(message);
  const [result] = await signingCapable.signMessages([{ content: encoded }]);
  return Buffer.from(result.signature).toString("base64");
}
// IMP END - Blockchain Calls
