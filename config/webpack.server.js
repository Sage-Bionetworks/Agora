/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const buildUtils = require('./build-utils');

/**
 * Webpack Plugins
 *
 * problem with copy-webpack-plugin
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require( 'nodemon-webpack-plugin' );

const ENV = (process.env.mode || process.env.NODE_ENV || process.env.ENV || 'development');
const Docker = process.env.Docker || false;
const HOST = process.env.HOST || 'localhost';

const MONGODB_HOST = process.env.MONGODB_HOST || null;
const MONGODB_PORT = process.env.MONGODB_PORT || null;

const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    ENV: ENV,
    Docker: Docker,
    MONGODB_HOST: MONGODB_HOST,
    MONGODB_PORT: MONGODB_PORT
});

module.exports = {
    entry: {
        server: './src/server/server.ts'
    },
    output: {
        path: helpers.root('dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'],
        modules: [
            helpers.root('node_modules')
        ]
    },
    plugins: [
        new NodemonPlugin({
            // What to watch.
            watch: helpers.root('dist/server.js'),

            // Files to ignore.
            ignore: ['*.js.map'],

            // Detailed log.
            verbose: true,

            // Node arguments.
            nodeArgs: [ '--inspect=9222', '--max_old_space_size=10000' ]
        }),

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
        'process.env.ENV': JSON.stringify(METADATA.ENV),
        'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
        'process.env.HOST': JSON.stringify(METADATA.host),
        'process.env.PORT': JSON.stringify(METADATA.port),
        'process.env.Docker': JSON.stringify(METADATA.Docker),
        'process.env.MONGODB_HOST': JSON.stringify(METADATA.MONGODB_HOST),
        'process.env.MONGODB_PORT': JSON.stringify(METADATA.MONGODB_PORT)
      })
    ],
    target: 'node',
    externals: [nodeExternals()],
    node: {
        __dirname: false,
        __filename: false,
    },
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
                    helpers.root('node_modules/@angular')
                ]
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
                    configFileName: helpers.root('tsconfig.server.json'),
                    sourceMap: false,
                    inlineSourceMap: true,
                    compilerOptions: {
                        /**
                         * Remove TypeScript helpers to be injected
                         * below by DefinePlugin
                         */
                        removeComments: true
                    }
                    }
                },
                'angular2-template-loader'
                ],
                exclude: [/\.(e2e|spec)\.ts$/]
            },
        ]
    }
}