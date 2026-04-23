import "@ethersproject/shims";

import * as WebBrowser from "@toruslabs/react-native-web-browser";
import { useWeb3Auth, Web3AuthProvider } from "@web3auth/react-native-sdk";
import React from "react";
import { StyleSheet, Text } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

import { HomeView } from "./components/HomeView";
import { LoginView } from "./components/LoginView";
import web3AuthConfig from "./web3authConfig";

// ─── Inner screen (must be a child of Web3AuthProvider) ───────────────────────
// IMP START - SDK Initialization
function Screen() {
  const { isConnected, isInitializing } = useWeb3Auth();
  // IMP END - SDK Initialization

  if (isInitializing) {
    return <Text style={styles.status}>Initializing…</Text>;
  }

  return isConnected ? <HomeView /> : <LoginView />;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    // IMP START - Setup Web3Auth Provider
    <Web3AuthProvider webBrowser={WebBrowser} storage={EncryptedStorage} config={web3AuthConfig}>
      <Screen />
    </Web3AuthProvider>
    // IMP END - Setup Web3Auth Provider
  );
}

const styles = StyleSheet.create({
  status: {
    flex: 1,
    textAlign: "center",
    marginTop: 60,
  },
});
