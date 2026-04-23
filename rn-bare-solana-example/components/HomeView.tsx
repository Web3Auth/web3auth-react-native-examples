import type { TransactionSigner } from "@solana/signers";
import { CHAIN_NAMESPACES, useWeb3Auth, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/react-native-sdk";
import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";

import { Console } from "./Console";
import { getSolanaAddress, getSolanaBalance, signSolanaMessage } from "../lib/solana";
import { SOLANA_RPC_URL } from "../web3authConfig";

/**
 * Logged-in screen for Solana.
 *
 * Key difference from EVM examples:
 *   - `provider` is the Solana JSON-RPC provider (not EIP-1193).
 *   - `web3Auth.signer` is a `TransactionSigner` from `@solana/signers`.
 *     We cast it after checking `chainNamespace === SOLANA`.
 *
 * Blockchain helpers live in `lib/solana.ts` (pure functions — no React).
 */
export function HomeView() {
  const { web3Auth } = useWeb3Auth();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();

  const [output, setOutput] = useState("");
  const log = (...args: unknown[]) => setOutput(JSON.stringify(args, null, 2));

  // IMP START - Blockchain Calls
  // The signer is a KeyPairSigner (TransactionSigner) when the chain is Solana.
  // Access it via web3Auth.signer after connecting.
  const solanaSigner = web3Auth?.signer as TransactionSigner | null;
  // IMP END - Blockchain Calls

  return (
    <View style={styles.container}>
      <View style={styles.buttonArea}>
        <Button title="Get User Info" onPress={() => log(userInfo)} />

        {/* IMP START - Blockchain Calls */}
        <Button
          title="Get Solana Address"
          onPress={() => {
            if (!solanaSigner) return log("Not connected");
            log(getSolanaAddress(solanaSigner));
          }}
        />
        <Button
          title="Get Balance"
          onPress={async () => {
            if (!solanaSigner) return log("Not connected");
            log(await getSolanaBalance(solanaSigner, SOLANA_RPC_URL));
          }}
        />
        <Button
          title="Sign Message"
          onPress={async () => {
            if (!solanaSigner) return log("Not connected");
            log(await signSolanaMessage(solanaSigner, "Hello Web3Auth!"));
          }}
        />
        {/* IMP END - Blockchain Calls */}

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
