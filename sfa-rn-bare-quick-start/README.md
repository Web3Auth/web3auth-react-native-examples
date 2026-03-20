# [DEPRECATED] SFA React Native Bare Quick Start

> **This example is deprecated.**
>
> The Single Factor Auth (SFA) / Core Kit SDK (`@web3auth/single-factor-auth`) is no longer the recommended integration path for React Native. Use the standard `@web3auth/react-native-sdk` instead.
>
> For an up-to-date quick start, see: [rn-bare-quick-start](../rn-bare-quick-start)

## Why is SFA deprecated?

The SFA (Single Factor Auth) SDK was part of the legacy "Core Kit" product line, which has been superseded by the unified MetaMask Embedded Wallets SDK. The `@web3auth/react-native-sdk` (Plug and Play) provides the same non-custodial key generation with a simpler integration path and is actively maintained.

## Migration

To migrate from SFA to the current SDK:

1. Replace `@web3auth/single-factor-auth` with `@web3auth/react-native-sdk`.
2. Replace `@toruslabs/customauth-react-native-sdk` (if used) with `@toruslabs/react-native-web-browser`.
3. Replace `SFAWeb3Auth` / `Web3Auth` (SFA) instantiation with the new constructor pattern:
   ```typescript
   import Web3Auth, { WEB3AUTH_NETWORK } from "@web3auth/react-native-sdk";
   import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

   const web3auth = new Web3Auth(WebBrowser, EncryptedStorage, {
     clientId: "YOUR_CLIENT_ID",
     redirectUrl: "YOUR_SCHEME://auth",
     network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
     privateKeyProvider: ethereumPrivateKeyProvider,
   });
   ```
4. Replace `sfa.connect({ verifier, verifierId, idToken })` with:
   ```typescript
   await web3auth.login({ loginProvider: LOGIN_PROVIDER.GOOGLE });
   // or for custom JWT:
   await web3auth.login({ loginProvider: LOGIN_PROVIDER.JWT, extraLoginOptions: { ... } });
   ```

## Resources

- [rn-bare-quick-start example](../rn-bare-quick-start) — current recommended starting point
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)
