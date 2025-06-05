module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './',
            '@components': './app/components',
            '@hooks': './app/hooks',
            '@services': './app/services',
            '@store': './app/store',
            '@types': './app/types',
            '@constants': './app/constants',
            '@config': './app/config',
            '@assets': './app/assets',
            '@styles': './app/styles'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
}; 