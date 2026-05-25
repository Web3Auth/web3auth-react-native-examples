/**
 * Solana example — demonstrates the built-in Solana provider in the RN SDK.
 *
 * The SDK derives an ed25519 keypair from the user's key shares and exposes it
 * as a `TransactionSigner` from `@solana/signers`.  No `SolanaPrivateKeyProvider`
 * or `@web3auth/solana-provider` is needed.
 *
 * Chain configuration is set once in `web3authConfig.ts` using the `chains`
 * array with `chainNamespace: CHAIN_NAMESPACES.SOLANA`.
 */
import "@ethersproject/shims";

import * as WebBrowser from "@toruslabs/react-native-web-browser";
import { useWeb3Auth, Web3AuthProvider } from "@web3auth/react-native-sdk";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
// Storage for encrypted session data. On Expo, use `expo-secure-store` instead.
import EncryptedStorage from "react-native-encrypted-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { HomeView } from "./components/HomeView";
import { LoginView } from "./components/LoginView";
import web3AuthConfig from "./web3authConfig";

// ─── Inner screen (must be a child of Web3AuthProvider) ───────────────────────
// IMP START - SDK Initialization
function Screen() {
  const { isConnected, isInitializing } = useWeb3Auth();
  // IMP END - SDK Initialization

  if (isInitializing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.initText}>Initializing…</Text>
      </View>
    );
  }

  return isConnected ? <HomeView /> : <LoginView />;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    // IMP START - Setup Web3Auth Provider
    <Web3AuthProvider webBrowser={WebBrowser} storage={EncryptedStorage} config={web3AuthConfig}>
      <SafeAreaProvider>
        <Screen />
      </SafeAreaProvider>
    </Web3AuthProvider>
    // IMP END - Setup Web3Auth Provider
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  initText: {
    marginTop: 12,
    color: "#666",
  },
});
