/**
 * @class Utils
 *
 * Class for utilities
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

import { CSFDSiteDomain } from '@interfaces/interfaces';

export const isProd = process.env.NODE_ENV === 'production';
export const isDev = process.env.NODE_ENV === 'development';

export const getFilmID = (url: string): number => {
  return +url.split('-')[0];
};

export const getCSFDSiteDomain = (url: string): CSFDSiteDomain | null => {
  if (url.includes('csfd.')) return 'csfd.*';

  if (url.includes('filmbooster.')) return 'filmbooster.*';

  return null;
};

export const altTitlesPattern = [
  'USA',
  'angličtina',
  'anglický',
  '"Velká Británie"',
  'Austrálie',
  '"Nový Zéland"',
  // SK
  '"Veľká Británia"',
  '"Austrália"'
];
