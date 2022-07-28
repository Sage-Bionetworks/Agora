const webpack = require('webpack');
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const WebpackInlineManifestPlugin = require('webpack-inline-manifest-plugin');

const helpers = require('./helpers');

const VERSION = JSON.stringify(require('../package.json')['version']);
const DATA_VERSION = JSON.stringify(
  require('../package.json')['data-file'] +
    '-v' +
    require('../package.json')['data-version']
);

module.exports = function (options) {
  const ENV =
    (process.env.mode =
    process.env.ENV =
    process.env.NODE_ENV =
      'development');
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 8080;
  const Analyzer = process.env.Analyzer || false;

  const METADATA = Object.assign(
    {},
    {} /*buildUtils.DEFAULT_METADATA*/,
    {
      host: HOST,
      port: PORT,
      ENV: ENV,
      //HMR: helpers.hasProcessFlag("hot"),
      PUBLIC: process.env.PUBLIC_DEV || HOST + ':' + PORT,
      Analyzer: Analyzer,
    }
  );

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
          exclude: [helpers.root('/src/index.html')],
        },
      ],
    },
    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      //hot: METADATA.HMR,
      public: METADATA.PUBLIC,
      historyApiFallback: true,
    },
    devtool: 'cheap-module-source-map',
    plugins: [
      new webpack.DefinePlugin({
        ENV: JSON.stringify(METADATA.ENV),
        HMR: METADATA.HMR,
        AOT: METADATA.AOT,
        VERSION: VERSION,
        DATA_VERSION: DATA_VERSION,
        'process.env.ENV': JSON.stringify(METADATA.ENV),
        'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
        'process.env.HMR': METADATA.HMR,
        Analyzer: JSON.stringify(METADATA.Analyzer),
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
      new AngularWebpackPlugin({
        tsconfig: helpers.root('tsconfig.json'),
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
