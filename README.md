# MetaMask Embedded Wallets — React Native Examples

This repository contains React Native example apps for integrating [MetaMask Embedded Wallets](https://docs.metamask.io/embedded-wallets/) (formerly Web3Auth). Each example demonstrates a specific use case and is fully runnable on iOS and Android.

All examples use the **v9 hooks API** (`Web3AuthProvider`, `useWeb3AuthConnect`, `useWeb3AuthDisconnect`, etc.) from `@web3auth/react-native-sdk`, which mirrors the pattern of the Web SDK.

## What is MetaMask Embedded Wallets?

MetaMask Embedded Wallets (formerly Web3Auth Plug and Play) provides non-custodial social login wallets. Users authenticate with Google, Facebook, Auth0, Firebase, or any JWT provider — and get a deterministic, non-custodial wallet without ever managing a seed phrase.

- **No seed phrases** for users
- **Social logins** (Google, Facebook, Discord, Apple, and more)
- **Custom authentication** via Auth0, Firebase, or any JWT provider
- **Built-in EVM and Solana providers** derived automatically from the `chains` config
- **Cross-platform** — runs on iOS and Android

## Examples

### React Native (Bare Workflow)

| Example | Description | Auth Method |
|---|---|---|
| [Quick Start](./rn-bare-quick-start) | Minimal integration with Ethereum and email OTP | Email OTP |
| [Auth0 Example](./rn-bare-auth0-example) | SDK-native Auth0 login — no `react-native-auth0` required | Custom (Auth0, SDK-native) |
| [Firebase Example](./rn-bare-firebase-example) | Bring-your-own-JWT with Firebase Authentication | Custom (Firebase JWT) |
| [Solana Example](./rn-bare-solana-example) | Solana chain integration with the built-in Solana provider | Email OTP |
| [Grouped Connections](./rn-bare-aggregate-verifier-example) | Link multiple auth methods so the same user always gets the same wallet | Social + Custom (grouped) |

### React Native (Expo)

| Example | Description | Auth Method |
|---|---|---|
| [Expo Example](./rn-expo-example) | Expo managed workflow with `expo-web-browser` and `expo-secure-store` | Email OTP |

> The deprecated SFA (Single Factor Auth / Core Kit) SDK has been removed. The bring-your-own-JWT pattern previously shown in SFA examples is now demonstrated by `rn-bare-firebase-example`.

## How these examples are organized

Examples follow one of two structures — pick the one that matches your goal:

**Single-file (quick-start tier):** `rn-bare-quick-start` and `rn-expo-example` put everything in one `App.tsx`. Read it top to bottom and you have the full integration. Start here if you are new to Web3Auth.

**Split into `components/` (feature tier):** `rn-bare-auth0-example`, `rn-bare-firebase-example`, `rn-bare-solana-example`, and `rn-bare-aggregate-verifier-example` separate the login screen (`LoginView.tsx`), logged-in screen (`HomeView.tsx`), and console output (`Console.tsx`). The login file is the _point_ of each example — it contains only what is unique to that auth method. Start with `App.tsx` (provider + routing), then open `components/LoginView.tsx` to see the auth-specific code.

Both tiers use the same `web3authConfig.ts` for chain and SDK configuration, and the same `lib/evm.ts` (or `lib/solana.ts`) for blockchain calls.

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/Web3Auth/web3auth-react-native-examples.git
   ```
2. Go to the example you want to run and follow its individual README.
3. Get a Client ID from the [Web3Auth Dashboard](https://dashboard.web3auth.io).
4. Paste the Client ID into `web3authConfig.ts` in the example folder and update the redirect URL.
5. Run on Android or iOS.

## Key Concepts

**Hooks API** — Every example wraps the app in `<Web3AuthProvider webBrowser={...} storage={...} config={...}>` and uses hooks: `useWeb3Auth`, `useWeb3AuthConnect`, `useWeb3AuthDisconnect`, `useWeb3AuthUser`, and more. The imperative `new Web3Auth(...)` style from older docs is superseded by this pattern.

**Dashboard setup** — Every example requires a Client ID from [dashboard.web3auth.io](https://dashboard.web3auth.io). You must also allowlist your app's redirect URL scheme (e.g. `web3authrnexample://auth`) under **Allowed Origins** in the Dashboard.

**`AUTH_CONNECTION`** — Replaces the old `LOGIN_PROVIDER` enum. Use `AUTH_CONNECTION.EMAIL_PASSWORDLESS`, `AUTH_CONNECTION.GOOGLE`, `AUTH_CONNECTION.CUSTOM`, etc. when calling `connectTo(...)`.

**Chain configuration** — Instead of constructing `EthereumPrivateKeyProvider` or `SolanaPrivateKeyProvider`, pass a `chains` array and `defaultChainId` in `web3AuthOptions`. The SDK creates the appropriate provider automatically based on the `chainNamespace`.

**`authConnectionId`** — Replaces `loginConfig.jwt.verifier`. Set it to the Connection ID in your Dashboard. For grouped connections, also pass `groupedAuthConnectionId`.

**Sapphire networks** — Use `WEB3AUTH_NETWORK.SAPPHIRE_DEVNET` during development and switch to `WEB3AUTH_NETWORK.SAPPHIRE_MAINNET` for production. The two networks derive different wallet addresses — never mix them.

**Polyfills** — Every example's `index.js` / `index.ts` imports `@web3auth/react-native-sdk/setup` as the very first statement (seeds `crypto`, `Buffer`, and `URL` polyfills). `metro.config.js` wraps the config with `withWeb3Auth(getDefaultConfig(__dirname))` — no manual `extraNodeModules` block needed.

## Documentation & Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [v8 to v9 Migration Guide](https://docs.metamask.io/embedded-wallets/sdk/react-native/migration-guides/rn-v8-to-v9/)
- [Hooks Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/hooks/)
- [Dashboard](https://dashboard.web3auth.io)
- [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT — see [LICENSE](./LICENSE).
