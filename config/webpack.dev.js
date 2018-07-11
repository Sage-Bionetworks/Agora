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

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  const ENV = (process.env.mode = process.env.ENV = process.env.NODE_ENV = 'development');
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 3000;
  const Docker = process.env.Docker || false;
  const Analyzer = process.env.Analyzer || false;

  const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: helpers.hasProcessFlag('hot'),
    PUBLIC: process.env.PUBLIC_DEV || HOST + ':' + PORT,
    Docker: Docker,
    Analyzer: Analyzer
  });

  return webpackMerge(commonConfig({ env: ENV, metadata: METADATA  }), {
    mode: 'development',
    devtool: 'inline-source-map',

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
      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        debug: true,
        options: {}
      })
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
                {"ensembl_gene_id":"ENSG00000078043","logfc":"-0.44554823899289703","ci_l":"-0.547432004490222","ci_r":"-0.343664473495572","aveexpr":"1.33209693699624","adj_p_val":"2.05317478168412e-12","hgnc_symbol":"PIAS2","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000205302","logfc":"0.453451195106394","ci_l":"0.345258480019521","ci_r":"0.561643910193267","aveexpr":"2.93619931112318","adj_p_val":"1.4453530922673e-11","hgnc_symbol":"SNX2","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000134982","logfc":"0.577820555907759","ci_l":"0.438366899511467","ci_r":"0.717274212304051","aveexpr":"3.54986284209441","adj_p_val":"1.53086261424769e-11","hgnc_symbol":"APC","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000173230","logfc":"0.592432054160545","ci_l":"0.449316388550071","ci_r":"0.735547719771019","aveexpr":"3.07593809963738","adj_p_val":"1.53086261424769e-11","hgnc_symbol":"GOLGB1","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000115204","logfc":"-0.342622319323285","ci_l":"-0.425714738311473","ci_r":"-0.259529900335098","aveexpr":"2.26343365044208","adj_p_val":"1.53514837179551e-11","hgnc_symbol":"MPV17","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000163867","logfc":"-0.317685810586068","ci_l":"-0.396521728903328","ci_r":"-0.238849892268809","aveexpr":"0.440403572654362","adj_p_val":"4.806114720543e-11","hgnc_symbol":"ZMYM6","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000058272","logfc":"0.369874278096779","ci_l":"0.276308624336157","ci_r":"0.4634399318574","aveexpr":"2.21662057304288","adj_p_val":"1.01147332371646e-10","hgnc_symbol":"PPP1R12A","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000085224","logfc":"0.376934407665774","ci_l":"0.281517554302471","ci_r":"0.472351261029076","aveexpr":"2.75172534272356","adj_p_val":"1.01147332371646e-10","hgnc_symbol":"ATRX","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000100814","logfc":"-0.53997463227683","ci_l":"-0.676796515202653","ci_r":"-0.403152749351007","aveexpr":"2.54387860674144","adj_p_val":"1.01147332371646e-10","hgnc_symbol":"CCNB1IP1","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000137040","logfc":"0.511510216388615","ci_l":"0.381429686183409","ci_r":"0.64159074659382","aveexpr":"3.00720679163973","adj_p_val":"1.10095787422154e-10","hgnc_symbol":"RANBP6","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"},
                {"ensembl_gene_id":"ENSG00000093167","logfc":"-0.533429896636647","ci_l":"-0.66931509372377","ci_r":"-0.397544699549524","aveexpr":"2.16773217567258","adj_p_val":"1.10353563213893e-10","hgnc_symbol":"LRRFIP2","tissue":"CBE","study":"MayoRNAseq","model":"Diagnosis (ALL)"}
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
      setImmediate: false,
      fs: 'empty'
    }

  });
}
