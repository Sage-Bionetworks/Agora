const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require( 'nodemon-webpack-plugin' );
const helpers = require('./helpers');

module.exports = {
    entry: {
        server: './src/server/server.js'
    },
    output: {
        path: helpers.root('dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    plugins: [
        new NodemonPlugin({
            watch: helpers.root('src/server')
        }),
    ],
    target: 'node',
    externals: [nodeExternals()],
    node: {
        __dirname: false,
        __filename: false,
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', {
                            'targets': {
                            'node': 'current'
                            }
                        }]
                    ]
                }
            }
        }]
    }
}