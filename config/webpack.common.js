/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');

/**
 * Webpack Plugins
 *
 * problem with copy-webpack-plugin
 */
const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackInlineManifestPlugin = require('webpack-inline-manifest-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StyleLintPlugin = require('stylelint-bare-webpack-plugin');
const rxPaths = require('rxjs/_esm2015/path-mapping');
const autoprefixer = require('autoprefixer');

const buildUtils = require('./build-utils');

const VERSION = JSON.stringify(require('../package.json')['version']);
const DATA_VERSION = JSON.stringify(require('../package.json')['data-file'] + '-v' +
  require('../package.json')['data-version']);

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
    const isProd = options.env === 'production';
    const APP_CONFIG = require(process.env.ANGULAR_CONF_FILE || (isProd ? './config.prod.json' : './config.dev.json'));

    const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA,options.metadata || {});
    const GTM_API_KEY = process.env.GTM_API_KEY || APP_CONFIG.gtmKey;

    const ngcWebpackConfig = buildUtils.ngcWebpackSetup(isProd, METADATA);
    const supportES2015 = buildUtils.supportES2015(METADATA.tsConfigPath);

    const entry = {
      polyfills: './src/polyfills.browser.ts',
      main:      './src/main.browser.ts'
    };

    Object.assign(ngcWebpackConfig.plugin, {
      tsConfigPath: METADATA.tsConfigPath,
      mainPath: entry.main
    });

    /**
     * Plugin: BundleAnalyzerPlugin
     * Visualize size of webpack output files with an interactive zoomable treemap
     *
     * https://github.com/webpack-contrib/webpack-bundle-analyzer
     */
    const baPlugin = (METADATA.Analyzer === 'true') ? [new BundleAnalyzerPlugin({
      openAnalyzer: false
    })] : [];

    /*const baPlugin = [new BundleAnalyzerPlugin({
      openAnalyzer: false
    })];*/

  return {
    /**
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: entry,

    /**
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {
      mainFields: [ ...(supportES2015 ? ['es2015'] : []), 'browser', 'module', 'main' ],

      /**
       * An array of extensions that should be used to resolve modules.
       *
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.ts', '.tsx', '.js', '.json'],

      /**
       * An array of directory names to be resolved to the current directory
       */
      modules: [helpers.root('src'), helpers.root('node_modules'), "node_modules"],

      /**
       * Add support for lettable operators.
       *
       * For existing codebase a refactor is required.
       * All rxjs operator imports (e.g. `import 'rxjs/add/operator/map'` or `import { map } from `rxjs/operator/map'`
       * must change to `import { map } from 'rxjs/operators'` (note that all operators are now under that import.
       * Additionally some operators have changed to to JS keyword constraints (do => tap, catch => catchError)
       *
       * Remember to use the `pipe()` method to chain operators, this functinoally makes lettable operators similar to
       * the old operators usage paradigm.
       *
       * For more details see:
       * https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md#build-and-treeshaking
       *
       * If you are not planning on refactoring your codebase (or not planning on using imports from `rxjs/operators`
       * comment out this line.
       *
       * BE AWARE that not using lettable operators will probably result in significant payload added to your bundle.
       */
      alias: rxPaths()
    },

    /**
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      rules: [
        ...ngcWebpackConfig.loaders,

        /**
         * Extract CSS files from .src/styles directory to external CSS file
         */
        {
          test: /\.css$/,
          use: ['to-string-loader', 'css-loader'],
          include: [helpers.root('src', 'styles')]
        },

        /**
         * To string and sass loader support for *.scss files (from Angular components)
         * Returns compiled css content as string
         *
         */
        {
          test: /\.(sass|css|scss)$/,
          use: ['to-string-loader', 'css-loader', {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                plugins: () => [autoprefixer()]
            }
          }, 'sass-loader'],
          exclude: [helpers.root('src', 'styles')]
        },

        /**
         * Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          use: 'raw-loader',
          exclude: [helpers.root('src/index.html')]
        },

        /**
         * File loader for supporting images, for example, in CSS files.
         */
        {
          test: /\.(jpg|png|gif)$/,
          use: 'file-loader'
        },

        /* File loader for supporting fonts, for example, in CSS files.
        */
        {
          test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
          use: 'file-loader'
        }

      ],

    },

    /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [...baPlugin, ...[
      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       */
      // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'AOT': METADATA.AOT,
        'VERSION': VERSION,
        'DATA_VERSION': DATA_VERSION,
        'process.env.ENV': JSON.stringify(METADATA.ENV),
        'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
        'process.env.HMR': METADATA.HMR,
        'Analyzer': JSON.stringify(METADATA.Analyzer)
      }),

      new webpack.optimize.ModuleConcatenationPlugin(),

      /**
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       *
       * Copies project static assets.
       *
       * See: https://www.npmjs.com/package/copy-webpack-plugin
       */
      new CopyWebpackPlugin(
        [
          { from: 'src/assets', to: 'assets' },
          { from: 'src/meta' },
          { from: 'node_modules/screenfull/dist/screenfull.js' },
          { from: 'node_modules/angular-screenfull/dist/angular-screenfull.min.js' }
        ],
        isProd ? { ignore: ['mock-data/**/*'] } : undefined
      ),

      /*
      * Plugin: HtmlWebpackPlugin
      * Description: Simplifies creation of HTML files to serve your webpack bundles.
      * This is especially useful for webpack bundles that include a hash in the filename
      * which changes every compilation.
      *
      * See: https://github.com/ampedandwired/html-webpack-plugin
      */
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        title: METADATA.title,
        chunksSortMode: function (a, b) {
          const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main"];
          return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
        },
        metadata: METADATA,
        gtmKey: GTM_API_KEY,
        inject: 'body',
        xhtml: true,
        minify: isProd
          ? {
              caseSensitive: true,
              collapseWhitespace: true,
              keepClosingSlash: true
            }
          : false
      }),

       /**
       * Plugin: ScriptExtHtmlWebpackPlugin
       * Description: Enhances html-webpack-plugin functionality
       * with different deployment options for your scripts including:
       *
       * See: https://github.com/numical/script-ext-html-webpack-plugin
       */
      new ScriptExtHtmlWebpackPlugin({
        sync: /inline|polyfills|vendor/,
        defaultAttribute: 'async',
        preload: [/polyfills|vendor|main/],
        prefetch: [/chunk/]
      }),

      /**
       * Plugin: HtmlElementsPlugin
       * Description: Generate html tags based on javascript maps.
       *
       * If a publicPath is set in the webpack output configuration, it will be automatically added to
       * href attributes, you can disable that by adding a "=href": false property.
       * You can also enable it to other attribute by settings "=attName": true.
       *
       * The configuration supplied is map between a location (key) and an element definition object (value)
       * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
       *
       * Example:
       *  Adding this plugin configuration
       *  new HtmlElementsPlugin({
       *    headTags: { ... }
       *  })
       *
       *  Means we can use it in the template like this:
       *  <%= webpackConfig.htmlElements.headTags %>
       *
       * Dependencies: HtmlWebpackPlugin
       */
      new HtmlElementsPlugin({
        headTags: require('./head-config.common')
      }),

      new AngularCompilerPlugin(ngcWebpackConfig.plugin),

      /**
       * Plugin: WebpackInlineManifestPlugin
       * Inline Webpack's manifest.js in index.html
       *
       * https://github.com/almothafar/webpack-inline-manifest-plugin
       */
      new WebpackInlineManifestPlugin(),

      new ProvidePlugin({
        'dc': 'dc'
      }),

      new StyleLintPlugin({
        configFile: '.stylelintrc',
        context: 'src',
        files: '**/*.s?(a|c)ss',
        failOnError: false,
        quiet: false
      })
    ]],

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
        setImmediate: false
    }

  };
}
