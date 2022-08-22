module.exports = function (config) {
  const configuration = {
    // -------------------------------------------------------------------------------- //
    frameworks: ['jasmine', 'webpack'],

    // -------------------------------------------------------------------------------- //
    files: [{ pattern: '../testing/spec-bundle.js', watched: false }],
    preprocessors: {
      '../testing/spec-bundle.js': ['coverage', 'webpack'],
    },

    // -------------------------------------------------------------------------------- //
    reporters: ['mocha', 'coverage', 'coverage-istanbul', 'coveralls'],
    coverageReporter: {
      type: 'in-memory',
    },
    coverageIstanbulReporter: {
      reports: ['text-summary', 'html', 'lcovonly'],
      fixWebpackSourcePaths: true,
    },

    // -------------------------------------------------------------------------------- //
    proxies: {
      '/assets/': '../src/assets/',
    },

    // -------------------------------------------------------------------------------- //
    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },

    // -------------------------------------------------------------------------------- //
    webpack: require('./webpack.spec.js')(),
    webpackMiddleware: {
      logLevel: 'warn',
      stats: {
        chunks: false,
      },
    },

    // -------------------------------------------------------------------------------- //
    colors: true,
    logLevel: config.LOG_WARN,
    singleRun: true,
    autoWatch: false,
    port: 9876,
    client: {
      captureConsole: false,
    },
  };

  config.set(configuration);
};
