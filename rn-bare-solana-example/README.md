# MetaMask Embedded Wallets — React Native Bare Solana Example

Shows how to use MetaMask Embedded Wallets with **Solana**. The SDK derives an ed25519 keypair from the user's key shares and exposes it as a wallet-standard `Wallet` via `connection.solanaWallet`. Wrap the app in `SolanaProvider` from `@web3auth/react-native-sdk/solana` to use the signing hooks.

## What this example demonstrates

- Solana chain configuration from the Web3Auth Dashboard (fetched at SDK init)
- Nesting `SolanaProvider` inside `Web3AuthProvider`
- Accessing accounts and RPC via `useSolanaWallet()`
- Signing messages via `useSignMessage()` from `@web3auth/react-native-sdk/solana`
- Wallet Services overlay (Wallet UI, MFA, auth tokens) — chain-agnostic
- Full split structure: `LoginView`, `HomeView`, `Console`, `lib/solana.ts`

## File tour

| File | What it does |
|---|---|
| `web3authConfig.ts` | Client ID, redirect URL, network, and optional `defaultChainId` |
| `lib/solana.ts` | Pure Solana helper: `getSolanaBalance` using the RPC client from `useSolanaWallet()` |
| `components/LoginView.tsx` | Email OTP login — same pattern works for any `AUTH_CONNECTION` |
| `components/HomeView.tsx` | Uses `useSolanaWallet` / `useSignMessage`, Wallet Services hooks, and `lib/solana.ts` |
| `components/Console.tsx` | Dumb scrollable output box — `<Console output={...} />` |
| `App.tsx` | `<Web3AuthProvider>` + `<SolanaProvider>` + `Screen` that switches between Login/Home |
| `index.js` | Entry point — `@web3auth/react-native-sdk/setup` and `polyfills.js` must load before other imports |
| `metro.config.js` | `withWeb3Auth()` sets up all polyfill aliases |

## Tech stack

- React Native `0.74.x` (bare workflow)
- `@web3auth/react-native-sdk` `^10.0.0`
- `@solana/react-hooks` `^1.4.x` (peer for `/solana` subpath)
- `@solana/kit` `^6.x`
- `@react-native-async-storage/async-storage` `^1.23.x` (peer for `@metamask/connect-multichain` via `@solana/react-hooks`)

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
4. Under **Chains**, add a Solana chain (e.g. Solana Testnet). The SDK fetches chain config from the dashboard at init — no local `chains` array is needed.
5. If you set `defaultChainId` in `web3authConfig.ts`, it must match a `chainId` from your dashboard Solana chain (e.g. `0x2` for Testnet).

### iOS deep link

`redirectUrl` uses the `solanarnexample` scheme. Register it in `ios/web3authrnexample/Info.plist` under `CFBundleURLTypes` (already included in this example). Rebuild the native app after changing it:

```bash
cd ios && pod install && cd ..
npm run ios
```

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

### Provider setup (`App.tsx`)

```typescript
import { SolanaProvider } from "@web3auth/react-native-sdk/solana";

<Web3AuthProvider webBrowser={WebBrowser} storage={EncryptedStorage} config={web3AuthConfig}>
  <SolanaProvider>
    <Screen />
  </SolanaProvider>
</Web3AuthProvider>
```

### Chain config (Dashboard)

Configure Solana under **Chains** in the [Web3Auth Dashboard](https://dashboard.web3auth.io). The SDK merges that with `web3AuthOptions` during `init()`. Optionally set `defaultChainId` in `web3authConfig.ts` to select which dashboard chain to use on connect.

### Solana hooks (`components/HomeView.tsx`)

```typescript
import { useSignMessage, useSolanaWallet } from "@web3auth/react-native-sdk/solana";

const { accounts, rpc } = useSolanaWallet();
const { signMessage } = useSignMessage();

const solanaAddress = accounts?.[0] ?? null;
const balance = rpc && solanaAddress ? await getSolanaBalance(rpc, solanaAddress) : null;
const signature = await signMessage("Hello Web3Auth!");
```

## Troubleshooting

**`@solana/react-hooks` not found** — Install it explicitly: `npm install @solana/react-hooks@^1.4.1`. It is a required peer when importing `@web3auth/react-native-sdk/solana`.

**`@react-native-async-storage/async-storage` not found** — Install it explicitly: `npm install @react-native-async-storage/async-storage@^1.23.1`. Required by `@metamask/connect-multichain` (pulled in via `@solana/react-hooks`). After installing, run `cd ios && pod install` for iOS.

**`AbortSignal.timeout` / `window.addEventListener` errors** — These come from `@solana/react-hooks` and `@wallet-standard/app` expecting browser APIs. This example ships `polyfills.js`, imported in `index.js` right after `@web3auth/react-native-sdk/setup`. Keep that import order.

**`Invalid provider Config, Please provide chain` (code 5008)** — The dashboard has no chain matching `defaultChainId` in `web3authConfig.ts`, or no Solana chain is configured on the dashboard. Add a Solana chain under **Chains** in the dashboard and ensure `defaultChainId` matches its `chainId` (or remove `defaultChainId` to use the first dashboard chain).

**Login returns to the login screen / second login does nothing** — Ensure `solanarnexample://auth` is allowlisted in the dashboard and the iOS URL scheme is registered in `Info.plist`. Rebuild the native app after native changes. Enter your email again after a reload — the field resets on reload.

**Metro errors** — See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [Solana Integration Guide](https://docs.metamask.io/embedded-wallets/blockchain/solana/)
- [Dashboard](https://dashboard.web3auth.io)

## License

MIT — see [LICENSE](../LICENSE).
