import { AUTH_CONNECTION, useWeb3AuthConnect } from "@web3auth/react-native-sdk";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getFirebaseIdToken } from "../lib/firebase";
import { getFirebaseJwtDiagnostics } from "../lib/jwt";
import { Console } from "./Console";

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
export function LoginView() {
  const { connectTo, loading, error } = useWeb3AuthConnect();
  const [status, setStatus] = useState("");
  const [debugOutput, setDebugOutput] = useState("");

  // IMP START - Login
  const login = async () => {
    try {
      setDebugOutput("");
      setStatus("Signing in with Firebase…");
      // Step 1 — get a fresh Firebase ID token
      const idToken = await getFirebaseIdToken();
      const diagnostics = getFirebaseJwtDiagnostics(idToken);
      setDebugOutput(JSON.stringify(diagnostics, null, 2));

      if (diagnostics.issues.length > 0) {
        throw new Error(diagnostics.issues.join("\n"));
      }

      setStatus("Connecting to Web3Auth…");
      // Step 2 — hand the token to Web3Auth
      const connection = await Promise.race([
        connectTo({
          authConnection: AUTH_CONNECTION.CUSTOM,
          // authConnectionId is the Connection ID from the Web3Auth Dashboard
          authConnectionId: "w3a-firebase-demo",
          // Pass the JWT directly; Web3Auth validates and derives the key
          idToken,
          extraLoginOptions: {
            verifierIdField: "sub", // field in the JWT used as the unique user ID
          },
        }),
        new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error("Web3Auth connect timed out after 60s")), 60_000);
        }),
      ]);

      if (!connection) {
        throw new Error(
          "Web3Auth did not return a connection. Check Metro logs for the underlying SDK error.",
        );
      }
    } catch (e: unknown) {
      Alert.alert("Login error", String(e));
    } finally {
      setStatus("");
    }
  };
  // IMP END - Login

  return (
    <SafeAreaView style={styles.loginArea}>
      {status ? <Text style={styles.statusText}>{status}</Text> : null}
      <Button title={loading ? "Connecting…" : "Login with Firebase"} onPress={login} disabled={loading} />
      {error ? <Text style={styles.errorText}>{String(error)}</Text> : null}
      {debugOutput ? <Console output={debugOutput} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 16,
    width: "100%",
  },
  statusText: {
    color: "#555",
    fontSize: 14,
  },
  errorText: {
    color: "#c00",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
