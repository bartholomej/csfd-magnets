import { runCsfdMagnets } from '../utils/magnets';

export default defineContentScript({
  matches: ["https://*.csfd.cz/*", "https://*.csfd.sk/*", "https://*.filmbooster.com/*"],
  main() {
    runCsfdMagnets();
  },
});
