import { AUTH_CONNECTION, useWeb3AuthConnect } from "@web3auth/react-native-sdk";
import React from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Renders the login screen.
 *
 * Auth0 is configured as a Custom Connection on the Web3Auth Dashboard.
 * The SDK opens Auth0's login page in an in-app browser, retrieves the JWT,
 * and derives the user's key — no `react-native-auth0` dependency needed.
 *
 * Dashboard connection: authConnectionId = "w3a-auth0-demo"
 */
export function LoginView() {
  const { connectTo, loading } = useWeb3AuthConnect();

  // IMP START - Login
  const loginWithAuth0 = () =>
    connectTo({
      authConnection: AUTH_CONNECTION.CUSTOM,
      // authConnectionId is the Connection ID from the Web3Auth Dashboard
      authConnectionId: "w3a-auth0-demo",
      extraLoginOptions: {
        // Auth0 tenant domain (set in your Dashboard connection)
        domain: "https://web3auth.au.auth0.com",
        // JWT field used as the unique user identifier
        verifierIdField: "sub",
      },
    }).catch((e: unknown) => Alert.alert("Login error", String(e)));
  // IMP END - Login

  return (
    <SafeAreaView style={styles.loginArea}>
      <Button title={loading ? "Logging in…" : "Login with Auth0"} onPress={loginWithAuth0} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
});
