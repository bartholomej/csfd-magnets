/**
 * @class Utils
 *
 * Class for utilities
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

export const isProd = process.env.NODE_ENV === 'production';
export const isDev = process.env.NODE_ENV === 'development';

export const isOldCsfd = (): boolean => {
  const newBoxrating = document.querySelector('.box-rating-container');
  const newMovieProfile = document.querySelector('.main-movie-profile');
  return !(!!newBoxrating && !!newMovieProfile);
};

export const altTitlesPattern = [
  'USA',
  'angličtina',
  'anglický',
  '"Velká Británie"',
  'Austrálie',
  '"Nový Zéland"'
];
