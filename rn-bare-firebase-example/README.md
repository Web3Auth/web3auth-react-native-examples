# MetaMask Embedded Wallets — React Native Firebase Example

A bare React Native example demonstrating how to use Firebase Authentication as a custom authentication provider with MetaMask Embedded Wallets (Web3Auth). The user signs in through Firebase (anonymous, email, or social) and receives a deterministic Ethereum wallet.

## What this example demonstrates

- Setting up a **Custom Connection** on the Web3Auth Dashboard backed by Firebase
- Using `@react-native-firebase/auth` to obtain a Firebase ID token
- Passing the Firebase JWT to `@web3auth/react-native-sdk` via `loginConfig`
- Connecting the built-in EVM provider and making Ethereum calls with `ethers.js`

## How custom authentication works here

1. The user taps **Login**.
2. Firebase Authentication signs the user in (anonymous sign-in in this example — swap for email/password or any Firebase provider).
3. Firebase issues a JWT (`idToken`).
4. The JWT is passed to Web3Auth, which validates it against the Custom Connection configured on the dashboard.
5. Web3Auth reconstructs the user's key shares and returns an EVM provider.

## Tech stack

- React Native `0.74.x` (bare workflow)
- `@web3auth/react-native-sdk` `^8.0.0`
- `@web3auth/ethereum-provider` `^9.3.0`
- `@react-native-firebase/app` + `@react-native-firebase/auth`
- `ethers` `^6.x`
- `react-native-encrypted-storage`
- `@toruslabs/react-native-web-browser`

## Prerequisites

- Node.js `>=18`
- React Native development environment — [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup)
- A [Firebase Project](https://console.firebase.google.com) with Authentication enabled
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project

## Dashboard Setup

### Firebase

1. Create a project in the [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication** and the sign-in methods you want (e.g. Anonymous, Email/Password, Google).
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) and place them in the correct native folders.
4. Note your **Project ID** and the Firebase **JWKS endpoint**:
   ```
   https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com
   ```

### Web3Auth

1. Go to [dashboard.web3auth.io](https://dashboard.web3auth.io) and open your project.
2. Under **Connections**, create a **Custom Connection**:
   - Type: **Custom JWT**
   - JWKS endpoint: `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`
   - JWT validation fields: `iss` = `https://securetoken.google.com/YOUR_FIREBASE_PROJECT_ID`, `aud` = `YOUR_FIREBASE_PROJECT_ID`
   - User identifier field: `sub`
3. Note the **Connection ID** (formerly called verifier name).
4. Under **Allowed Origins**, add your app's redirect URL:
   ```
   web3authrnbarefirebase://auth
   ```

## Installation

```bash
git clone https://github.com/Web3Auth/web3auth-react-native-examples.git
cd web3auth-react-native-examples/rn-bare-firebase-example
npm install
```

### iOS

```bash
cd ios && pod install && cd ..
```

## Configuration

In `App.tsx`, update:

```typescript
const clientId = "YOUR_WEB3AUTH_CLIENT_ID"; // from Web3Auth Dashboard

const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId,
  network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // SAPPHIRE_MAINNET for production
  redirectUrl: "web3authrnbarefirebase://auth",
  loginConfig: {
    jwt: {
      verifier: "YOUR_CONNECTION_ID",  // Connection ID from Web3Auth Dashboard
      typeOfLogin: "jwt",
      clientId,
    },
  },
  privateKeyProvider: ethereumPrivateKeyProvider,
});
```

## Running the app

```bash
npm start        # start Metro
npm run ios      # iOS
npm run android  # Android
```

## How it works

### Login flow

```typescript
// 1. Sign in with Firebase
const res = await firebaseAuth().signInAnonymously();
const firebaseIdToken = await res.user.getIdToken(true);

// 2. Pass the Firebase JWT to Web3Auth
await web3auth.login({
  loginProvider: LOGIN_PROVIDER.JWT,
  extraLoginOptions: {
    id_token: firebaseIdToken,
    verifierIdField: "sub",
  },
});
```

### Ethereum interaction

```typescript
const ethersProvider = new ethers.BrowserProvider(web3auth.provider!);
const signer = await ethersProvider.getSigner();
const address = await signer.getAddress();
const balance = await ethersProvider.getBalance(address);
```

## Key concepts

**Custom Connection** — Configured on the Web3Auth Dashboard with the Firebase JWKS endpoint and validation rules. Web3Auth uses this to verify that the JWT was issued by your Firebase project.

**`getIdToken(true)`** — Pass `true` to force-refresh the token. Web3Auth requires the JWT's `iat` claim to be within 60 seconds of the current time, so always request a fresh token immediately before calling `web3auth.login()`.

**Deterministic wallet** — Same Firebase user (`sub`) + same Connection ID + same Client ID + same network = same wallet address every time.

## Troubleshooting

**`JWT expired` / `iat` mismatch**
- Call `getIdToken(true)` to get a fresh token immediately before `web3auth.login()`. Do not cache the token.

**`Verifier not found` error**
- The `verifier` field in `loginConfig` must exactly match the Connection ID in your Web3Auth Dashboard (case-sensitive).

**Firebase native module not found**
- Ensure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are placed correctly and you ran `pod install` after adding them.

**Metro polyfill errors**
- See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [React Native Firebase Docs](https://rnfirebase.io/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT — see [LICENSE](../LICENSE).
