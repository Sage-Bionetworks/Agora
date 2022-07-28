process.env.CHROME_BIN =
  process.env.CHROME_BIN || require('puppeteer').executablePath();

/**
 * @author: tipe.io
 */

module.exports = function (config) {
  const testWebpackConfig = require('./webpack.test.js')({ env: 'test' });

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
    frameworks: ['jasmine'],

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
     * we are building the test environment in ./spec-bundle.js
     */
    files: [
      { pattern: './config/spec-bundle.js', watched: false },
      {
        pattern: './src/assets/**/*',
        watched: false,
        included: false,
        served: true,
        nocache: false,
      },
    ],

    /**
     * By default all assets are served at http://localhost:[PORT]/base/
     */
    proxies: {
      '/assets/': '/base/src/assets/',
    },

    /**
     * Preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: {
      './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'],
    },

    /**
     * Webpack Config at ./webpack.test.js
     */
    webpack: testWebpackConfig,

    coverageReporter: {
      reporters: [{ type: 'in-memory' }],
    },

    remapCoverageReporter: {
      'text-summary': null,
      json: './coverage/coverage.json',
      html: './coverage/html',
      lcovonly: './coverage/lcov.info',
    },

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

    /**
     * Test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: ['mocha', 'coverage', 'remap-coverage', 'coveralls'],

    coverageIstanbulReporter: {
      reports: ['text-summary', 'html'],
      fixWebpackSourcePaths: true,
    },

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
    /**
     * For slower machines you may need to have a longer browser
     * wait time . Uncomment the line below if required.
     */
    // browserNoActivityTimeout: 30000
  };

  // Optional Sonar Qube Reporter
  if (process.env.SONAR_QUBE) {
    // SonarQube reporter plugin configuration
    configuration.sonarQubeUnitReporter = {
      sonarQubeVersion: '5.x',
      outputFile: 'reports/ut_report.xml',
      overrideTestDescription: true,
      testPath: 'src/app',
      testFilePattern: '.spec.ts',
      useBrowserName: false,
    };

    // Additional lcov format required for
    // sonarqube
    configuration.remapCoverageReporter.lcovonly = './coverage/coverage.lcov';

    configuration.reporters.push('sonarqubeUnit');
  }

  if (process.env.TRAVIS) {
    configuration.browsers = ['ChromeTravisCi'];
  }

  config.set(configuration);
};
