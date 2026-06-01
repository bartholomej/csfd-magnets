import { removeAccents } from './accent';
import { store } from './store';

const yearPattern = /\([0-9]{4}\)/gi;
const numSeriesPattern = /- Série\s*(\d+)/;
const seasonTitlePattern = /\(série\)/;
const episodePattern = /\(S?0*(\d+)?[xE]0*(\d+)\)/;

/**
 * Clean page title and prepare for search
 */
export function cleanTitle(title: string): string {
  let filmTitle = title.split(' / ').pop()!.split('|').shift()!.trim();

  filmTitle = addYear(filmTitle);
  filmTitle = prepareSeasons(filmTitle);
  filmTitle = prepareEpisode(filmTitle);

  let noAccentTitle = removeAccents(filmTitle);

  // Remove non-alphanumeric
  return noAccentTitle
    .replace(/[^a-zA-Z0-9\x20]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Prepare search query for TV Series
 */
function addYear(filmTitle: string): string {
  const filmType = store.filmType;
  if (
    filmType !== 'TV seriál' &&
    filmType !== 'epizoda' &&
    filmType !== 'episode' &&
    filmType !== 'série'
  ) {
    return filmTitle + ' ' + (store.year || '');
  } else {
    return filmTitle;
  }
}

/**
 * Prepare search query for Seasons
 */
function prepareSeasons(title: string): string {
  const filmType = store.filmType;
  if (filmType === 'série') {
    const numSeries = title.match(numSeriesPattern);

    if (numSeries && numSeries.length) {
      // Add info about series (add leading zero)
      title += `season ${numSeries[1].replace(/^\d$/, '0$&')}`;
    }
    // Clean unused strings
    title = title
      .replace(yearPattern, '')
      .replace(numSeriesPattern, '')
      .replace(seasonTitlePattern, '');
  }
  return title;
}

/**
 * Prepare search query for Episodes
 */
function prepareEpisode(title: string): string {
  const filmType = store.filmType;
  if (filmType === 'epizoda' || filmType === 'episode') {
    const titleSplit = title.split('-');
    const episodeArray = title.match(episodePattern);

    let seasonSlug = 'S';
    let episodeSlug = 'E';

    // If season doesn't exist, set as season 01
    if (episodeArray) {
      seasonSlug += episodeArray[1] ? episodeArray[1].replace(/^\d$/, '0$&') : '01';
      episodeSlug += episodeArray[2].replace(/^\d$/, '0$&');
    }

    title = `${titleSplit[0]} ${seasonSlug}${episodeSlug}`;
  }
  return title;
}
