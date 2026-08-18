import {
  useAccessToken,
  useAuthTokenInfo,
  useEnableMFA,
  useManageMFA,
  useRefreshSession,
  useSignatureRequest,
  useWalletUI,
  useWeb3Auth,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/react-native-sdk";
import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Console } from "./Console";
import { getAddress, getBalance, signMessage } from "../lib/evm";

/**
 * Logged-in screen.
 *
 * Blockchain helpers live in `lib/evm.ts` (pure functions — no React).
 * Wallet Services helpers (MFA, wallet UI, auth tokens) come from hooks.
 */
export function HomeView() {
  const { connection, isAuthorized, accessToken } = useWeb3Auth();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { showWalletUI } = useWalletUI();
  const { request } = useSignatureRequest();
  const { getAccessToken } = useAccessToken();
  const { getAuthTokenInfo } = useAuthTokenInfo();
  const { refreshSession } = useRefreshSession();
  const { enableMFA } = useEnableMFA();
  const { manageMFA } = useManageMFA();

  const [output, setOutput] = useState("");
  const log = (...args: unknown[]) => setOutput(JSON.stringify(args, null, 2));

  const ethereumProvider = connection?.ethereumProvider;

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

        <Button
          title="Request Signature (Wallet Services)"
          onPress={() => request("personal_sign", ["Hello Web3Auth!", "0x"]).then(log)}
        />

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

      <Console output={output} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonArea: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
});
