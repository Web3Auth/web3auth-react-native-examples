const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
// IMP START - Bundler Issues
const { withWeb3Auth } = require("@web3auth/react-native-sdk/metro-config");
// IMP END - Bundler Issues

const config = withWeb3Auth(getDefaultConfig(__dirname));
const baseResolve = config.resolver.resolveRequest;

const pkgRoot = (name) => path.dirname(require.resolve(`${name}/package.json`));
const quickBase64Entry = path.join(pkgRoot("react-native-quick-base64"), "lib/module/index.js");
const esToolkitWordsEntry = path.join(pkgRoot("es-toolkit"), "dist/string/words.mjs");
const esToolkitCompatWords = `${path.sep}es-toolkit${path.sep}dist${path.sep}compat${path.sep}string${path.sep}words.`;

// IMP START - Bundler Issues
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native-quick-base64") {
    return { type: "sourceFile", filePath: quickBase64Entry };
  }
  if (moduleName === "tslib") {
    return { type: "sourceFile", filePath: require.resolve("tslib/tslib.js") };
  }

  const resolved = baseResolve(context, moduleName, platform);
  if (resolved?.type === "sourceFile" && resolved.filePath.includes(esToolkitCompatWords)) {
    return { type: "sourceFile", filePath: esToolkitWordsEntry };
  }
  return resolved;
};

module.exports = config;
// IMP END - Bundler Issues
