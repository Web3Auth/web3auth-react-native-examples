import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, type AccountAbstractionConfig, type Web3AuthContextConfig } from "@web3auth/react-native-sdk";
import * as Linking from "expo-linking";

// IMP START - Allowlist bundle ID
// expo-linking resolves to the scheme registered in app.json at runtime
const redirectUrl = Linking.createURL("web3auth", { scheme: "web3authrnexpoexample" });
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
    // IMP START - Chain Config
    chains: [
      {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0xaa36a7", // Ethereum Sepolia Testnet
        rpcTarget: "https://rpc.ankr.com/eth_sepolia",
        displayName: "Ethereum Sepolia Testnet",
        blockExplorerUrl: "https://sepolia.etherscan.io",
        ticker: "ETH",
        tickerName: "Ethereum",
      },
    ],
    defaultChainId: "0xaa36a7",
    // IMP END - Chain Config
    // IMP START - Account Abstraction
    accountAbstractionConfig: withAA ? AAConfig : null,
    // IMP END - Account Abstraction
  },
});
// IMP END - SDK Initialization
