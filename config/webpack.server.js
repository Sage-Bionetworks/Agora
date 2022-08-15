const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

const helpers = require('./helpers');

module.exports = function () {
  return {
    entry: {
      server: helpers.root('src/server/server.ts'),
    },
    output: {
      filename: '[name].js',
      path: helpers.root('dist'),
    },
    target: 'node',
    externals: [nodeExternals()],
    node: {
      __dirname: false,
      __filename: false,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [helpers.root('node_modules')],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: helpers.root('tsconfig.server.json'),
              },
            },
          ],
          exclude: [/\.(e2e|spec)\.ts$/],
        },
      ],
    },
    plugins: [
      new NodemonPlugin({
        // What to watch.
        watch: helpers.root('dist/server.js'),
        // Detailed log.
        verbose: true,
        // Node arguments.
        nodeArgs: ['--inspect=9222', '--max_old_space_size=10000'],
      }),
    ],
  };
};
