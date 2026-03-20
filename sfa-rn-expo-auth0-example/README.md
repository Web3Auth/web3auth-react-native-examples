# [DEPRECATED] SFA React Native Expo + Auth0 Example

> **This example is deprecated.**
>
> The Single Factor Auth (SFA) / Core Kit SDK (`@web3auth/single-factor-auth`) is no longer the recommended integration path for React Native. Use the standard `@web3auth/react-native-sdk` with a Custom Connection instead.
>
> For an up-to-date Expo example, see: [rn-expo-example](../rn-expo-example)
> For an up-to-date Auth0 example (bare), see: [rn-bare-auth0-example](../rn-bare-auth0-example)

## Why is SFA deprecated?

The SFA SDK was part of the legacy "Core Kit" product line and has been superseded by the unified MetaMask Embedded Wallets SDK. Custom auth providers like Auth0 are now configured as **Custom Connections** on the Web3Auth Dashboard and used directly through `@web3auth/react-native-sdk` via `loginConfig`, with no separate SFA package needed.

## Migration (Expo + Auth0)

1. Replace `@web3auth/single-factor-auth` with `@web3auth/react-native-sdk` and `@web3auth/ethereum-provider`.
2. Replace `expo-auth-session` / `expo-web-browser` Auth0 flow with the `loginConfig.jwt` approach — the SDK handles the Auth0 browser flow internally.
3. Create a **Custom Connection** of type Auth0 on the [Web3Auth Dashboard](https://dashboard.web3auth.io).
4. Update the SDK instantiation:
   ```typescript
   import * as WebBrowser from "expo-web-browser";
   import * as SecureStore from "expo-secure-store";
   import Web3Auth, { WEB3AUTH_NETWORK, LOGIN_PROVIDER } from "@web3auth/react-native-sdk";

   const web3auth = new Web3Auth(WebBrowser, SecureStore, {
     clientId: "YOUR_WEB3AUTH_CLIENT_ID",
     redirectUrl: Linking.createURL("web3auth", { scheme: "your-scheme" }),
     network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
     loginConfig: {
       jwt: {
         verifier: "YOUR_CONNECTION_ID",    // Custom Connection ID from dashboard
         typeOfLogin: "jwt",
         clientId: "YOUR_AUTH0_CLIENT_ID",
       },
     },
     privateKeyProvider: ethereumPrivateKeyProvider,
   });

   await web3auth.login({
     loginProvider: LOGIN_PROVIDER.JWT,
     extraLoginOptions: {
       domain: "https://YOUR_AUTH0_DOMAIN",
       verifierIdField: "sub",
     },
   });
   ```

## Resources

- [rn-bare-auth0-example](../rn-bare-auth0-example) — current Auth0 + bare RN example
- [rn-expo-example](../rn-expo-example) — current Expo example
- [React Native SDK Reference](https://docs.metamask.io/embedded-wallets/sdk/react-native/)
- [MetaMask Embedded Wallets Docs](https://docs.metamask.io/embedded-wallets/)
- [Dashboard](https://dashboard.web3auth.io)
- [Community (Builder Hub)](https://builder.metamask.io/c/embedded-wallets/5)
