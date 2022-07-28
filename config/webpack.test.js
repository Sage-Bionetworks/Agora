/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const autoprefixer = require('autoprefixer');

const VERSION = JSON.stringify(require('../package.json')['version']);
const DATA_VERSION = JSON.stringify(require('../package.json')['data-version']);

/**
 * Webpack Constants
 */
const ENV =
  (process.env.mode =
  process.env.ENV =
  process.env.NODE_ENV =
    'test');

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function () {
  return {
    mode: 'production',
    /**
     * Source map for Karma from the help of karma-sourcemap-loader &  karma-webpack
     *
     * Do not change, leave as is or it wont work.
     * See: https://github.com/webpack/karma-webpack#source-maps
     */
    devtool: 'inline-source-map',

    /**
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {
      /**
       * An array of extensions that should be used to resolve modules.
       *
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.ts', '.js'],

      /**
       * Make sure root is src
       */
      modules: [helpers.root('src'), 'node_modules'],

      alias: {
        crossfilter: 'crossfilter2',
      },
    },

    /**
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     *
     * 'use:' revered back to 'loader:' as a temp. workaround for #1188
     * See: https://github.com/AngularClass/angular-starter/issues/1188#issuecomment-262872034
     */
    module: {
      rules: [
        /**
         * Source map loader support for *.js files
         * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
         *
         * See: https://github.com/webpack/source-map-loader
         */
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            /**
             * These packages have problems with their sourcemaps
             */
            helpers.root('node_modules/rxjs'),
            helpers.root('node_modules/@angular'),
            helpers.root('node_modules/primeng'),
            helpers.root('node_modules/ng-mocks'),
          ],
        },

        /**
         * Typescript loader support for .ts and Angular 2 async routes via .async.ts
         *
         * See: https://github.com/s-panferov/awesome-typescript-loader
         */
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              query: {
                /**
                 * Use inline sourcemaps for "karma-remap-coverage" reporter
                 */
                sourceMap: false,
                inlineSourceMap: true,
                compilerOptions: {
                  /**
                   * Remove TypeScript helpers to be injected
                   * below by DefinePlugin
                   */
                  removeComments: true,
                },
              },
            },
            'angular2-template-loader',
          ],

          /**
           * To string and css loader support for *.css files (from Angular components)
           * Returns file content as string
           *
           */

          exclude: [/\.e2e\.ts$/],
        },

        /**
         * Raw loader support for *.css files
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.css$/,
          loader: [
            'to-string-loader',
            { loader: 'css-loader', options: { url: false } },
          ],
          exclude: [helpers.root('src/index.html')],
        },

        /**
         * Raw loader support for *.scss files
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.scss$/,
          loader: [
            'raw-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [autoprefixer()],
              },
            },
            'sass-loader',
          ],
          exclude: [helpers.root('src/index.html')],
        },

        /**
         * Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [helpers.root('src/index.html')],
        },

        /* File loader for supporting fonts, for example, in CSS files.
         */
        {
          test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
          use: 'file-loader',
          include: [helpers.root('node_modules/lato-font')],
        },

        /**
         * Instruments JS files with Istanbul for subsequent code coverage reporting.
         * Instrument only testing sources.
         *
         * See: https://github.com/deepsweet/istanbul-instrumenter-loader
         */
        {
          enforce: 'post',
          test: /\.(js|ts)$/,
          loader: 'istanbul-instrumenter-loader',
          include: helpers.root('src'),
          exclude: [/\.(e2e|spec)\.ts$/, /node_modules/],
        },
      ],
    },

    /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       *
       * NOTE: when adding more properties make sure you include them in custom-typings.d.ts
       */
      new DefinePlugin({
        ENV: JSON.stringify(ENV),
        HMR: false,
        VERSION: VERSION,
        DATA_VERSION: DATA_VERSION,
        'process.env': {
          ENV: JSON.stringify(ENV),
          NODE_ENV: JSON.stringify(ENV),
          HMR: false,
        },
      }),

      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       *
       * See: https://webpack.js.org/plugins/context-replacement-plugin/
       * See: https://github.com/angular/angular/issues/11580
       */
      new ContextReplacementPlugin(
        /**
         * The (\\|\/) piece accounts for path separators in *nix and Windows
         */
        /\@angular(\\|\/)core(\\|\/)fesm5/,
        helpers.root('src'), // location of your src
        {
          /**
           * your Angular Async Route paths relative to this root directory
           */
        }
      ),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        debug: false,
        options: {
          /**
           * legacy options go here
           */
        },
      }),
    ],

    /**
     * Disable performance hints
     *
     * See: https://github.com/a-tarasyuk/rr-boilerplate/blob/master/webpack/dev.config.babel.js#L41
     */
    performance: {
      hints: false,
    },

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false,
      fs: 'empty',
    },
  };
};
