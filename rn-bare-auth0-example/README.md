# MetaMask Embedded Wallets — React Native Auth0 Example

A bare React Native example demonstrating how to use Auth0 as a custom authentication provider with MetaMask Embedded Wallets (Web3Auth). The user logs in through Auth0 (social or email/password) and receives a deterministic Ethereum wallet.

## What this example demonstrates

- Setting up a **Custom Connection** on the Web3Auth Dashboard backed by Auth0
- Passing an Auth0 JWT to `@web3auth/react-native-sdk` via `loginConfig`
- Using `LOGIN_PROVIDER.JWT` to trigger custom auth flow
- Connecting the built-in EVM provider and making Ethereum calls with `ethers.js`

## How custom authentication works here

1. The user taps **Login**.
2. Auth0's browser-based login opens in an in-app browser.
3. Auth0 issues a JWT (`idToken`).
4. The JWT is passed to Web3Auth, which validates it against the Custom Connection configured on the dashboard.
5. Web3Auth reconstructs the user's key shares and returns an EVM provider.

## Tech stack

- React Native `0.74.x` (bare workflow)
- `@web3auth/react-native-sdk` `^8.0.0`
- `@web3auth/ethereum-provider` `^9.3.0`
- `ethers` `^6.x`
- `react-native-encrypted-storage`
- `@toruslabs/react-native-web-browser`

## Prerequisites

- Node.js `>=18`
- React Native development environment — [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup)
- An [Auth0 Account](https://auth0.com) with a **Native** application created
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project

## Dashboard Setup

### Auth0

1. In the [Auth0 Dashboard](https://manage.auth0.com), create a **Native** application.
2. Under **Allowed Callback URLs**, add your app redirect scheme:
   ```
   web3authrnbareauth0example://auth
   ```
3. Note your **Domain** and **Client ID**.

### Web3Auth

1. Go to [dashboard.web3auth.io](https://dashboard.web3auth.io) and open your project.
2. Under **Connections**, create a **Custom Connection** of type **Auth0**:
   - Provider: Auth0
   - Auth0 Client ID: your Auth0 Client ID
   - Auth0 Domain: your Auth0 Domain
   - User identifier field: `sub`
3. Note the **Connection ID** (formerly called verifier name).
4. Under **Allowed Origins**, add:
   ```
   web3authrnbareauth0example://auth
   ```

## Installation

```bash
git clone https://github.com/Web3Auth/web3auth-react-native-examples.git
cd web3auth-react-native-examples/rn-bare-auth0-example
npm install
```

### iOS

```bash
cd ios && pod install && cd ..
```

## Configuration

In `App.tsx`, update the following:

```typescript
const clientId = "YOUR_WEB3AUTH_CLIENT_ID"; // from Web3Auth Dashboard

const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId,
  network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // SAPPHIRE_MAINNET for production
  redirectUrl: "web3authrnbareauth0example://auth",
  loginConfig: {
    jwt: {
      verifier: "YOUR_CONNECTION_ID",     // Connection ID from Web3Auth Dashboard
      typeOfLogin: "jwt",
      clientId: "YOUR_AUTH0_CLIENT_ID",   // Auth0 application Client ID
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

### Login

The app triggers Auth0's authorization flow via the in-app browser, then passes the resulting JWT to Web3Auth:

```typescript
await web3auth.login({
  loginProvider: LOGIN_PROVIDER.JWT,
  extraLoginOptions: {
    domain: "https://YOUR_AUTH0_DOMAIN",
    verifierIdField: "sub",
  },
});
```

Web3Auth validates the JWT against your Custom Connection and reconstructs the private key.

### Ethereum interaction

```typescript
const ethersProvider = new ethers.BrowserProvider(web3auth.provider!);
const signer = await ethersProvider.getSigner();
const address = await signer.getAddress();
```

## Key concepts

**Custom Connection** — A connection backed by your own auth provider. You configure it on the Web3Auth Dashboard with your Auth0 domain, client ID, and the JWT field used as the user identifier (`sub` by default).

**Deterministic wallet** — The same Auth0 user always gets the same wallet address, as long as the Client ID, network, and Connection ID are unchanged.

**`loginConfig.jwt`** — The SDK expects this key when using custom JWT auth. The `verifier` field must match the Connection ID in your dashboard exactly.

## Troubleshooting

**Redirect not firing after Auth0 login**
- Verify the callback URL scheme in Auth0 matches the one in `App.tsx`
- For Android, confirm the intent filter scheme in `AndroidManifest.xml`
- For iOS, confirm the URL scheme in `Info.plist`

**`Verifier not found` error**
- The `verifier` field in `loginConfig` must exactly match the Connection ID on the Web3Auth Dashboard (case-sensitive).

**Metro polyfill errors**
- See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [Auth0 React Native Quickstart](https://auth0.com/docs/quickstart/native/react-native)
- [Dashboard](https://dashboard.web3auth.io)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT — see [LICENSE](../LICENSE).
