const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;

const helpers = require('./helpers');

module.exports = function (env, argv) {
  const mode = argv?.mode || 'development';
  return merge(commonConfig({}), {
    mode: 'development',
    devtool: 'source-map',
    entry: {},
    output: {
      path: helpers.root('testing/spec-build'),
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.MODE': JSON.stringify(mode),
      }),
      new AngularWebpackPlugin({
        tsconfig: helpers.root('tsconfig.spec.json'),
      }),
    ],
  });
};
