const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const WebpackChromeReloaderPlugin = require('webpack-chrome-extension-reloader');
const commonConfig = require('./webpack.common.js');

module.exports = function (options) {
  return webpackMerge(commonConfig(), {
    entry: {
      // 'background': './src/background.js',
    },
    plugins: [
      new WebpackChromeReloaderPlugin()
    ]
  })
}

