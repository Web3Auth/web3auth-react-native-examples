// IMP START - Web3Auth Setup
// Must be the very first import — seeds crypto, Buffer, and URL polyfills
import "@web3auth/react-native-sdk/setup";
// IMP END - Web3Auth Setup

import "@ethersproject/shims";

import { registerRootComponent } from "expo";

import App from "./App";

registerRootComponent(App);
