const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;

const helpers = require('./helpers');

module.exports = function (options) {
  return merge(commonConfig({}), {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {},
    output: {},
    plugins: [
      new AngularWebpackPlugin({
        tsconfig: helpers.root('tsconfig.spec.json'),
      }),
    ],
  });
};
