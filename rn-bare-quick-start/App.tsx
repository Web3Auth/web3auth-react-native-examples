import "@ethersproject/shims";

import * as WebBrowser from "@toruslabs/react-native-web-browser";
import {
  AUTH_CONNECTION,
  useEnableMFA,
  useIdentityToken,
  useManageMFA,
  useWalletUI,
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  Web3AuthProvider,
} from "@web3auth/react-native-sdk";
import React, { useState } from "react";
import { Button, Dimensions, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

import { getAddress, getBalance, signMessage } from "./lib/evm";
import web3AuthConfig from "./web3authConfig";

// ─── Inner screen (rendered inside Web3AuthProvider) ──────────────────────────
// IMP START - SDK Initialization
function HomeScreen() {
  // Auth state
  const { isConnected, isInitializing, provider } = useWeb3Auth();
  // Connect / disconnect
  const { connectTo, loading } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  // User profile
  const { userInfo } = useWeb3AuthUser();
  // Wallet Services helpers
  const { showWalletUI } = useWalletUI();
  const { getIdentityToken } = useIdentityToken();
  const { enableMFA } = useEnableMFA();
  const { manageMFA } = useManageMFA();
  // IMP END - SDK Initialization

  const [email, setEmail] = useState("");
  const [output, setOutput] = useState("");
  const log = (...args: unknown[]) => setOutput(JSON.stringify(args, null, 2));

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isInitializing) {
    return <Text style={styles.status}>Initializing…</Text>;
  }

  // ── Login screen ─────────────────────────────────────────────────────────────
  if (!isConnected) {
    // IMP START - Login
    return (
      <View style={styles.loginArea}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          title={loading ? "Logging in…" : "Login with Email OTP"}
          onPress={() =>
            connectTo({
              authConnection: AUTH_CONNECTION.EMAIL_PASSWORDLESS,
              extraLoginOptions: { login_hint: email },
            })
          }
        />
      </View>
    );
    // IMP END - Login
  }

  // ── Logged-in screen ─────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={styles.buttonArea}>
        <Button title="Get User Info" onPress={() => log(userInfo)} />

        {/* IMP START - Blockchain Calls */}
        <Button title="Get Address" onPress={() => getAddress(provider!).then(log)} />
        <Button title="Get Balance" onPress={() => getBalance(provider!).then(log)} />
        <Button title="Sign Message" onPress={() => signMessage(provider!, "Hello Web3Auth!").then(log)} />
        {/* IMP END - Blockchain Calls */}

        <Button title="Get Identity Token" onPress={() => getIdentityToken().then(log)} />
        <Button title="Show Wallet UI" onPress={() => showWalletUI()} />
        <Button title="Enable MFA" onPress={enableMFA} />
        <Button title="Manage MFA" onPress={manageMFA} />

        {/* IMP START - Logout */}
        <Button title="Log Out" onPress={disconnect} />
        {/* IMP END - Logout */}
      </View>

      <View style={styles.consoleArea}>
        <Text style={styles.consoleLabel}>Console</Text>
        <ScrollView style={styles.console}>
          <Text selectable>{output}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

// ─── Root – wraps everything in the Web3Auth provider ─────────────────────────
export default function App() {
  return (
    // IMP START - Setup Web3Auth Provider
    <Web3AuthProvider webBrowser={WebBrowser} storage={EncryptedStorage} config={web3AuthConfig}>
      <HomeScreen />
    </Web3AuthProvider>
    // IMP END - Setup Web3Auth Provider
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: "#fff",
  },
  loginArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  input: {
    height: 44,
    width: 300,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  buttonArea: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  consoleArea: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  consoleLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  console: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    width: Dimensions.get("window").width - 40,
  },
  status: {
    flex: 1,
    textAlign: "center",
    marginTop: 60,
  },
});
