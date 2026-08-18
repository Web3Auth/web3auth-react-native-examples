const path = require("path");
const { getDefaultConfig } = require("@react-native/metro-config");
// IMP START - Bundler Issues
const { withWeb3Auth } = require("@web3auth/react-native-sdk/metro-config");
// IMP END - Bundler Issues

const projectRoot = __dirname;
const config = withWeb3Auth(getDefaultConfig(projectRoot));
const baseResolve = config.resolver.resolveRequest;

const authShim = path.join(projectRoot, "shims/web3auth-auth.js");

// IMP START - Bundler Issues
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@web3auth/auth") {
    return { type: "sourceFile", filePath: authShim };
  }
  return baseResolve(context, moduleName, platform);
};

module.exports = config;
// IMP END - Bundler Issues
