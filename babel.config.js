module.exports = function babel(api) {
  api.cache(false);

  const presets = [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        targets: '>2%, not dead, not ie 11, not op_mini all'
      }
    ]
  ];

  const env = {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            loose: true,
            modules: 'commonjs',
            targets: {
              browsers: '>2%, not dead, not ie 11, not op_mini all',
              node: 'current'
            },
            debug: false
          }
        ]
      ]
    }
  };

  const plugins = [['@babel/plugin-proposal-object-rest-spread', { loose: true }]];

  return {
    env,
    presets,
    plugins
  };
};
