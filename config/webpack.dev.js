/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const buildUtils = require('./build-utils');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const EvalSourceMapDevToolPlugin = require('webpack/lib/EvalSourceMapDevToolPlugin');

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 3000;

  const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: helpers.hasProcessFlag('hot'),
    PUBLIC: process.env.PUBLIC_DEV || HOST + ':' + PORT
  });

  return webpackMerge(commonConfig({ env: ENV, metadata: METADATA  }), {
    /**
     * Options affecting the output of the compilation.
     *
     * See: http://webpack.github.io/docs/configuration.html#output
     */
    output: {

      /**
       * The output directory as absolute path (required).
       *
       * See: http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist'),

      /**
       * Specifies the name of each output file on disk.
       * IMPORTANT: You must not specify an absolute path here!
       *
       * See: http://webpack.github.io/docs/configuration.html#output-filename
       */
      filename: '[name].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files.
       * They are inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[file].map',

      /** The filename of non-entry chunks as relative path
       * inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[id].chunk.js',

      library: 'ac_[name]',
      libraryTarget: 'var',
    },

    module: {

      rules: [

        /**
         * Css loader support for *.css files (styles directory only)
         * Loads external css styles into the DOM, supports HMR
         *
         */
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          include: [helpers.root('src', 'styles')]
        },

        /**
         * Sass loader support for *.scss files (styles directory only)
         * Loads external sass styles into the DOM, supports HMR
         *
         */
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          include: [helpers.root('src', 'styles')]
        },

      ]

    },

    plugins: [
      new EvalSourceMapDevToolPlugin({
        moduleFilenameTemplate: '[resource-path]',
        sourceRoot: 'webpack:///'
      }),

      /**
       * Plugin: NamedModulesPlugin (experimental)
       * Description: Uses file names as module name.
       *
       * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
       */
      new NamedModulesPlugin(),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        debug: true,
        options: { }
      })

      // TODO: HMR
    ],

    /**
     * Webpack Development Server configuration
     * Description: The webpack-dev-server is a little node.js Express server.
     * The server emits information about the compilation state to the client,
     * which reacts to those events.
     *
     * See: https://webpack.github.io/docs/webpack-dev-server.html
     */
    devServer: {
        port: METADATA.port,
        host: METADATA.host,
        hot: METADATA.HMR,
        public: METADATA.PUBLIC,
        historyApiFallback: true,
        watchOptions: {
            // if you're using Docker you may need this
            // aggregateTimeout: 300,
            // poll: 1000,
            ignored: [/node_modules/, helpers.root('src/server/**/*'), helpers.root('src/app/models/**/*')]
        },
        /**
         * Here you can access the Express app object and add your own custom middleware to it.
         *
         * See: https://webpack.github.io/docs/webpack-dev-server.html
         */
        setup: function(app) {
            let data = [
                {"ensembl_gene_id":"ENSG00000078043","logFC":"-0.44554823899289703","CI_L":"-0.547432004490222","CI_R":"-0.343664473495572","AveExpr":"1.33209693699624","adj_P_Val":"2.05317478168412e-12","hgnc_symbol":"PIAS2","neg_log10_adj_P_Val":"11.687574078642081","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000205302","logFC":"0.453451195106394","CI_L":"0.345258480019521","CI_R":"0.561643910193267","AveExpr":"2.93619931112318","adj_P_Val":"1.4453530922673e-11","hgnc_symbol":"SNX2","neg_log10_adj_P_Val":"10.840026044055568","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000134982","logFC":"0.577820555907759","CI_L":"0.438366899511467","CI_R":"0.717274212304051","AveExpr":"3.54986284209441","adj_P_Val":"1.53086261424769e-11","hgnc_symbol":"APC","neg_log10_adj_P_Val":"10.815063782881992","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000173230","logFC":"0.592432054160545","CI_L":"0.449316388550071","CI_R":"0.735547719771019","AveExpr":"3.07593809963738","adj_P_Val":"1.53086261424769e-11","hgnc_symbol":"GOLGB1","neg_log10_adj_P_Val":"10.815063782881992","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000115204","logFC":"-0.342622319323285","CI_L":"-0.425714738311473","CI_R":"-0.259529900335098","AveExpr":"2.26343365044208","adj_P_Val":"1.53514837179551e-11","hgnc_symbol":"MPV17","neg_log10_adj_P_Val":"10.813849643679925","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000163867","logFC":"-0.317685810586068","CI_L":"-0.396521728903328","CI_R":"-0.238849892268809","AveExpr":"0.440403572654362","adj_P_Val":"4.806114720543e-11","hgnc_symbol":"ZMYM6","neg_log10_adj_P_Val":"10.31820586692701","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000058272","logFC":"0.369874278096779","CI_L":"0.276308624336157","CI_R":"0.4634399318574","AveExpr":"2.21662057304288","adj_P_Val":"1.01147332371646e-10","hgnc_symbol":"PPP1R12A","neg_log10_adj_P_Val":"9.995045566690026","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000085224","logFC":"0.376934407665774","CI_L":"0.281517554302471","CI_R":"0.472351261029076","AveExpr":"2.75172534272356","adj_P_Val":"1.01147332371646e-10","hgnc_symbol":"ATRX","neg_log10_adj_P_Val":"9.995045566690026","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000100814","logFC":"-0.53997463227683","CI_L":"-0.676796515202653","CI_R":"-0.403152749351007","AveExpr":"2.54387860674144","adj_P_Val":"1.01147332371646e-10","hgnc_symbol":"CCNB1IP1","neg_log10_adj_P_Val":"9.995045566690026","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000137040","logFC":"0.511510216388615","CI_L":"0.381429686183409","CI_R":"0.64159074659382","AveExpr":"3.00720679163973","adj_P_Val":"1.10095787422154e-10","hgnc_symbol":"RANBP6","neg_log10_adj_P_Val":"9.958229298051986","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000093167","logFC":"-0.533429896636647","CI_L":"-0.66931509372377","CI_R":"-0.397544699549524","AveExpr":"2.16773217567258","adj_P_Val":"1.10353563213893e-10","hgnc_symbol":"LRRFIP2","neg_log10_adj_P_Val":"9.957213639311135","tissue_study_pretty":"CBE (MAYO)","comparison_model_sex_pretty":"AD-CONTROL Study-specific Diagnosis (ALL)"}
            ];

            // For example, to define custom handlers for some paths:
            app.get('/api/genes', function(req, res) {
                res.json(data);
            });

            // For example, to define custom handlers for some paths:
            app.get('/api/genes/page', function (req, res) {
                console.log(req.query);
                res.json(data);
            });
        }
    },

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });
}
