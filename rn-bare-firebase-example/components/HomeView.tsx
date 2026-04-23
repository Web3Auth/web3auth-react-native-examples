import {
  useEnableMFA,
  useIdentityToken,
  useManageMFA,
  useSignatureRequest,
  useWalletUI,
  useWeb3Auth,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/react-native-sdk";
import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";

import { Console } from "./Console";
import { getAddress, getBalance, signMessage } from "../lib/evm";

/**
 * Logged-in screen.
 *
 * Blockchain helpers are in `lib/evm.ts` (pure functions — no React).
 * Wallet Services helpers (MFA, wallet UI, identity token) come from hooks.
 */
export function HomeView() {
  const { provider } = useWeb3Auth();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { showWalletUI } = useWalletUI();
  const { request } = useSignatureRequest();
  const { getIdentityToken } = useIdentityToken();
  const { enableMFA } = useEnableMFA();
  const { manageMFA } = useManageMFA();

  const [output, setOutput] = useState("");
  const log = (...args: unknown[]) => setOutput(JSON.stringify(args, null, 2));

  return (
    <View style={styles.container}>
      <View style={styles.buttonArea}>
        <Button title="Get User Info" onPress={() => log(userInfo)} />

        {/* IMP START - Blockchain Calls */}
        <Button title="Get Address" onPress={() => getAddress(provider!).then(log)} />
        <Button title="Get Balance" onPress={() => getBalance(provider!).then(log)} />
        <Button title="Sign Message" onPress={() => signMessage(provider!, "Hello Web3Auth!").then(log)} />
        {/* IMP END - Blockchain Calls */}

        {/* Sign via Wallet Services overlay (shows confirmation screen) */}
        <Button
          title="Request Signature (Wallet Services)"
          onPress={() => request("personal_sign", ["Hello Web3Auth!", "0x"]).then(log)}
        />

        <Button title="Get Identity Token" onPress={() => getIdentityToken().then(log)} />
        <Button title="Show Wallet UI" onPress={() => showWalletUI()} />
        <Button title="Enable MFA" onPress={enableMFA} />
        <Button title="Manage MFA" onPress={manageMFA} />

        {/* IMP START - Logout */}
        <Button title="Log Out" onPress={disconnect} />
        {/* IMP END - Logout */}
      </View>

      <Console output={output} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: "#fff",
  },
  buttonArea: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
});
