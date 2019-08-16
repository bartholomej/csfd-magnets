const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtensionReloader  = require('webpack-extension-reloader');
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
    watch: true,
    entry: {
      app: './src/app.ts',
      background: './src/background.ts',
    },
    plugins: [
      new ExtensionReloader({
        port: 9090, // Which port use to create the server
        reloadPage: true, // Force the reload of the page also
        entries: { //The entries used for the content/background scripts
          contentScript: 'app',
          background: 'background'
        }
      }),
      new webpack.DefinePlugin({
        'BROWSER': JSON.stringify('chrome')
      }),
      new CopyWebpackPlugin([
        {
          from: 'src/manifest-common.json',
          to: 'manifest.json',
          transform: function (content, path) {
            const contentSecurityPolicy = "script-src 'self' 'unsafe-eval'; object-src 'self'";
            var manifest = JSON.parse(content.toString());
            manifest.version = version;
            // Inject security policy only for dev
            // because Chrome reloader is using eval
            manifest['content_security_policy'] = contentSecurityPolicy;
            var manifestObj = Object.assign(manifest, backgroundManifest);
            return JSON.stringify(manifestObj, null, 2);
          }
        }
      ])
    ]
  })
}

