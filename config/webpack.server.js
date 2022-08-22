const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = function (env, argv) {
  const helpers = require('./helpers');

  return {
    mode: argv?.mode || process.env.NODE_ENV || 'production',
    entry: {
      server: helpers.root('src/server/server.ts'),
    },
    output: {
      filename: '[name].js',
      path: helpers.root('dist'),
    },
    target: 'node',
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
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
    plugins: [new NodemonPlugin()],
  };
};
