import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, type Web3AuthContextConfig } from "@web3auth/react-native-sdk";

// IMP START - Dashboard Registration
// Get your Client ID from https://dashboard.web3auth.io
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
// IMP END - Dashboard Registration

// IMP START - SDK Initialization
const web3AuthConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    // IMP START - Allowlist bundle ID
    redirectUrl: "web3authrnbareauth0example://auth",
    // IMP END - Allowlist bundle ID
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
  },
};
// IMP END - SDK Initialization

export default web3AuthConfig;
