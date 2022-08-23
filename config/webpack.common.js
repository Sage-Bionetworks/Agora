const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const helpers = require('./helpers');
const package = require('../package.json');

module.exports = function (env, argv) {
  const NODE_ENV = argv?.mode || process.env.NODE_ENV || 'production';
  const APP_ENV = process.env.APP_ENV || null;

  const API_HOST = process.env.API_HOST || null;
  const API_PORT = process.env.API_PORT || null;

  const VERSION = package['version'];
  const DATA_VERSION = package['data-file'] + '-v' + package['data-version'];

  return {
    mode: NODE_ENV,
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
          use: [
            {
              loader: 'css-loader',
              options: {
                exportType: 'string',
                url: false,
              },
            },
            'sass-loader',
          ],
          include: [helpers.root('src/app')],
        },
        {
          test: /\.s?css$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              // options: {
              //   url: false,
              // },
            },
            'sass-loader',
          ],
          exclude: [helpers.root('src/app')],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name][ext][query]',
          },
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext][query]',
          },
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
    },
    devtool: NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV),
        APP_ENV: JSON.stringify(APP_ENV),
        API_HOST: JSON.stringify(API_HOST),
        API_PORT: JSON.stringify(API_PORT),
        VERSION: JSON.stringify(VERSION),
        DATA_VERSION: JSON.stringify(DATA_VERSION),
      }),
      new ProvidePlugin({
        dc: 'dc',
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: 'src/assets', to: 'assets/' }, { from: 'src/meta' }],
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
