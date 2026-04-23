import { AUTH_CONNECTION, useWeb3AuthConnect } from "@web3auth/react-native-sdk";
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

/**
 * Login screen for the Solana example.
 * Uses email OTP — the same pattern works for Google or any other connection.
 */
export function LoginView() {
  const { connectTo, loading } = useWeb3AuthConnect();
  const [email, setEmail] = useState("");

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

const styles = StyleSheet.create({
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
});
