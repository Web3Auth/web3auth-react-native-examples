# MetaMask Embedded Wallets — React Native Bare Firebase Example

The canonical **bring-your-own-JWT** example. Firebase Authentication generates a signed JWT; MetaMask Embedded Wallets validates it and derives the user's key — giving you one consistent wallet address across every session, tied to the Firebase identity.

Replace the Firebase calls in `lib/firebase.ts` with any JWT provider (AWS Cognito, Supabase, your own backend) to adapt this pattern.

## What this example demonstrates

- Obtaining a Firebase ID token via `@react-native-firebase/auth`
- Passing `idToken` directly to `connectTo({ authConnection: CUSTOM, authConnectionId })` — the bring-your-own-JWT pattern
- Full split structure: `LoginView`, `HomeView`, `Console`, `lib/firebase.ts`, `lib/evm.ts`
- No `useCoreKitKey` or `loginConfig` — the Custom Connection is configured entirely on the Dashboard
- Session persistence with `react-native-encrypted-storage`

## File tour

| File | What it does |
|---|---|
| `web3authConfig.ts` | The **only file you edit** — Client ID, redirect URL, network, chain config |
| `lib/firebase.ts` | `getFirebaseIdToken()` — signs in anonymously and returns a fresh Firebase JWT |
| `lib/evm.ts` | Pure EVM helpers (`getAddress`, `getBalance`, `signMessage`) — no React |
| `components/LoginView.tsx` | Calls `getFirebaseIdToken()` then `connectTo({ authConnection: CUSTOM, idToken })` |
| `components/HomeView.tsx` | All post-login actions — blockchain calls, wallet UI, MFA, disconnect |
| `components/Console.tsx` | Dumb scrollable output box — `<Console output={...} />` |
| `App.tsx` | `<Web3AuthProvider>` + `Screen` that switches between Login/Home |
| `index.js` | Entry point — `@web3auth/react-native-sdk/setup` must be the very first import |
| `metro.config.js` | `withWeb3Auth()` sets up all polyfill aliases |

## Tech stack

- React Native `0.74.x` (bare workflow)
- `@web3auth/react-native-sdk` `^8.1.0`
- `@react-native-firebase/auth` `^20.x`
- `ethers` `^6.x`

## Prerequisites

- Node.js `>=18`, React Native CLI environment, Xcode / Android Studio
- A Firebase project with the app registered (download `google-services.json` / `GoogleService-Info.plist`)
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project with a Firebase Custom Connection

## Dashboard setup

1. Create a project at [dashboard.web3auth.io](https://dashboard.web3auth.io).
2. Under **Connections**, create a **Custom Connection** with:
   - Provider: `Custom`
   - JWKS endpoint: `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`
   - Connection ID: `w3a-firebase-demo` (used as `authConnectionId` in code)
   - Verifier ID field: `sub`
   - JWT validation: `aud` must equal your Firebase project ID
3. Under **Allowed Origins**, add:
   ```
   web3authrnbarefirebase://auth
   ```
4. Copy the **Client ID** into `web3authConfig.ts`.

## Installation

```bash
cd rn-bare-firebase-example
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

### Step 1 — get a Firebase JWT (`lib/firebase.ts`)

```typescript
export async function getFirebaseIdToken(): Promise<string> {
  const result = await firebaseAuth().signInAnonymously();
  return result.user.getIdToken(true); // force-refresh for a fresh iat claim
}
```

### Step 2 — connect with the JWT (`components/LoginView.tsx`)

```typescript
const idToken = await getFirebaseIdToken();
await connectTo({
  authConnection: AUTH_CONNECTION.CUSTOM,
  authConnectionId: "w3a-firebase-demo", // Dashboard Connection ID
  idToken,                                // the JWT from Firebase
  extraLoginOptions: { verifierIdField: "sub" },
});
```

### Step 3 — blockchain calls (`lib/evm.ts`)

```typescript
const { provider } = useWeb3Auth();
const address = await getAddress(provider!);
```

> **JWT `iat` constraint**: The `idToken` must have an `iat` (issued-at) claim within 60 seconds of the current time. Always call `getIdToken(true)` to force a fresh token on every login attempt.

## Troubleshooting

**`Error: Firebase app not found`** — Ensure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are in the correct locations and you have run `pod install`.

**Metro errors** — See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [Custom JWT Authentication](https://docs.metamask.io/embedded-wallets/authentication/custom-connections/)
- [Dashboard](https://dashboard.web3auth.io)

## License

MIT — see [LICENSE](../LICENSE).
