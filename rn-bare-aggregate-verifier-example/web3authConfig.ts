import { WEB3AUTH_NETWORK, type Web3AuthContextConfig } from "@web3auth/react-native-sdk";

// IMP START - Dashboard Registration
// Get your Client ID from https://dashboard.web3auth.io
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
// IMP END - Dashboard Registration

// IMP START - SDK Initialization
const web3AuthConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    // IMP START - Allowlist bundle ID
    redirectUrl: "web3authrnbareaggregateexample://auth",
    // IMP END - Allowlist bundle ID
    network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  },
};
// IMP END - SDK Initialization

export default web3AuthConfig;
