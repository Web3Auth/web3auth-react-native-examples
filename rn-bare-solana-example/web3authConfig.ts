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
    redirectUrl: "solanarnexample://auth",
    // IMP END - Allowlist bundle ID
    network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    // IMP START - Chain Config
    // Solana Testnet — the SDK auto-creates the ed25519 Solana provider
    chains: [
      {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: "0x2", // 0x1 = Mainnet, 0x2 = Testnet, 0x3 = Devnet
        rpcTarget: "https://api.testnet.solana.com",
        displayName: "Solana Testnet",
        blockExplorerUrl: "https://explorer.solana.com",
        ticker: "SOL",
        tickerName: "Solana",
      },
    ],
    defaultChainId: "0x2",
    // IMP END - Chain Config
  },
};
// IMP END - SDK Initialization

export default web3AuthConfig;

// Export the RPC URL so lib/solana.ts can read it without duplicating the string
export const SOLANA_RPC_URL = "https://api.testnet.solana.com";
