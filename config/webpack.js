const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;

const helpers = require('./helpers');
const packageJson = require('../package.json');

module.exports = function (env, argv) {
  const VERSION = JSON.stringify(packageJson['version']);
  const DATA_VERSION = JSON.stringify(
    packageJson['data-file'] + '-v' + packageJson['data-version']
  );

  const NODE_ENV = argv?.mode || process.env.NODE_ENV || 'production';
  const APP_ENV = process.env.APP_ENV || NODE_ENV;

  const API_HOST = process.env.API_HOST || (argv?.port ? 'localhost' : null);
  const API_PORT = process.env.API_PORT || (argv?.port ? '8080' : null);

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
    devtool: NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV),
        APP_ENV: JSON.stringify(APP_ENV),
        API_HOST: JSON.stringify(API_HOST),
        API_PORT: JSON.stringify(API_PORT),
        VERSION: VERSION,
        DATA_VERSION: DATA_VERSION,
      }),
      new AngularWebpackPlugin({
        tsconfig: helpers.root('tsconfig.json'),
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
