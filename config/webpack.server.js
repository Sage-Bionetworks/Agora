const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = function (env, argv) {
  const helpers = require('./helpers');

  const NODE_ENV = argv?.mode || process.env.NODE_ENV || 'production';
  const APP_ENV = process.env.APP_ENV || NODE_ENV;

  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 8080;

  const MONGODB_HOST = process.env.MONGODB_HOST || null;
  const MONGODB_PORT = process.env.MONGODB_PORT || null;

  return {
    mode: NODE_ENV,
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
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.APP_ENV': JSON.stringify(APP_ENV),
        'process.env.HOST': JSON.stringify(HOST),
        'process.env.PORT': JSON.stringify(PORT),
        'process.env.MONGODB_HOST': JSON.stringify(MONGODB_HOST),
        'process.env.MONGODB_PORT': JSON.stringify(MONGODB_PORT),
      }),
      new NodemonPlugin(),
    ],
  };
};
