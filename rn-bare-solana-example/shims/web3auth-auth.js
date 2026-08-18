// Metro cannot bundle dynamic require() — use a static path to the real package
// (the @web3auth/auth alias points at this shim, so we must not require that name here).
const realAuth = require("../node_modules/@web3auth/react-native-sdk/node_modules/@web3auth/auth/dist/lib.cjs/index.js");
const { getED25519Key } = require("./getED25519Key");

module.exports = {
  ...realAuth,
  getED25519Key,
};
