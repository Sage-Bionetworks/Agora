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
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'coverage-istanbul-loader',
            options: { esModules: true },
          },
          enforce: 'post',
          include: helpers.root('src'),
          exclude: [/\.(e2e|spec)\.ts$/, /node_modules/],
        },
      ],
    },
    plugins: [
      new AngularWebpackPlugin({
        tsconfig: helpers.root('tsconfig.spec.json'),
        sourceMap: true,
      }),
    ],
  });
};
