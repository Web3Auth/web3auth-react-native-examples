import { WEB3AUTH_NETWORK, type AccountAbstractionConfig, type Web3AuthContextConfig } from "@web3auth/react-native-sdk";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";

// IMP START - Allowlist bundle ID
// Expo Go and dev-client builds resolve different redirect URLs — whitelist both in the dashboard.
const redirectUrl =
  // @ts-expect-error - Guest is not in the AppOwnership enum typings
  Constants.appOwnership === AppOwnership.Expo || Constants.appOwnership === AppOwnership.Guest
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: "web3authexpoexample" });
// IMP END - Allowlist bundle ID

// IMP START - Dashboard Registration
// Get your Client ID from https://dashboard.web3auth.io
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
// IMP END - Dashboard Registration

// IMP START - Account Abstraction
const AAConfig: AccountAbstractionConfig = {
  smartAccountType: "safe",
};
// IMP END - Account Abstraction

// IMP START - SDK Initialization
export const getWeb3AuthConfig = (withAA: boolean): Web3AuthContextConfig => ({
  web3AuthOptions: {
    clientId,
    redirectUrl,
    network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,    
    // IMP START - Account Abstraction
    accountAbstractionConfig: withAA ? AAConfig : null,
    // IMP END - Account Abstraction
  },
});
// IMP END - SDK Initialization
