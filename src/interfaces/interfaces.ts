import { browserConfig } from '../../config/browser.config';

export interface CharMaps {
  [field: string]: string;
}

export interface BrowserConfig {
  chrome: BrowserConfigInside;
  opera: BrowserConfigInside;
  edge: BrowserConfigInside;
  firefox: BrowserConfigInside;
}

interface BrowserConfigInside {
  repoUrl: string;
}

export type Browser = keyof typeof browserConfig;
