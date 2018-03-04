const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const WebpackChromeReloaderPlugin = require('webpack-chrome-extension-reloader');
const commonConfig = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const version = process.env.npm_package_version;

// We have to use background script in dev mode. Required by WebpackChromeReloaderPlugin (workaround)
var backgroundManifest = {
  background: {
    scripts: [
      "background.bundle.js"
    ]
  }
};

module.exports = function (options) {
  return webpackMerge(commonConfig(), {
    mode: 'development',
    entry: {
      'background': './src/background.js',
    },
    plugins: [
      new WebpackChromeReloaderPlugin(),
      new CopyWebpackPlugin([
        {
          from: 'src/manifest-common.json',
          to: 'manifest.json',
          transform: function (content, path) {
            var manifest = JSON.parse(content.toString());
            manifest.version = version;
            var manifestObj = Object.assign(manifest, backgroundManifest);
            return JSON.stringify(manifest, null, 2);
          }
        }
      ])
    ]
  })
}

