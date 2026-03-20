# MetaMask Embedded Wallets — React Native Bare Quick Start

A minimal bare React Native example showing how to integrate MetaMask Embedded Wallets (Web3Auth) with social logins (Google, email OTP) and interact with Ethereum using `ethers.js`.

## What this example demonstrates

- Initialising the `@web3auth/react-native-sdk` in a bare React Native app
- Logging in with social providers (Google, email OTP)
- Connecting the built-in EVM provider to `ethers.js`
- Fetching wallet address, balance, and signing a message
- Logging out and clearing session

## Tech stack

- React Native `0.74.x` (bare workflow)
- `@web3auth/react-native-sdk` `^8.0.0`
- `@web3auth/ethereum-provider` `^9.3.0`
- `ethers` `^6.x`
- `react-native-encrypted-storage` (session persistence)
- `@toruslabs/react-native-web-browser` (OAuth in-app browser)

## Prerequisites

- Node.js `>=18`
- React Native development environment — follow the [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup)
- Xcode (iOS) or Android Studio (Android)
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project

## Dashboard Setup

1. Go to [dashboard.web3auth.io](https://dashboard.web3auth.io) and create a new project.
2. Choose **Sapphire Devnet** for development (allows localhost / emulators) or **Sapphire Mainnet** for production.
3. Under **Allowed Origins**, add your app's redirect URL scheme:
   ```
   web3authrnexample://auth
   ```
4. Copy the **Client ID** — you'll paste it into `App.tsx`.

> **Critical**: Sapphire Devnet and Mainnet produce **different wallet addresses** for the same user. Never switch networks in production.

## Installation

```bash
git clone https://github.com/Web3Auth/web3auth-react-native-examples.git
cd web3auth-react-native-examples/rn-bare-quick-start
npm install
```

### iOS

```bash
cd ios && pod install && cd ..
```

## Configuration

Open `App.tsx` and replace the placeholder Client ID with yours:

```typescript
const clientId = "YOUR_CLIENT_ID"; // from dashboard.web3auth.io
```

The redirect URL scheme is already set to `web3authrnexample://auth`. If you change it, update both `App.tsx` and the Android/iOS native config files, and re-add it in the dashboard.

## Running the app

```bash
# Start Metro
npm start

# iOS
npm run ios

# Android
npm run android
```

## How it works

### Initialisation

The SDK is initialised once at module level (outside the React component) with an `EthereumPrivateKeyProvider` for the target chain:

```typescript
import * as WebBrowser from "@toruslabs/react-native-web-browser";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import Web3Auth, { ChainNamespace, WEB3AUTH_NETWORK } from "@web3auth/react-native-sdk";
import EncryptedStorage from "react-native-encrypted-storage";

const chainConfig = {
  chainNamespace: ChainNamespace.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId: "YOUR_CLIENT_ID",
  redirectUrl: "web3authrnexample://auth",
  network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // switch to SAPPHIRE_MAINNET for production
  privateKeyProvider: ethereumPrivateKeyProvider,
});
```

### Login

```typescript
await web3auth.login({ loginProvider: LOGIN_PROVIDER.GOOGLE });
// or email OTP:
await web3auth.login({ loginProvider: LOGIN_PROVIDER.EMAIL_PASSWORDLESS, extraLoginOptions: { login_hint: email } });
```

### Blockchain calls

```typescript
import { ethers } from "ethers";

const ethersProvider = new ethers.BrowserProvider(web3auth.provider!);
const signer = await ethersProvider.getSigner();
const address = await signer.getAddress();
const balance = await ethersProvider.getBalance(address);
```

### Logout

```typescript
await web3auth.logout();
```

## Polyfills

React Native requires Node.js built-ins to be polyfilled for the SDK to work. The required setup is in:

- `metro.config.js` — maps `crypto`, `stream`, and other modules to browser-compatible polyfills
- `globals.js` (or `index.js`) — imports `react-native-get-random-values` and `react-native-quick-crypto` before any other app code

Do not remove these — the SDK will fail to initialise without them.

## Troubleshooting

**Build errors after install**

```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod deintegrate && pod install && cd ..
```

**OAuth redirect not working** — Verify the scheme in `App.tsx` matches the URL you added to the dashboard. For Android, check `AndroidManifest.xml`; for iOS, check `Info.plist`.

**Metro polyfill errors** — See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT — see [LICENSE](../LICENSE).
