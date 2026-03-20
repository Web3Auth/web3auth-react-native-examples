# MetaMask Embedded Wallets — React Native Examples

This repository contains React Native example apps for integrating [MetaMask Embedded Wallets](https://docs.metamask.io/embedded-wallets/) (formerly Web3Auth). Each example demonstrates a specific use case and is fully runnable on iOS and Android.

## What is MetaMask Embedded Wallets?

MetaMask Embedded Wallets (formerly Web3Auth Plug and Play) provides non-custodial social login wallets. Users authenticate with Google, Facebook, Auth0, Firebase, or any JWT provider — and get a deterministic, non-custodial wallet without ever managing a seed phrase.

- **No seed phrases** for users
- **Social logins** (Google, Facebook, Discord, Apple, and more)
- **Custom authentication** via Auth0, Firebase, or any JWT provider
- **Built-in EVM and Solana providers** in the React Native SDK
- **Cross-platform** — runs on iOS and Android

## Examples

### React Native (Bare Workflow)

| Example | Description | Auth Method |
|---|---|---|
| [Quick Start](./rn-bare-quick-start) | Basic integration with Ethereum using social logins | Social (Google, email OTP) |
| [Auth0 Example](./rn-bare-auth0-example) | Custom connection using Auth0 as the JWT provider | Custom (Auth0 JWT) |
| [Firebase Example](./rn-bare-firebase-example) | Custom connection using Firebase Authentication | Custom (Firebase JWT) |
| [Solana Example](./rn-bare-solana-example) | Solana chain integration with the built-in Solana provider | Social |
| [Grouped Connections](./rn-bare-aggregate-verifier-example) | Link multiple auth methods so the same user gets the same wallet | Social (grouped) |

### React Native (Expo)

| Example | Description | Auth Method |
|---|---|---|
| [Expo Example](./rn-expo-example) | Basic integration using Expo managed workflow | Social (Google, email OTP) |

> **Note on SFA examples**: The `sfa-rn-bare-quick-start` and `sfa-rn-expo-auth0-example` folders use the deprecated Single Factor Auth (SFA) / Core Kit SDK. SFA has been superseded by the standard `@web3auth/react-native-sdk`. Refer to the active examples above for new integrations.

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/Web3Auth/web3auth-react-native-examples.git
   ```
2. Go to the example you want to run and follow its individual README.
3. Get a Client ID from the [Web3Auth Dashboard](https://dashboard.web3auth.io).
4. Configure the Client ID, redirect URL scheme, and any auth provider credentials in the example.
5. Run on Android or iOS.

## Key Concepts

**Dashboard setup** — Every example requires a Client ID from [dashboard.web3auth.io](https://dashboard.web3auth.io). You must also allowlist your app's redirect URL scheme (e.g. `web3authrnexample://auth`) in the dashboard under your project's **Allowed Origins**.

**Sapphire networks** — Use `WEB3AUTH_NETWORK.SAPPHIRE_DEVNET` during development (allows localhost), and switch to `WEB3AUTH_NETWORK.SAPPHIRE_MAINNET` for production. Do not mix them — different networks derive different wallet addresses.

**Connections** — The dashboard term for authentication configurations (formerly called "verifiers"). Social logins come pre-configured. For custom auth (Auth0, Firebase, etc.), you create a Custom Connection on the dashboard.

**Polyfills** — React Native does not ship all Node.js built-ins. Each example includes a `metro.config.js` with the required polyfills (`crypto-browserify`, `readable-stream`, etc.) and a `globals.js` / `index.js` that imports them in the correct order before app code.

## Documentation & Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [Dashboard](https://dashboard.web3auth.io)
- [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT — see [LICENSE](./LICENSE).
