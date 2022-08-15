const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const WebpackInlineManifestPlugin = require('webpack-inline-manifest-plugin');

const helpers = require('./helpers');

const packageJson = require('../package.json');
const VERSION = JSON.stringify(packageJson['version']);
const DATA_VERSION = JSON.stringify(
  packageJson['data-file'] + '-v' + packageJson['data-version']
);

module.exports = function (options) {
  return {
    entry: {
      polyfills: './src/polyfills.ts',
      main: './src/main.ts',
    },
    output: {
      path: helpers.root('dist'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[file].map',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          loader: '@ngtools/webpack',
        },
        {
          test: /\.m?js$/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: ['@angular/compiler-cli/linker/babel'],
              compact: false,
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.scss$/i,
          use: ['raw-loader', 'postcss-loader', 'sass-loader'],
          include: [helpers.root('src/app')],
        },
        {
          test: /\.s?css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
          exclude: [helpers.root('src/app')],
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
          exclude: [helpers.root('src/index.html')],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
    },
    devtool: 'cheap-module-source-map',
    plugins: [
      new webpack.DefinePlugin({
        VERSION: VERSION,
        DATA_VERSION: DATA_VERSION,
      }),
      new ProvidePlugin({
        dc: 'dc',
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: 'src/assets', to: 'assets' }, { from: 'src/meta' }],
      }),
      new HtmlWebpackPlugin({
        template: helpers.root('src/index.html'),
      }),
      new StylelintPlugin({
        configFile: '.stylelintrc',
        context: 'src',
        failOnError: false,
        quiet: false,
      }),
    ],
  };
};
