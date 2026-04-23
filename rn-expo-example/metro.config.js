const { getDefaultConfig } = require("expo/metro-config");
// IMP START - Bundler Issues
const { withWeb3Auth } = require("@web3auth/react-native-sdk/metro-config");
// IMP END - Bundler Issues

const config = getDefaultConfig(__dirname);

// IMP START - Bundler Issues
module.exports = withWeb3Auth(config);
// IMP END - Bundler Issues
