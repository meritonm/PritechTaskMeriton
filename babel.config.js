module.exports = function (api) {
  api.cache(true);
  return {
    presets: [require.resolve('babel-preset-expo')],
    // react-native-reanimated/plugin must be listed last.
    plugins: ['react-native-reanimated/plugin'],
  };
};
