export interface CharMaps {
  [field: string]: string;
}

export type SupportedBrowser = 'chrome' | 'firefox' | 'opera' | 'edge';

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
