module.exports = function (config) {
  const configuration = {
    /**
     * Base path that will be used to resolve all patterns (e.g. files, exclude).
     */
    basePath: '',

    /**
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['jasmine', 'webpack', 'viewport'],

    /**
     * List of files to exclude.
     */
    exclude: [],

    client: {
      captureConsole: false,
    },

    /**
     * List of files / patterns to load in the browser
     *
     * we are building the test environment in ../testing/spec-bundle.js
     */
    files: [{ pattern: '../testing/spec-bundle.js', watched: false }],

    proxies: {
      '/assets/': '../src/assets/',
    },

    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-mocha-reporter'),
      require('karma-remap-coverage'),
      require('karma-viewport'),
    ],

    /**
     * Preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: {
      '../testing/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'],
    },

    /**
     * Webpack Config at ./webpack.test.js
     */
    webpack: require('./webpack.spec.js')(),

    /**
     * Webpack please don't spam the console when running in karma!
     */
    webpackMiddleware: {
      /**
       * webpack-dev-middleware configuration
       * i.e.
       */
      logLevel: 'warn',
      /**
       * and use stats to turn off verbose output
       */
      stats: {
        /**
         * options i.e.
         */
        chunks: false,
      },
    },

    coverageReporter: {
      type: 'in-memory',
      dir: '../coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcov', subdir: 'lcov' },
      ],
    },

    remapCoverageReporter: {
      'text-summary': null,
      html: '../coverage/html',
      cobertura: '../coverage/cobertura.xml',
    },

    coverageIstanbulReporter: {
      reports: ['text-summary', 'html'],
      fixWebpackSourcePaths: true,
    },

    /**
     * Test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: ['mocha', 'coverage', 'remap-coverage'],

    /**
     * Web server port.
     */
    port: 9876,

    /**
     * enable / disable colors in the output (reporters and logs)
     */
    colors: true,

    /**
     * Level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_WARN,

    /**
     * enable / disable watching file and executing tests whenever any file changes
     */
    autoWatch: false,

    /**
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers: ['ChromeTravisCi'],

    customLaunchers: {
      ChromeTravisCi: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222',
        ],
      },
    },

    /**
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     */
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  };

  // Optional Sonar Qube Reporter
  if (process.env.SONAR_QUBE) {
    // SonarQube reporter plugin configuration
    configuration.sonarQubeUnitReporter = {
      sonarQubeVersion: '5.x',
      outputFile: 'reports/ut_report.xml',
      overrideTestDescription: true,
      testPath: 'src/components',
      testFilePattern: '.spec.ts',
      useBrowserName: false,
    };

    // Additional lcov format required for
    // sonarqube
    configuration.remapCoverageReporter.lcovonly = './coverage/coverage.lcov';

    configuration.reporters.push('sonarqubeUnit');
  }

  config.set(configuration);
};
