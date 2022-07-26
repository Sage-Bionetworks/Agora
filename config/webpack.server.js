const path = require('path');
const nodeExternals = require('webpack-node-externals');
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;
const NodemonPlugin = require('nodemon-webpack-plugin');

const helpers = require('./helpers');

module.exports = function (options) {
  const ENV =
    process.env.mode ||
    process.env.NODE_ENV ||
    process.env.ENV ||
    'development';
  const HOST = process.env.HOST || 'localhost';

  const MONGODB_HOST = process.env.MONGODB_HOST || null;
  const MONGODB_PORT = process.env.MONGODB_PORT || null;
  const APP_ENV = process.env.APP_ENV || null;

  const METADATA = Object.assign(
    {},
    /*buildUtils.DEFAULT_METADATA*/ {},
    {
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || 8080,
      ENV: ENV,
      MONGODB_HOST: MONGODB_HOST,
      MONGODB_PORT: MONGODB_PORT,
      APP_ENV: APP_ENV,
    }
  );

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
      fallback: {
        crypto: false,
        http: false,
        https: false,
        os: false,
        path: false,
        stream: false,
        process: false,
        url: false,
        fs: false,
        util: false,
        querystring: false,
        net: false,
        zlib: false,
        async_hooks: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.server.json',
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
