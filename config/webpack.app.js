const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;

const helpers = require('./helpers');

module.exports = function (env, argv) {
  return merge(commonConfig(env, argv), {
    plugins: [
      new AngularWebpackPlugin({
        tsconfig: helpers.root('tsconfig.json'),
      }),
    ],
  });
};
