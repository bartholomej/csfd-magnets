import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

// tslint:disable:object-literal-sort-keys
export const commonConfig: webpack.Configuration = {
  entry: {
    app: ['./src/app.ts', './src/app.css'],
    background: './src/background.ts'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  output: {
    publicPath: '.',
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
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
    new CopyPlugin({
      patterns: [
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
      ]
    })
  ]
};
