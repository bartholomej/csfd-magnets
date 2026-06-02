import { defineConfig } from 'wxt';

const browserFlagIndex = process.argv.findIndex((arg) => arg === '-b' || arg === '--browser');
const browser = browserFlagIndex !== -1 ? process.argv[browserFlagIndex + 1] : 'chrome';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    name: '__MSG_appName__',
    description: '__MSG_appDesc__',
    short_name: 'csfd-magnets',
    // author: "bartholomej",
    default_locale: 'en',
    permissions: [],
    host_permissions: [
      'https://tpb.party/*',
      'https://pirateproxy.live/*',
      'https://thepiratebay.zone/*',
    ],
  },
  vite: () => ({
    define: {
      BROWSER: JSON.stringify(browser),
    },
  }),
});
