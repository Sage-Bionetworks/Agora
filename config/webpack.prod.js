const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = function (options) {
  return merge(commonConfig({}), {
    mode: 'production',
    devtool: 'source-map',
  });
};
