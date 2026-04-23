# MetaMask Embedded Wallets — React Native Bare Grouped Connections Example

Demonstrates **Grouped Connections** (formerly "aggregate verifiers"): multiple login methods that all resolve to the **same wallet address** for the same user.

Without grouping, `Google login` and `Email OTP login` produce completely different wallets. Grouped Connections fix that by linking sub-connections under one shared key namespace.

## What this example demonstrates

- Three login buttons (Google, Email OTP via Auth0, GitHub via Auth0) sharing `groupedAuthConnectionId: "aggregate-sapphire"`
- Each method logs the same user into the same Ethereum wallet
- Full split structure: `LoginView`, `HomeView`, `Console`, `lib/evm.ts`
- The `authConnectionId` + `groupedAuthConnectionId` pattern (replaces `loginConfig.verifierSubIdentifier`)

## File tour

| File | What it does |
|---|---|
| `web3authConfig.ts` | The **only file you edit** — Client ID, redirect URL, network, chain config |
| `lib/evm.ts` | Pure EVM helpers (`getAddress`, `getBalance`, `signMessage`) — no React |
| `components/LoginView.tsx` | Three login buttons — each passes `authConnectionId` + `groupedAuthConnectionId` |
| `components/HomeView.tsx` | All post-login actions — blockchain calls, wallet UI, MFA, disconnect |
| `components/Console.tsx` | Dumb scrollable output box — `<Console output={...} />` |
| `App.tsx` | `<Web3AuthProvider>` + `Screen` that switches between Login/Home |
| `index.js` | Entry point — `@web3auth/react-native-sdk/setup` must be the very first import |
| `metro.config.js` | `withWeb3Auth()` sets up all polyfill aliases |

## Tech stack

- React Native `0.74.x` (bare workflow)
- `@web3auth/react-native-sdk` `^8.1.0`
- `ethers` `^6.x`

## Prerequisites

- Node.js `>=18`, React Native CLI environment, Xcode / Android Studio
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project with a Grouped Connection configured

## Dashboard setup

1. Create a project at [dashboard.web3auth.io](https://dashboard.web3auth.io).
2. Under **Connections**, create three individual connections:
   - `w3a-google` — Google social login
   - `w3a-a0-email-passwordless` — Auth0 email OTP (verifier ID field: `email`)
   - `w3a-a0-github` — Auth0 GitHub (verifier ID field: `email`)
3. Create a **Grouped Connection** named `aggregate-sapphire` and add all three as sub-connections.
   The shared verifier ID field (`email`) is what links the Google and Auth0 identities.
4. Under **Allowed Origins**, add:
   ```
   web3authrnbareaggregateexample://auth
   ```
5. Copy the **Client ID** into `web3authConfig.ts`.

> **Why `email` as the shared field?**  Google's JWT has an `email` claim. Auth0's JWT also returns an `email` claim. Using `email` as the shared verifier ID means `alice@gmail.com` via Google == `alice@gmail.com` via Auth0 Email OTP → same wallet.

## Installation

```bash
cd rn-bare-aggregate-verifier-example
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

### Login (`components/LoginView.tsx`)

```typescript
// All three calls share the same groupedAuthConnectionId.
// The SDK routes each through its own sub-connection but combines
// them into one key derivation path.
connectTo({
  authConnection: AUTH_CONNECTION.GOOGLE,
  authConnectionId: "w3a-google",
  groupedAuthConnectionId: "aggregate-sapphire", // ← the grouping key
});
```

### After login

The wallet address returned by `getAddress(provider!)` is **identical** no matter which of the three buttons was used, as long as the user's email is the same across providers.

## Troubleshooting

**Different addresses for the same user** — Check that the `groupedAuthConnectionId` is identical across all `connectTo` calls, that the Grouped Connection on the Dashboard includes all sub-connections, and that the verifier ID field resolves to the same value across providers.

**Metro errors** — See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [Grouped Connections Guide](https://docs.metamask.io/embedded-wallets/authentication/grouped-connections/)
- [Dashboard](https://dashboard.web3auth.io)

## License

MIT — see [LICENSE](../LICENSE).
