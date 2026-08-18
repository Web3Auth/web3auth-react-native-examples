// IMP START - Web3Auth Setup
// Must be the very first import — seeds crypto, Buffer, and URL polyfills
import "@web3auth/react-native-sdk/setup";
// RN's built-in URLSearchParams lacks .set(); Web3Auth connect flows need it.
import "react-native-url-polyfill/auto";
// IMP END - Web3Auth Setup

import { AppRegistry } from "react-native";

import App from "./App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
