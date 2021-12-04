import ExtensionReloader from '@bartholomej/webpack-extension-reloader';
import CopyPlugin from 'copy-webpack-plugin';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import { commonConfig } from './webpack.common';

const version = process.env.npm_package_version;

// We have to use background script in dev mode.
// Required by WebpackChromeReloaderPlugin (workaround)
const backgroundManifest = {
  background: {
    service_worker: 'background.bundle.js'
  }
};
// tslint:disable:object-literal-sort-keys
export default () => {
  return merge(commonConfig, {
    mode: 'development',
    // Sourcemaps produce eval() scripts in dev bundle which is not allowed in manifest v3
    devtool: false,
    watch: true,
    plugins: [
      // There is an issue with types in ExtensionReloader
      // https://github.com/rubenspgcavalcante/webpack-extension-reloader/issues/107
      new (ExtensionReloader as any)({
        port: 9090, // Which port use to create the server
        reloadPage: true, // Force the reload of the page also
        entries: {
          // The entries used for the content/background scripts
          contentScript: 'app',
          background: 'background'
        }
      }),
      new webpack.DefinePlugin({
        BROWSER: JSON.stringify('chrome')
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'src/manifest-common.json',
            to: 'manifest.json',
            transform: (content) => {
              const contentSecurityPolicy = "script-src 'self' 'unsafe-eval'; object-src 'self'";
              const manifest = JSON.parse(content.toString());
              manifest.version = version;
              // Inject security policy only for dev
              // because Chrome reloader is using eval
              // manifest.content_security_policy = {}
              // manifest.content_security_policy.extension_pages = contentSecurityPolicy;
              const manifestObj = Object.assign(manifest, backgroundManifest);
              return JSON.stringify(manifestObj, null, 2);
            }
          }
        ]
      })
    ]
  });
};
