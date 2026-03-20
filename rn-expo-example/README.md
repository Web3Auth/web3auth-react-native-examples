# MetaMask Embedded Wallets — React Native Expo Example

A React Native example using the **Expo managed workflow** showing how to integrate MetaMask Embedded Wallets (Web3Auth) with social logins and interact with Ethereum using `ethers.js`.

## What this example demonstrates

- Initialising `@web3auth/react-native-sdk` in an Expo app using `expo-web-browser` and `expo-secure-store`
- Dynamic redirect URL handling for both Expo Go and standalone (custom dev client / EAS) builds
- Logging in with social providers (Google, email OTP)
- Fetching wallet address, balance, and signing a message
- Logging out and clearing session

## Tech stack

- Expo `~51.x` (managed workflow)
- React Native `0.74.x`
- `@web3auth/react-native-sdk` `^8.0.0`
- `@web3auth/ethereum-provider` `^9.3.0`
- `ethers` `^6.x`
- `expo-web-browser` (OAuth in-app browser)
- `expo-secure-store` (session persistence)

## Prerequisites

- Node.js `>=18`
- Expo CLI: `npm install -g expo-cli`
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project

> **Expo Go is not supported.** The Web3Auth SDK uses native modules that are not available in Expo Go. Use a [Custom Dev Client](https://docs.expo.dev/clients/installation/) or an [EAS Build](https://docs.expo.dev/build/introduction/).

## Dashboard Setup

1. Go to [dashboard.web3auth.io](https://dashboard.web3auth.io) and create or open your project.
2. Choose **Sapphire Devnet** for development or **Sapphire Mainnet** for production.
3. Under **Allowed Origins**, add the redirect URL for your standalone build:
   ```
   web3authexpoexample://web3auth
   ```
4. Copy your **Client ID**.

## Installation

```bash
git clone https://github.com/Web3Auth/web3auth-react-native-examples.git
cd web3auth-react-native-examples/rn-expo-example
npm install
```

## Configuration

In `App.tsx`, replace the placeholder Client ID:

```typescript
const clientId = "YOUR_CLIENT_ID"; // from dashboard.web3auth.io
```

The redirect URL is set dynamically: it uses `Linking.createURL` with the `web3authexpoexample` scheme for standalone builds, or Expo's hosted URL for Expo Go (during development with a custom dev client).

## Running the app

### Development build (recommended)

```bash
# Build a custom dev client first
npx expo run:ios      # or
npx expo run:android
```

### EAS Build

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

Then start the development server:

```bash
npx expo start --dev-client
```

## How it works

### Expo-specific initialisation

The Expo example uses `expo-web-browser` and `expo-secure-store` instead of the bare workflow's `@toruslabs/react-native-web-browser` and `react-native-encrypted-storage`:

```typescript
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import Web3Auth, { WEB3AUTH_NETWORK, ChainNamespace } from "@web3auth/react-native-sdk";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const redirectUrl = Linking.createURL("web3auth", { scheme: "web3authexpoexample" });

const web3auth = new Web3Auth(WebBrowser, SecureStore, {
  clientId: "YOUR_CLIENT_ID",
  redirectUrl,
  network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider: ethereumPrivateKeyProvider,
});
```

### Login

```typescript
await web3auth.login({ loginProvider: LOGIN_PROVIDER.GOOGLE });
// or email OTP:
await web3auth.login({
  loginProvider: LOGIN_PROVIDER.EMAIL_PASSWORDLESS,
  extraLoginOptions: { login_hint: email },
});
```

### Ethereum interaction

```typescript
import { ethers } from "ethers";

const ethersProvider = new ethers.BrowserProvider(web3auth.provider!);
const signer = await ethersProvider.getSigner();
const address = await signer.getAddress();
const balance = await ethersProvider.getBalance(address);
```

## Polyfills

Expo also requires Node.js polyfills. They are configured in:

- `metro.config.js` — resolves `crypto`, `stream`, etc. to browser-compatible alternatives
- `globals.js` — imports `react-native-get-random-values` and polyfills before any app code

The entry point (`expo/AppEntry.js` via `package.json#main`) ensures polyfills are loaded first.

## Troubleshooting

**App crashes with `Cannot read property 'randomBytes' of undefined`**
- Ensure `globals.js` is imported at the very top of `App.tsx` (before any other imports).

**Redirect loop / auth callback not received**
- Confirm `web3authexpoexample` scheme is registered in `app.json` under `scheme`.
- Confirm the same URL is allowlisted in the Web3Auth Dashboard.

**`expo-web-browser` not working**
- Make sure you are using a Custom Dev Client or EAS build — Expo Go does not support this.

**Metro polyfill errors**
- See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [Expo Custom Dev Clients](https://docs.expo.dev/clients/installation/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT — see [LICENSE](../LICENSE).
