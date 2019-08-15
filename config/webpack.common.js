const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const version = process.env.npm_package_version;

module.exports = function (options) {
  return {
    entry: {
      app: './src/app.js',
      background: './src/background.js',
    },
    output: {
      publicPath: ".",
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].bundle.js',
      libraryTarget: "umd"
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      }]
    },
    plugins: [
      // new webpack.ProvidePlugin({
      //   Promise: 'es6-promise',
      //   fetch: 'exports-loader?self.fetch!whatwg-fetch/dist/fetch.umd',
      // }),
      new CopyWebpackPlugin([
        // {
        //   from: 'src/manifest-common.json',
        //   to: 'manifest.json',
        //   transform: function (content, path) {
        //     var manifest = JSON.parse(content.toString());
        //     manifest.version = version;
        //     return JSON.stringify(manifest, null, 2);
        //   }
        // },
        { from: 'src/app.css' },
        { from: 'src/_locales/', to: '_locales' },
        { from: 'src/images/', to: 'images' }
      ])
    ]
  }
}

