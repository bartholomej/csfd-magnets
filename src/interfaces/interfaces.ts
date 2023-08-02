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

export type CSFDFilmTypes =
  | 'film'
  | 'TV film'
  | 'TV pořad'
  | 'TV seriál'
  | 'divadelní záznam'
  | 'koncert'
  | 'série'
  | 'series'
  | 'studentský film'
  | 'amatérský film'
  | 'hudební videoklip'
  | 'epizoda'
  | 'episode';

export type CSFDSiteDomain = 'csfd.*' | 'filmbooster.*';
