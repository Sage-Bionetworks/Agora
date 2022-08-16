const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;

const helpers = require('./helpers');
const API_URL = JSON.stringify('http://localhost:8080');

module.exports = function (env, argv) {
  return merge(commonConfig(env, argv), {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
      new webpack.DefinePlugin({
        API_URL: API_URL,
      }),
      new AngularWebpackPlugin({
        tsconfig: helpers.root('tsconfig.json'),
      }),
    ],
  });
};
