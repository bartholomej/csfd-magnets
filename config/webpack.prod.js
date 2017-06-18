const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = function (options) {
  return webpackMerge(commonConfig(), {
    plugins: [
      new webpack.optimize.UglifyJsPlugin,
    ]
  })
}

