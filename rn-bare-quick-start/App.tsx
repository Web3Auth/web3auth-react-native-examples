import * as WebBrowser from "@toruslabs/react-native-web-browser";
import {
  AUTH_CONNECTION,
  useAccessToken,
  useAuthTokenInfo,
  useEnableMFA,
  useManageMFA,
  useRefreshSession,
  useSignatureRequest,
  useWalletUI,
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  Web3AuthProvider,
} from "@web3auth/react-native-sdk";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
// Storage for encrypted session data. On Expo, use `expo-secure-store` instead.
import EncryptedStorage from "react-native-encrypted-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { getAddress, getBalance, signMessage } from "./lib/evm";
import { getWeb3AuthConfig } from "./web3authConfig";

interface HomeScreenProps {
  useAccountAbstraction: boolean;
  onToggleAA: (value: boolean) => void;
}

// ─── Inner screen (rendered inside Web3AuthProvider) ──────────────────────────
// IMP START - SDK Initialization
function HomeScreen({ useAccountAbstraction, onToggleAA }: HomeScreenProps) {
  const { isConnected, isAuthorized, accessToken, isInitializing, connection } = useWeb3Auth();
  const { connectTo, loading } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { showWalletUI } = useWalletUI();
  const { request } = useSignatureRequest();
  const { getAccessToken } = useAccessToken();
  const { getAuthTokenInfo } = useAuthTokenInfo();
  const { refreshSession } = useRefreshSession();
  const { enableMFA } = useEnableMFA();
  const { manageMFA } = useManageMFA();
  // IMP END - SDK Initialization

  const [email, setEmail] = useState("");
  const [output, setOutput] = useState("");
  const log = (...args: unknown[]) => setOutput(JSON.stringify(args, null, 2));

  const ethereumProvider = connection?.ethereumProvider;

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isInitializing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.initText}>Initializing…</Text>
      </View>
    );
  }

  // ── Login screen ─────────────────────────────────────────────────────────────
  if (!isConnected) {
    // IMP START - Login
    return (
      <SafeAreaView style={styles.loginArea}>
        <View style={styles.aaToggleRow}>
          <Text>Use Account Abstraction:</Text>
          <Switch onValueChange={onToggleAA} value={useAccountAbstraction} />
        </View>
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
      </SafeAreaView>
    );
    // IMP END - Login
  }

  // ── Logged-in screen ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonArea}>
        <Button title="Get User Info" onPress={() => log({ userInfo, isAuthorized, accessToken })} />

        {/* IMP START - Blockchain Calls */}
        <Button
          title="Get Address"
          onPress={() => {
            if (!ethereumProvider) return log("provider not set");
            getAddress(ethereumProvider).then(log);
          }}
        />
        <Button
          title="Get Balance"
          onPress={() => {
            if (!ethereumProvider) return log("provider not set");
            getBalance(ethereumProvider).then(log);
          }}
        />
        <Button
          title="Sign Message"
          onPress={() => {
            if (!ethereumProvider) return log("provider not set");
            signMessage(ethereumProvider, "Hello Web3Auth!").then(log);
          }}
        />
        {/* IMP END - Blockchain Calls */}

        {/* IMP START - Signature Request */}
        <Button title="Request Signature" onPress={() => request("personal_sign", ["Hello Web3Auth!", "0x"]).then(log)} />
        {/* IMP END - Signature Request */}

        <Button title="Get Access Token" onPress={() => getAccessToken().then(log)} />
        <Button title="Get Auth Token Info" onPress={() => getAuthTokenInfo().then(log)} />
        <Button
          title="Refresh Session"
          onPress={() => refreshSession().then((ok) => log(ok ? "session refreshed" : "session refresh failed"))}
        />
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
    </SafeAreaView>
  );
}

// ─── Root – wraps everything in the Web3Auth provider ─────────────────────────
export default function App() {
  const [useAccountAbstraction, setUseAccountAbstraction] = useState(false);

  return (
    // IMP START - Setup Web3Auth Provider
    <Web3AuthProvider
      key={String(useAccountAbstraction)}
      webBrowser={WebBrowser}
      storage={EncryptedStorage}
      config={getWeb3AuthConfig(useAccountAbstraction)}
    >
      <SafeAreaProvider>
        <HomeScreen useAccountAbstraction={useAccountAbstraction} onToggleAA={setUseAccountAbstraction} />
      </SafeAreaProvider>
    </Web3AuthProvider>
    // IMP END - Setup Web3Auth Provider
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  initText: {
    marginTop: 12,
    color: "#666",
  },
  loginArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  aaToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    alignSelf: "stretch",
  },
});
