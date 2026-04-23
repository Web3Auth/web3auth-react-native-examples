const { getDefaultConfig } = require("@react-native/metro-config");
// IMP START - Bundler Issues
const { withWeb3Auth } = require("@web3auth/react-native-sdk/metro-config");
// IMP END - Bundler Issues

const config = getDefaultConfig(__dirname);

// IMP START - Bundler Issues
// withWeb3Auth sets up all necessary polyfill aliases (crypto, stream, etc.)
module.exports = withWeb3Auth(config);
// IMP END - Bundler Issues
