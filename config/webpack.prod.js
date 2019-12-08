const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const commonConfig = require('./webpack.common.js');
const browserConfig = require('./browsers.manifest.json');
const version = process.env.npm_package_version;

module.exports = options => {
  var target = options.target;
  if (target) {
    var browserSpecificProperties = browserConfig[target];
  }
  return webpackMerge(commonConfig(), {
    mode: 'production',
    optimization: {
      minimize: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        BROWSER: JSON.stringify(target),
      }),
      new CopyWebpackPlugin([
        {
          from: 'src/manifest-common.json',
          to: 'manifest.json',
          transform: (content, path) => {
            var manifest = JSON.parse(content.toString());
            manifest.version = version;
            var manifestObj = Object.assign(
              manifest,
              browserSpecificProperties
            );
            return JSON.stringify(manifestObj, null, 2);
          },
        },
      ]),
      new ZipPlugin({
        // OPTIONAL: defaults to the Webpack output path (above)
        // can be relative (to Webpack output path) or absolute
        path: '../zip',

        // OPTIONAL: defaults to the Webpack output filename (above) or,
        // if not present, the basename of the path
        filename: target + '.zip',

        // OPTIONAL: defaults to 'zip'
        // the file extension to use instead of 'zip'
        extension: 'zip',

        // OPTIONAL: defaults to the empty string
        // the prefix for the files included in the zip file
        pathPrefix: '',

        // OPTIONAL: defaults to the identity function
        // a function mapping asset paths to new paths
        pathMapper: assetPath => {
          // put all pngs in an `images` subdir
          // if (assetPath.endsWith('.png'))
          //   return path.join(path.dirname(assetPath), 'images', path.basename(assetPath));
          return assetPath;
        },

        // OPTIONAL: defaults to including everything
        // can be a string, a RegExp, or an array of strings and RegExps
        // include: [/\.js$/],

        // OPTIONAL: defaults to excluding nothing
        // can be a string, a RegExp, or an array of strings and RegExps
        // if a file matches both include and exclude, exclude takes precedence
        // exclude: [/\.png$/, /\.html$/],

        // yazl Options

        // OPTIONAL: see https://github.com/thejoshwolfe/yazl#addfilerealpath-metadatapath-options
        fileOptions: {
          mtime: new Date(),
          mode: 0o100664,
          compress: true,
          forceZip64Format: false,
        },

        // OPTIONAL: see https://github.com/thejoshwolfe/yazl#endoptions-finalsizecallback
        zipOptions: {
          forceZip64Format: false,
        },
      }),
      // Create build zip with version
      new CopyWebpackPlugin([
        {
          from: './zip/' + target + '.zip',
          to: '../zip/' + target + '-v' + version + '.zip',
        },
      ]),
    ],
  });
};
