module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          unstable_transformProfile: "hermes-v0",
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: ["@babel/plugin-transform-export-namespace-from"],
  };
};
