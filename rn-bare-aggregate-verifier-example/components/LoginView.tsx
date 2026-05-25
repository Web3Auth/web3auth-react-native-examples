import { AUTH_CONNECTION, useWeb3AuthConnect } from "@web3auth/react-native-sdk";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Grouped connections login screen.
 *
 * All three buttons share the same `groupedAuthConnectionId` ("aggregate-sapphire").
 * This guarantees that the same user gets the **same wallet address** regardless
 * of which method they use to log in — Google, email OTP, or GitHub.
 *
 * Dashboard setup: create a Grouped Connection named "aggregate-sapphire" that
 * contains three sub-connections:
 *   - w3a-google          (Google social login)
 *   - w3a-a0-email-passwordless  (Auth0 email OTP)
 *   - w3a-a0-github       (Auth0 GitHub)
 *
 * The verifier ID field must be the same across all sub-connections (email is
 * used here so Google email == Auth0 email == GitHub email → same key).
 */
export function LoginView() {
  const { connectTo, loading } = useWeb3AuthConnect();

  // IMP START - Login
  const loginWithGoogle = () =>
    connectTo({
      authConnection: AUTH_CONNECTION.GOOGLE,
      authConnectionId: "w3a-google",
      groupedAuthConnectionId: "aggregate-sapphire",
    });

  const loginWithEmailPasswordless = () =>
    connectTo({
      authConnection: AUTH_CONNECTION.CUSTOM,
      authConnectionId: "w3a-a0-email-passwordless",
      groupedAuthConnectionId: "aggregate-sapphire",
    });

  const loginWithGitHub = () =>
    connectTo({
      authConnection: AUTH_CONNECTION.CUSTOM,
      authConnectionId: "w3a-a0-github",
      groupedAuthConnectionId: "aggregate-sapphire",
    });
  // IMP END - Login

  return (
    <SafeAreaView style={styles.loginArea}>
      <Text style={styles.heading}>Login with any method</Text>
      <Text style={styles.subheading}>Same account → same wallet address</Text>
      <Button title={loading ? "Logging in…" : "Login with Google"} onPress={loginWithGoogle} />
      <Button title={loading ? "Logging in…" : "Login with Email OTP"} onPress={loginWithEmailPasswordless} />
      <Button title={loading ? "Logging in…" : "Login with GitHub"} onPress={loginWithGitHub} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
});
