/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');
const buildUtils = require('./build-utils');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
const TerserPlugin = require("terser-webpack-plugin");  // replace uglifyjs-webpack-plugin because it doesn't support es6

module.exports = function (env) {
  const ENV = (process.env.mode = process.env.NODE_ENV = process.env.ENV = 'production');
  const Analyzer = process.env.Analyzer || false;

  const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8080,
    ENV: ENV,
    HMR: false,
    Analyzer: Analyzer
  });

  // set environment suffix so these environments are loaded.
  METADATA.envFileSuffix = METADATA.E2E ? 'e2e.prod' : 'prod';

  return webpackMerge(commonConfig({ env: ENV, metadata: METADATA }), {
    mode: 'production',

    devtool: 'source-map',

    /**
     * Options affecting the output of the compilation.
     *
     * See: http://webpack.github.io/docs/configuration.html#output
     */
    output: {

      /**
       * The output directory as absolute path (required).
       *
       * See: http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist'),

      /**
       * Specifies the name of each output file on disk.
       * IMPORTANT: You must not specify an absolute path here!
       *
       * See: http://webpack.github.io/docs/configuration.html#output-filename
       */
      filename: '[name].[chunkhash].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files.
       * They are inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[file].map',

      /**
       * The filename of non-entry chunks as relative path
       * inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[name].[chunkhash].chunk.js'
    },

    module: {

      rules: [

        /**
         * Extract CSS files from .src/styles directory to external CSS file
         */
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
          include: [helpers.root('src', 'styles')]
        },

        /**
         * Extract and compile SCSS files from .src/styles directory to external CSS file
         */
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                plugins: () => [autoprefixer()]
            }
          }, 'sass-loader'],
          include: [helpers.root('src', 'styles')]
        },
      ]
    },

    optimization: {
      minimizer: [
        /**
         * Plugin: TerserPlugin
         * Description: Replace UglifyJsPlugin to support es6.
         * Minimize all JavaScript output of chunks.
         * Loaders are switched into minimizing mode.
         */
          new TerserPlugin({
              parallel: true,
              terserOptions: {
                  ecma: 6,
                  compress: false // disable so it doesn't break 3rd party libraries while files still minimized.
              }
          })
      ],
      splitChunks: {
        chunks: 'all'
      }
    },

    /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      new MiniCssExtractPlugin({ filename: '[name]-[contenthash].css', chunkFilename: '[name]-[chunkhash].css' }),
      new HashedModuleIdsPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [
            autoprefixer()
          ]
        }
      })
    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false,
      fs: 'empty'
    }

  });
}
