import { AUTH_CONNECTION, useWeb3AuthConnect } from "@web3auth/react-native-sdk";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { getFirebaseIdToken } from "../lib/firebase";

interface LoginViewProps {
  onLog: (...args: unknown[]) => void;
}

/**
 * Bring-your-own-JWT login pattern with Firebase.
 *
 * Flow:
 *   1. Sign in with Firebase (`lib/firebase.ts`) → receive an ID token (JWT).
 *   2. Pass the token to `connectTo` with `authConnection: CUSTOM`.
 *      Web3Auth validates the JWT against the Dashboard's Custom Connection
 *      (`w3a-firebase-demo`) and derives the user's key.
 *
 * This pattern works with any JWT provider (Firebase, AWS Cognito, etc.).
 * Just replace `getFirebaseIdToken()` with your provider's auth call.
 */
export function LoginView({ onLog }: LoginViewProps) {
  const { connectTo, loading } = useWeb3AuthConnect();
  const [status, setStatus] = useState("");

  // IMP START - Login
  const login = async () => {
    try {
      setStatus("Signing in with Firebase…");
      // Step 1 — get a fresh Firebase ID token
      const idToken = await getFirebaseIdToken();
      onLog("Firebase ID token obtained");

      setStatus("Connecting to Web3Auth…");
      // Step 2 — hand the token to Web3Auth
      await connectTo({
        authConnection: AUTH_CONNECTION.CUSTOM,
        // authConnectionId is the Connection ID from the Web3Auth Dashboard
        authConnectionId: "w3a-firebase-demo",
        // Pass the JWT directly; Web3Auth validates and derives the key
        idToken,
        extraLoginOptions: {
          verifierIdField: "sub", // field in the JWT used as the unique user ID
        },
      });
    } catch (e) {
      onLog("Login error:", e);
    } finally {
      setStatus("");
    }
  };
  // IMP END - Login

  return (
    <View style={styles.loginArea}>
      {status ? <Text style={styles.statusText}>{status}</Text> : null}
      <Button title={loading ? "Connecting…" : "Login with Firebase"} onPress={login} />
    </View>
  );
}

const styles = StyleSheet.create({
  loginArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  statusText: {
    color: "#555",
    fontSize: 14,
  },
});
