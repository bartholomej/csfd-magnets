const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (options) {
  return {
    entry: {
      app: './src/app.js'
    },
    output: {
      publicPath: ".",
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].js',
      libraryTarget: "umd"
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }]
    },
    plugins: [
      new webpack.ProvidePlugin({
        Promise: 'es6-promise',
        fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
      }),
      new CopyWebpackPlugin([
        { from: 'src/manifest.json', flatten: true },
        { from: 'src/app.css' },
        { from: 'src/_locales/', to: '_locales' },
        { from: 'src/images/', to: 'images' }
      ])
    ]
  }
}

