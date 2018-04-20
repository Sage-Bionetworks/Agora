const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require( 'nodemon-webpack-plugin' );
const helpers = require('./helpers');

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
            nodeArgs: [ '--inspect=9222' ]
        }),
    ],
    target: 'node',
    externals: [nodeExternals()],
    node: {
        __dirname: false,
        __filename: false,
    },
    module: {
        rules: [
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
                        },
                    }
                ],
                exclude: [/\.e2e\.ts$/]
            }
        ]
    }
}