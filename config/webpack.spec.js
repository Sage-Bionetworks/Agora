const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;

const helpers = require('./helpers');

module.exports = function (env, argv) {
  return merge(commonConfig(env, argv), {
    entry: {},
    output: {
      path: helpers.root('testing/spec-build'),
    },
    plugins: [
      new AngularWebpackPlugin({
        tsconfig: helpers.root('tsconfig.spec.json'),
      }),
    ],
  });
};
