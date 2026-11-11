# MetaMask Embedded Wallets — React Native Expo Example

An Expo-managed workflow example that mirrors `rn-bare-quick-start` but uses `expo-web-browser` and `expo-secure-store` instead of the bare equivalents.

## What this example demonstrates

- Expo-specific provider setup (`expo-web-browser`, `expo-secure-store`, `expo-linking`)
- `index.ts` entry point that imports `@web3auth/react-native-sdk/setup` first
- Logging in with email OTP, reading wallet address/balance, signing a message via `connection.ethereumProvider`
- Wallet Services helpers (wallet UI, MFA, access token, auth token info, session refresh)

## File tour

| File | What it does |
|---|---|
| `web3authConfig.ts` | The **only file you edit** — Client ID, redirect URL (via `expo-linking`), network |
| `lib/evm.ts` | Pure EVM helpers (`getAddress`, `getBalance`, `signMessage`) — no React |
| `App.tsx` | `<Web3AuthProvider>` (Expo variant) + `HomeScreen` with inlined login/logged-in views |
| `index.ts` | Entry point — `@web3auth/react-native-sdk/setup` first, then `registerRootComponent(App)` |
| `babel.config.js` | `hermes-v0` transform profile for Web3Auth transitive deps on Hermes |
| `metro.config.js` | `withWeb3Auth()` on `expo/metro-config` plus Expo-specific resolver fixes |

## Tech stack

- Expo SDK `~51` (React Native `0.74.x` — upgrade to **Expo SDK 56+** / **React Native 0.84+** when available to drop URL polyfills; see [RN 0.84 URL improvements](https://reactnative.dev/blog/2026/02/11/react-native-0.84#url-api-improvements))
- `@web3auth/react-native-sdk` `^10.0.0`
- `expo-web-browser` + `expo-secure-store`
- `@react-native-async-storage/async-storage`
- `react-native-quick-crypto` + `react-native-quick-base64`
- `viem` `^2.x`

## Prerequisites

- Node.js `>=18`
- Expo CLI: `npm install -g expo-cli`
- Expo Go or a development build
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project

## Dashboard setup

1. Create a project at [dashboard.web3auth.io](https://dashboard.web3auth.io).
2. Under **Allowed Origins**, add the redirect URL your build resolves to:
   - Dev client / standalone: `web3authexpoexample://web3auth`
   - Expo Go: output of `Linking.createURL("web3auth", {})` (see `web3authConfig.ts`)
3. Copy the **Client ID** into `web3authConfig.ts`.

## Installation

```bash
cd rn-expo-example
npm install
```

## Running the app

```bash
npm start          # Expo DevTools
npm run ios        # iOS simulator (requires Xcode)
npm run android    # Android emulator (requires Android Studio)
```

## Key difference from bare examples

| | Bare | Expo |
|---|---|---|
| Web browser | `@toruslabs/react-native-web-browser` | `expo-web-browser` |
| Secure storage | `react-native-encrypted-storage` | `expo-secure-store` |
| Redirect URL | scheme in `Info.plist` / `AndroidManifest.xml` | `Linking.createURL()` in `web3authConfig.ts` |
| Entry point | `index.js` with `AppRegistry` | `index.ts` with `registerRootComponent` |

### Provider setup (`App.tsx`)

```typescript
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

<Web3AuthProvider webBrowser={WebBrowser} storage={SecureStore} config={getWeb3AuthConfig(useAA)}>
```

## Polyfills

`index.ts` imports `@web3auth/react-native-sdk/setup` as the very first line. `metro.config.js` uses `withWeb3Auth()` on top of `expo/metro-config`. `babel.config.js` sets `unstable_transformProfile: "hermes-v0"` for Hermes.

Bare workflow examples in this repo target React Native **0.84+**, where `URL` / `URLSearchParams` are built in. This Expo example still runs on SDK 51 (RN 0.74) until Expo SDK 56 is released.

`react-native-quick-base64` is a direct dependency so Expo autolinks the native module used by `react-native-quick-crypto`.

## Troubleshooting

**OAuth redirect not working** — Confirm `web3authexpoexample://web3auth` is allowlisted in the dashboard and matches `app.json` / `Info.plist`.

**Metro / Hermes errors after upgrading deps** — Clear the Metro cache (`npx expo start --clear`) and rebuild the native app. See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [Dashboard](https://dashboard.web3auth.io)

## License

MIT — see [LICENSE](../LICENSE).
