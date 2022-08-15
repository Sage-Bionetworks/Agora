const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;

const helpers = require('./helpers');

module.exports = function (options) {
  return merge(commonConfig({}), {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        API_URL: JSON.stringify(''),
      }),
      new AngularWebpackPlugin({
        tsconfig: helpers.root('tsconfig.json'),
        // fileReplacements: [
        //   {
        //     replace: 'src/environments/environment.ts',
        //     with: 'src/environments/environment.prod.ts',
        //   },
        // ],
      }),
    ],
  });
};
