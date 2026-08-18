/**
 * React Native polyfills required by @solana/react-hooks and @wallet-standard/app.
 * Import immediately after `@web3auth/react-native-sdk/setup` in index.js.
 */

// @solana/keys uses crypto.subtle for Ed25519. react-native-quick-crypto (installed
// in @web3auth/react-native-sdk/setup) does not implement Ed25519 — patch it here.
import { install as installEd25519Polyfill } from "@solana/webcrypto-ed25519-polyfill";

installEd25519Polyfill();

// @solana/react-hooks uses AbortSignal.timeout for RPC calls; Hermes on RN 0.74 lacks it.
if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout !== "function") {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    controller.signal.addEventListener("abort", () => clearTimeout(timer), { once: true });
    return controller.signal;
  };
}

// @wallet-standard/app dispatches wallet events on window. RN defines window without DOM APIs.
const win = typeof globalThis.window !== "undefined" ? globalThis.window : globalThis;
if (typeof globalThis.window === "undefined") {
  globalThis.window = win;
}

if (typeof win.addEventListener !== "function") {
  const listeners = new Map();

  win.addEventListener = (type, listener) => {
    const set = listeners.get(type) ?? new Set();
    set.add(listener);
    listeners.set(type, set);
  };

  win.removeEventListener = (type, listener) => {
    listeners.get(type)?.delete(listener);
  };

  win.dispatchEvent = (event) => {
    const set = listeners.get(event.type);
    if (set) {
      for (const listener of Array.from(set)) {
        listener.call(win, event);
      }
    }
    return true;
  };
}
