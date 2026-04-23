# MetaMask Embedded Wallets — React Native Bare Auth0 Example

Shows how to use **Auth0 as a Custom Connection** (bring-your-own-OAuth) with MetaMask Embedded Wallets in a bare React Native app.

The SDK handles the entire OAuth flow via an in-app browser — no `react-native-auth0` dependency is required. You configure the Auth0 tenant once in the Web3Auth Dashboard, and the SDK brokers the login transparently.

## What this example demonstrates

- Configuring a Custom Connection (`AUTH_CONNECTION.CUSTOM`) backed by Auth0
- Full split structure: `LoginView`, `HomeView`, `Console`, `lib/evm.ts` — each file has one job
- The SDK-native approach (no external Auth0 library)
- Wallet Services overlay for signing, MFA, and Wallet UI
- Session persistence with `react-native-encrypted-storage`

## File tour

| File | What it does |
|---|---|
| `web3authConfig.ts` | The **only file you edit** — Client ID, redirect URL, network, chain config |
| `lib/evm.ts` | Pure EVM helpers (`getAddress`, `getBalance`, `signMessage`) — no React |
| `components/LoginView.tsx` | Single "Login with Auth0" button → `connectTo({ authConnection: CUSTOM, authConnectionId })` |
| `components/HomeView.tsx` | All post-login actions — blockchain calls, wallet UI, MFA, disconnect |
| `components/Console.tsx` | Dumb scrollable output box — `<Console output={...} />` |
| `App.tsx` | `<Web3AuthProvider>` + `Screen` component that switches between Login/Home |
| `index.js` | Entry point — `@web3auth/react-native-sdk/setup` must be the very first import |
| `metro.config.js` | `withWeb3Auth()` sets up all polyfill aliases |

## Tech stack

- React Native `0.74.x` (bare workflow)
- `@web3auth/react-native-sdk` `^8.1.0`
- `ethers` `^6.x`
- `@toruslabs/react-native-web-browser`
- `react-native-encrypted-storage`

## Prerequisites

- Node.js `>=18`, React Native CLI environment, Xcode / Android Studio
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project with an Auth0 Custom Connection configured

## Dashboard setup

1. Create a project at [dashboard.web3auth.io](https://dashboard.web3auth.io).
2. Under **Connections**, create a **Custom Connection** with:
   - Auth type: `JWT`
   - Auth0 domain: `https://web3auth.au.auth0.com`
   - Connection ID: `w3a-auth0-demo` (used as `authConnectionId` in code)
   - Verifier ID field: `sub`
3. Under **Allowed Origins**, add:
   ```
   web3authrnbareauth0example://auth
   ```
4. Copy the **Client ID** into `web3authConfig.ts`.

## Installation

```bash
cd rn-bare-auth0-example
npm install
# iOS
cd ios && pod install && cd ..
```

## Running the app

```bash
npm start        # Metro bundler
npm run ios      # iOS simulator
npm run android  # Android emulator
```

## How it works

### Login (`components/LoginView.tsx`)

```typescript
// The SDK opens Auth0's login page in an in-app browser and derives the key.
// No react-native-auth0 required.
connectTo({
  authConnection: AUTH_CONNECTION.CUSTOM,
  authConnectionId: "w3a-auth0-demo",   // your Dashboard Connection ID
  extraLoginOptions: {
    domain: "https://web3auth.au.auth0.com",
    verifierIdField: "sub",
  },
});
```

### Blockchain calls (`lib/evm.ts`)

```typescript
const { provider } = useWeb3Auth(); // EIP-1193 provider, use directly with ethers
const address = await getAddress(provider!);
const balance = await getBalance(provider!);
```

### Signing via Wallet Services overlay (`components/HomeView.tsx`)

```typescript
const { request } = useSignatureRequest();
const sig = await request("personal_sign", ["Hello Web3Auth!", "0x"]);
```

## Troubleshooting

**OAuth redirect not working** — Confirm `web3authrnbareauth0example://auth` is in the Dashboard's Allowed Origins, and the scheme appears in `AndroidManifest.xml` and `Info.plist`.

**Metro errors** — See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [Custom Connections Guide](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/)
- [Dashboard](https://dashboard.web3auth.io)

## License

MIT — see [LICENSE](../LICENSE).
