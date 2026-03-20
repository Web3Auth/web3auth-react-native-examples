# MetaMask Embedded Wallets — React Native Solana Example

A bare React Native example showing how to integrate MetaMask Embedded Wallets (Web3Auth) with the **Solana** blockchain using the built-in `SolanaPrivateKeyProvider`.

## What this example demonstrates

- Using `@web3auth/solana-provider` (`SolanaPrivateKeyProvider`) instead of the EVM provider
- Logging in with social providers (Google, email OTP)
- Fetching Solana wallet address and SOL balance
- Signing a Solana message and sending a transaction
- Switching between Solana Devnet, Testnet, and Mainnet

## Tech stack

- React Native `0.74.x` (bare workflow)
- `@web3auth/react-native-sdk` `^8.0.0`
- `@web3auth/solana-provider` `^9.3.0`
- `@solana/web3.js`
- `react-native-encrypted-storage`
- `@toruslabs/react-native-web-browser`

## Prerequisites

- Node.js `>=18`
- React Native development environment — [React Native CLI Quickstart](https://reactnative.dev/docs/environment-setup)
- A [Web3Auth Dashboard](https://dashboard.web3auth.io) project

## Dashboard Setup

1. Go to [dashboard.web3auth.io](https://dashboard.web3auth.io) and create or open your project.
2. Choose **Sapphire Devnet** for development or **Sapphire Mainnet** for production.
3. Under **Allowed Origins**, add your redirect URL:
   ```
   solanarnexample://auth
   ```
4. Copy your **Client ID**.

> **Note**: Sapphire Devnet and Mainnet are Web3Auth key-reconstruction networks — they are unrelated to Solana's devnet/testnet/mainnet. You choose the Solana cluster separately in `chainConfig`.

## Installation

```bash
git clone https://github.com/Web3Auth/web3auth-react-native-examples.git
cd web3auth-react-native-examples/rn-bare-solana-example
npm install
```

### iOS

```bash
cd ios && pod install && cd ..
```

## Configuration

In `App.tsx`, update the Client ID:

```typescript
const clientId = "YOUR_CLIENT_ID"; // from Web3Auth Dashboard
```

To switch Solana clusters, update `chainConfig`:

```typescript
const chainConfig = {
  chainNamespace: ChainNamespace.SOLANA,
  chainId: "0x1",                          // 0x1 Mainnet | 0x2 Testnet | 0x3 Devnet
  rpcTarget: "https://api.mainnet-beta.solana.com",
  displayName: "Solana Mainnet",
  blockExplorerUrl: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
};
```

## Running the app

```bash
npm start        # start Metro
npm run ios      # iOS
npm run android  # Android
```

## How it works

### Initialisation with Solana provider

```typescript
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import Web3Auth, { ChainNamespace, WEB3AUTH_NETWORK } from "@web3auth/react-native-sdk";

const chainConfig = {
  chainNamespace: ChainNamespace.SOLANA,
  chainId: "0x2",
  rpcTarget: "https://api.testnet.solana.com",
  displayName: "Solana Testnet",
  blockExplorerUrl: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
};

const privateKeyProvider = new SolanaPrivateKeyProvider({ config: { chainConfig } });

const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
  clientId: "YOUR_CLIENT_ID",
  redirectUrl: "solanarnexample://auth",
  network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});
```

### Login

```typescript
await web3auth.login({ loginProvider: LOGIN_PROVIDER.GOOGLE });
```

### Solana calls via `@solana/web3.js`

```typescript
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Get address from the provider
const accounts = await web3auth.provider!.request({ method: "getAccounts" });
const address = accounts[0];

// Get balance
const connection = new Connection("https://api.testnet.solana.com");
const balance = await connection.getBalance(new PublicKey(address));
console.log(`${balance / LAMPORTS_PER_SOL} SOL`);
```

## Solana chain IDs

| Network | `chainId` | `rpcTarget` |
|---|---|---|
| Mainnet Beta | `0x1` | `https://api.mainnet-beta.solana.com` |
| Testnet | `0x2` | `https://api.testnet.solana.com` |
| Devnet | `0x3` | `https://api.devnet.solana.com` |

## Troubleshooting

**`SolanaPrivateKeyProvider` not found**
- Ensure `@web3auth/solana-provider` is installed and the import matches the installed version.

**Redirect not firing after login**
- Verify the scheme in `App.tsx` matches the URL added in the Web3Auth Dashboard.
- For Android, check `AndroidManifest.xml`; for iOS, check `Info.plist`.

**Metro polyfill errors**
- See [Metro Polyfill Troubleshooting](https://docs.metamask.io/embedded-wallets/troubleshooting/metro-issues/).

## Resources

- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)

## License

MIT — see [LICENSE](../LICENSE).
