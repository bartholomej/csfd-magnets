const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const version = process.env.npm_package_version;

module.exports = function (options) {
  return {
    entry: {
      app: ['./src/app.ts', './src/app.scss'],
      background: './src/background.ts'
    },
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    output: {
      publicPath: '.',
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].[contenthash].bundle.js',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader'
        },
        {
          test: /\.s?css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }
      ]
    },
    plugins: [
      // new webpack.ProvidePlugin({
      //   Promise: 'es6-promise',
      //   fetch: 'exports-loader?self.fetch!whatwg-fetch/dist/fetch.umd',
      // }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
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
        { from: 'src/_locales/', to: '_locales' },
        { from: 'src/images/', to: 'images' }
      ])
    ]
  };
};
