# MetaMask Embedded Wallets — React Native Bare Solana Example

Shows how to use MetaMask Embedded Wallets with **Solana**. The SDK automatically derives an ed25519 keypair from the user's key shares and exposes it as a `TransactionSigner` from `@solana/signers`. No `SolanaPrivateKeyProvider` or `@web3auth/solana-provider` is needed.

## What this example demonstrates

- Configuring a Solana chain via the `chains` array (`chainNamespace: CHAIN_NAMESPACES.SOLANA`)
- Accessing the `TransactionSigner` from `web3Auth.signer` after login
- Getting the Solana address, balance (via `@solana/web3.js` `Connection`), and signing a message
- Full split structure: `LoginView`, `HomeView`, `Console`, `lib/solana.ts`

## File tour

| File | What it does |
|---|---|
| `web3authConfig.ts` | The **only file you edit** — Client ID, redirect URL, network, Solana chain config |
| `lib/solana.ts` | Pure Solana helpers: `getSolanaAddress`, `getSolanaBalance`, `signSolanaMessage` |
| `components/LoginView.tsx` | Email OTP login — same pattern works for any `AUTH_CONNECTION` |
| `components/HomeView.tsx` | Accesses `web3Auth.signer` as `TransactionSigner`, calls `lib/solana.ts` helpers |
| `components/Console.tsx` | Dumb scrollable output box — `<Console output={...} />` |
| `App.tsx` | `<Web3AuthProvider>` + `Screen` that switches between Login/Home |
| `index.js` | Entry point — `@web3auth/react-native-sdk/setup` must be the very first import |
| `metro.config.js` | `withWeb3Auth()` sets up all polyfill aliases |

## Tech stack

- React Native `0.74.x` (bare workflow)
- `@web3auth/react-native-sdk` `^8.1.0`
- `@solana/web3.js` `^1.x`

## Prerequisites

- Node.js `>=18`, React Native CLI environment, Xcode / Android Studio
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project

## Dashboard setup

1. Create a project at [dashboard.web3auth.io](https://dashboard.web3auth.io).
2. Under **Allowed Origins**, add:
   ```
   solanarnexample://auth
   ```
3. Copy the **Client ID** into `web3authConfig.ts`.
4. Under **Chains**, configure a Solana chain (or rely on the default from `web3AuthConfig.ts`).

## Installation

```bash
cd rn-bare-solana-example
npm install
# iOS
cd ios && pod install && cd ..
```

## Running the app

```bash
npm start
npm run ios      # or npm run android
```

## How it works

### Chain config (`web3authConfig.ts`)

```typescript
chains: [
  {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: "0x2",  // Testnet
    rpcTarget: "https://api.testnet.solana.com",
    ...
  },
],
defaultChainId: "0x2",
```

The SDK detects the `SOLANA` namespace and creates a Solana provider automatically. No `SolanaPrivateKeyProvider` is needed.

### Accessing the signer (`components/HomeView.tsx`)

```typescript
const { web3Auth } = useWeb3Auth();
// After login, web3Auth.signer is a KeyPairSigner (TransactionSigner)
const solanaSigner = web3Auth?.signer as TransactionSigner | null;
```

### Blockchain calls (`lib/solana.ts`)

```typescript
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export function getSolanaAddress(signer: TransactionSigner): string {
  return String(signer.address); // Address is base58 string at runtime
}

export async function getSolanaBalance(signer: TransactionSigner, rpcUrl: string): Promise<string> {
  const connection = new Connection(rpcUrl, "confirmed");
  const lamports = await connection.getBalance(new PublicKey(getSolanaAddress(signer)));
  return `${(lamports / LAMPORTS_PER_SOL).toFixed(4)} SOL`;
}
```

## Troubleshooting

**`@solana/signers` types not found** — The package is a transitive dependency of `@web3auth/react-native-sdk`. Run `npm install` and check that your `node_modules/@solana/signers` folder exists.

**Metro errors** — See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [Solana Integration Guide](https://docs.metamask.io/embedded-wallets/blockchain/solana/)
- [Dashboard](https://dashboard.web3auth.io)

## License

MIT — see [LICENSE](../LICENSE).
