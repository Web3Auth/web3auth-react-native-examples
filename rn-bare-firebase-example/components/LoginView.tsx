import { AUTH_CONNECTION, useWeb3AuthConnect } from "@web3auth/react-native-sdk";
import React from "react";
import { Alert, Button, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getFirebaseIdToken } from "../lib/firebase";

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

  // IMP START - Login
  const login = async () => {
    try {
      const idToken = await getFirebaseIdToken();
      const connection = await connectTo({
        authConnection: AUTH_CONNECTION.CUSTOM,
        // authConnectionId is the Connection ID from the Web3Auth Dashboard
        authConnectionId: "w3a-firebase-demo",
        // Pass the JWT directly; Web3Auth validates and derives the key
        idToken,
        extraLoginOptions: {
          verifierIdField: "sub", // field in the JWT used as the unique user ID
        },
      });

      if (!connection) {
        Alert.alert("Login error", error ? String(error) : "Web3Auth did not return a connection.");
      }
    } catch (e: unknown) {
      Alert.alert("Login error", String(e));
    }
  };
  // IMP END - Login

  return (
    <SafeAreaView style={styles.loginArea}>
      <Button title={loading ? "Connecting…" : "Login with Firebase"} onPress={login} disabled={loading} />
      {error ? <Text style={styles.errorText}>{String(error)}</Text> : null}
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
  errorText: {
    color: "#c00",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
