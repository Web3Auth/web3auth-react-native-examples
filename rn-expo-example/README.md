# MetaMask Embedded Wallets — React Native Expo Example

An Expo-managed workflow example that mirrors `rn-bare-quick-start` but uses `expo-web-browser` and `expo-secure-store` instead of the bare equivalents.

## What this example demonstrates

- Expo-specific provider setup (`expo-web-browser`, `expo-secure-store`, `expo-linking`)
- `index.ts` entry point that imports `@web3auth/react-native-sdk/setup` first
- Logging in with email OTP, reading wallet address/balance, signing a message
- Wallet Services helpers (wallet UI, MFA, identity token)

## File tour

| File | What it does |
|---|---|
| `web3authConfig.ts` | The **only file you edit** — Client ID, redirect URL (via `expo-linking`), network, chain config |
| `lib/evm.ts` | Pure EVM helpers (`getAddress`, `getBalance`, `signMessage`) — no React |
| `App.tsx` | `<Web3AuthProvider>` (Expo variant) + `HomeScreen` with inlined login/logged-in views |
| `index.ts` | Entry point — `@web3auth/react-native-sdk/setup` first, then `registerRootComponent(App)` |
| `metro.config.js` | Expo metro config wrapped with `withWeb3Auth()` |

## Tech stack

- Expo SDK `~51`
- `@web3auth/react-native-sdk` `^8.1.0`
- `expo-web-browser` + `expo-secure-store`
- `ethers` `^6.x`

## Prerequisites

- Node.js `>=18`
- Expo CLI: `npm install -g expo-cli`
- Expo Go or a development build (bare Expo)
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project

## Dashboard setup

1. Create a project at [dashboard.web3auth.io](https://dashboard.web3auth.io).
2. Under **Allowed Origins**, add:
   ```
   web3authrnexpoexample://web3auth
   ```
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

### Providers (Expo vs bare)

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

<Web3AuthProvider webBrowser={WebBrowser} storage={SecureStore} config={web3AuthConfig}>
```

## Polyfills

`index.ts` imports `@web3auth/react-native-sdk/setup` as the very first line. `metro.config.js` uses `withWeb3Auth()` on top of `expo/metro-config`. Both are required for the SDK to initialise.

## Troubleshooting

**`Cannot read property 'getRandomValues' of undefined`** — Check that `index.ts` is importing `@web3auth/react-native-sdk/setup` before any other imports, and that `package.json` `"main"` points to `index.ts`.

**Metro polyfill errors** — See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [Dashboard](https://dashboard.web3auth.io)

## License

MIT — see [LICENSE](../LICENSE).
