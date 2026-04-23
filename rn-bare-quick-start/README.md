# MetaMask Embedded Wallets — React Native Bare Quick Start

A minimal bare React Native example showing how to integrate MetaMask Embedded Wallets (Web3Auth) with email OTP login and interact with Ethereum using `ethers.js`.

## What this example demonstrates

- Wrapping your app in `<Web3AuthProvider>` (the new hooks-based API)
- Logging in with email one-time password (`AUTH_CONNECTION.EMAIL_PASSWORDLESS`)
- Reading wallet address and balance via `ethers.BrowserProvider`
- Signing a message directly with the built-in EVM provider
- Showing the Wallet Services UI overlay
- Enabling and managing MFA
- Logging out and clearing the session

## File tour

| File | What it does |
|---|---|
| `web3authConfig.ts` | The **only file you need to edit** — Client ID, redirect URL, network, chain config |
| `lib/evm.ts` | Pure EVM helpers (`getAddress`, `getBalance`, `signMessage`) — no React, copy-paste friendly |
| `App.tsx` | `<Web3AuthProvider>` wrapper + `HomeScreen` component that uses all the hooks |
| `index.js` | Entry point — imports `@web3auth/react-native-sdk/setup` **first** (required for polyfills) |
| `metro.config.js` | Metro bundler config — wraps with `withWeb3Auth()` for Node.js polyfills |

## Tech stack

- React Native `0.74.x` (bare workflow)
- `@web3auth/react-native-sdk` `^8.1.0` — hooks API (`useWeb3AuthConnect`, etc.)
- `ethers` `^6.x`
- `react-native-encrypted-storage` (session persistence)
- `@toruslabs/react-native-web-browser` (OAuth in-app browser)

## Prerequisites

- Node.js `>=18`
- React Native CLI setup — follow the [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup)
- Xcode (iOS) or Android Studio (Android)
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project

## Dashboard setup

1. Go to [dashboard.web3auth.io](https://dashboard.web3auth.io) and create a new project.
2. Choose **Sapphire Devnet** for development or **Sapphire Mainnet** for production.
3. Under **Allowed Origins**, add:
   ```
   web3authrnexample://auth
   ```
4. Copy the **Client ID** and paste it into `web3authConfig.ts`.

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

## Running the app

```bash
# Start Metro
npm start

# iOS (separate terminal)
npm run ios

# Android (separate terminal)
npm run android
```

## How it works

### 1. Configure (`web3authConfig.ts`)

```typescript
const web3AuthConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: "YOUR_CLIENT_ID",
    redirectUrl: "web3authrnexample://auth",
    network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    chains: [{ chainNamespace: CHAIN_NAMESPACES.EIP155, chainId: "0xaa36a7", rpcTarget: "..." }],
    defaultChainId: "0xaa36a7",
  },
};
```

### 2. Wrap your app (`App.tsx`)

```typescript
<Web3AuthProvider webBrowser={WebBrowser} storage={EncryptedStorage} config={web3AuthConfig}>
  <HomeScreen />
</Web3AuthProvider>
```

### 3. Login (`HomeScreen` in `App.tsx`)

```typescript
const { connectTo } = useWeb3AuthConnect();
await connectTo({
  authConnection: AUTH_CONNECTION.EMAIL_PASSWORDLESS,
  extraLoginOptions: { login_hint: email },
});
```

### 4. Blockchain calls (`lib/evm.ts`)

```typescript
const { provider } = useWeb3Auth();
const address = await getAddress(provider!);
const balance = await getBalance(provider!);
const sig = await signMessage(provider!, "Hello Web3Auth!");
```

### 5. Logout

```typescript
const { disconnect } = useWeb3AuthDisconnect();
await disconnect();
```

## Polyfills

`index.js` imports `@web3auth/react-native-sdk/setup` as the very first line — this seeds the `crypto`, `Buffer`, and `URL` polyfills that the SDK requires. `metro.config.js` uses `withWeb3Auth()` to alias Node.js built-ins for Metro.

Do not remove either — the SDK will fail to initialise without them.

## Troubleshooting

**Build errors after install**

```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod deintegrate && pod install && cd ..
```

**OAuth redirect not working** — Verify the scheme in `web3authConfig.ts` matches the URL you added to the Dashboard. For Android, check `AndroidManifest.xml`; for iOS, check `Info.plist`.

**Metro polyfill errors** — See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT — see [LICENSE](../LICENSE).
