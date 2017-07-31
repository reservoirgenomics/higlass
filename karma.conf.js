var path = require('path');
var webpackConfig = require('./webpack.config.js');
require('babel-polyfill');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/react/dist/react.js',
      'node_modules/react-dom/dist/react-dom.js',
      'node_modules/pixi.js/dist/pixi.js',
      'node_modules/react-bootstrap/dist/react-bootstrap.js',
      'test/**/*.+(js|jsx)',
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'app/styles/*.css'
    ],

    preprocessors: {
      // add webpack as preprocessor
      'app/scripts/**/*.+(js|jsx)': ['webpack', 'sourcemap'],
      'test/**/*.+(js|jsx)': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    },

    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-phantomjs2-launcher'
    ],


    babelPreprocessor: {
      options: {
        presets: ['airbnb']
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
  })

  if(process.env.TRAVIS){
    config.browsers = ['Chrome_travis_ci'];
  }
};
