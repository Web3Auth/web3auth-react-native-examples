# MetaMask Embedded Wallets — React Native Grouped Connections Example

A bare React Native example demonstrating **Grouped Connections** (formerly called Aggregate Verifiers) — a Web3Auth feature that links multiple authentication methods so the same user always gets the **same wallet address**, regardless of which login method they use.

## What this example demonstrates

- Configuring a **Grouped Connection** on the Web3Auth Dashboard
- Linking Google, email passwordless (Auth0), and GitHub (Auth0) under a single connection group
- Using the shared `verifier` + `verifierSubIdentifier` pattern in `loginConfig`
- Same Ethereum wallet regardless of which login method is used

## Why Grouped Connections?

Without grouping, a user who logs in with Google gets one wallet, and the same user logging in with their email gets a completely different wallet. Grouped Connections solve this by linking multiple sub-connections under a parent group connection, using a common identifier (such as `email`) to map users across providers.

**Example:** Google (uses `email` as identifier) + Auth0 Email Passwordless (uses `email`) → same wallet.

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
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project

## Dashboard Setup

### Create a Grouped Connection

1. Go to [dashboard.web3auth.io](https://dashboard.web3auth.io) and open your project.
2. Under **Connections**, create a new **Grouped Connection**.
3. Add **sub-connections** to the group (e.g. Google, Auth0 Email Passwordless, Auth0 GitHub).
4. For each sub-connection, ensure the **user identifier field** maps to the same value across providers. For example:
   - Google: use `email` (must be pre-set in Google sub-connection config)
   - Auth0 Email Passwordless: use `email`
   - Auth0 GitHub: use `email` (Auth0 GitHub should include the user's email in the JWT)
5. Note the **Grouped Connection ID** and each **sub-connection ID**.
6. Under **Allowed Origins**, add:
   ```
   web3authrnbareaggregateexample://auth
   ```

## Installation

```bash
git clone https://github.com/Web3Auth/web3auth-react-native-examples.git
cd web3auth-react-native-examples/rn-bare-aggregate-verifier-example
npm install
```

### iOS

```bash
cd ios && pod install && cd ..
```

## Configuration

In `App.tsx`, each login method references the parent grouped connection via `verifier` and its own sub-connection via `verifierSubIdentifier`:

```typescript
const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId: "YOUR_WEB3AUTH_CLIENT_ID",
  network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  redirectUrl: "web3authrnbareaggregateexample://auth",
  privateKeyProvider: ethereumPrivateKeyProvider,
  loginConfig: {
    google: {
      verifier: "YOUR_GROUPED_CONNECTION_ID",         // parent group connection
      verifierSubIdentifier: "YOUR_GOOGLE_SUB_ID",   // Google sub-connection ID
      typeOfLogin: "google",
      clientId: "YOUR_GOOGLE_OAUTH_CLIENT_ID",
    },
    auth0emailpasswordless: {
      verifier: "YOUR_GROUPED_CONNECTION_ID",         // same parent group connection
      verifierSubIdentifier: "YOUR_A0_EMAIL_SUB_ID", // Auth0 email sub-connection ID
      typeOfLogin: "jwt",
      clientId: "YOUR_AUTH0_CLIENT_ID",
      jwtParameters: {
        domain: "https://YOUR_AUTH0_DOMAIN",
        verifierIdField: "email",
        isVerifierIdCaseSensitive: false,
      },
    },
  },
});
```

> **Important**: All sub-connections must use the same user identifier value. If Google and Auth0 both return `email`, the same email always resolves to the same wallet.

## Running the app

```bash
npm start        # start Metro
npm run ios      # iOS
npm run android  # Android
```

## How it works

### Login with Google

```typescript
await web3auth.login({ loginProvider: "google" });
```

### Login with email OTP (Auth0)

```typescript
await web3auth.login({
  loginProvider: "auth0emailpasswordless",
  extraLoginOptions: {
    login_hint: email,
    domain: "https://YOUR_AUTH0_DOMAIN",
  },
});
```

Both methods produce the **same wallet address** for the user with the same email.

## Key concepts

**Grouped Connection** — A parent connection on the Web3Auth Dashboard that aggregates multiple sub-connections. It uses Shamir Secret Sharing across the sub-connection shares to produce the same key regardless of which login method was used.

**`verifier`** — Must be the Grouped Connection ID (the parent).

**`verifierSubIdentifier`** — Must be the individual sub-connection ID within the group.

**Identifier mapping** — The `verifierIdField` (e.g. `email`) must resolve to the **same value** across all sub-connections for a given user.

## Troubleshooting

**Different wallet addresses for different login methods**
- Confirm all `verifier` fields use the exact same Grouped Connection ID.
- Confirm the `verifierIdField` resolves to the same value (e.g. same email) across all providers.

**`Verifier not found`**
- The `verifier` and `verifierSubIdentifier` must exactly match what is configured on the dashboard (case-sensitive).

**Metro polyfill errors**
- See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT — see [LICENSE](../LICENSE).
