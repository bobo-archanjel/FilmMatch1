module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    overrides: [
      {
        // Exclude node_modules so the plugin doesn't run on them
        exclude: /node_modules/,
        plugins: [
          [
            'module:react-native-dotenv',
            {
              moduleName: '@env',
              path: '.env',
              safe: false,
              allowUndefined: true,
            },
          ],
        ],
      },
    ],
  };
};
