import CopyPlugin from 'copy-webpack-plugin';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import ZipPlugin from 'zip-webpack-plugin';
import browserConfig from './browsers.manifest.json';
import { commonConfig } from './webpack.common';
import { BrowserProps, WebpackOptions } from './webpack.interface';

const version = process.env.npm_package_version;

export default (options: WebpackOptions) => {
  const target = options.target;

  // Set Chrome as default browser config
  let browserSpecificProperties: BrowserProps = browserConfig.chrome;
  if (target) {
    browserSpecificProperties = browserConfig[target];
  }
  return merge(commonConfig, {
    mode: 'production',
    optimization: {
      minimize: false
    },
    plugins: [
      new webpack.DefinePlugin({
        BROWSER: JSON.stringify(target)
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'src/manifest-common.json',
            to: 'manifest.json',
            transform: (content) => {
              const manifest = JSON.parse(content.toString());
              manifest.version = version;
              const manifestObj = Object.assign(manifest, browserSpecificProperties);
              return JSON.stringify(manifestObj, null, 2);
            }
          }
        ]
      }),
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
        pathMapper: (assetPath) => {
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
          forceZip64Format: false
        },

        // OPTIONAL: see https://github.com/thejoshwolfe/yazl#endoptions-finalsizecallback
        zipOptions: {
          forceZip64Format: false
        }
      })
    ]
  });
};
