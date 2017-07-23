const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const commonConfig = require('./webpack.common.js');
const browserConfig = require('./browsers.config.json');
const version = process.env.npm_package_version;

module.exports = function (options) {
  var target = options.target;
  if (target) {
    var browserSpecificProperties = browserConfig[target];
  }
  return webpackMerge(commonConfig(), {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: false
      }),
      new CopyWebpackPlugin([
        {
          from: 'src/manifest-common.json',
          to: 'manifest.json',
          transform: function (content, path) {
            var manifest = JSON.parse(content.toString());
            manifest.version = version;
            var manifestObj = Object.assign(manifest, browserSpecificProperties);
            return JSON.stringify(manifestObj, null, 2);
          }
        }
      ])
    ]
  })
}

