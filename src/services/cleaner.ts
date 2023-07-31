import Accent from './accent';
import Store from './store';

/**
 * @class Cleaner
 *
 * Class for parsing, trimming and cleaning titles
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

export default class Cleaner {
  private yearPattern: RegExp;
  private numSeriesPattern: RegExp;
  private seasonTitlePattern: RegExp;
  private episodePattern: RegExp;

  constructor(private accent: Accent, private store: Store) {
    this.yearPattern = /\([0-9]{4}\)/gi;
    this.numSeriesPattern = /- Série\s*(\d+)/;
    this.seasonTitlePattern = /\(série\)/;
    this.episodePattern = /\(S?0*(\d+)?[xE]0*(\d+)\)/;
  }

  /**
   * Clean page title and prepare for search
   */
  public cleanTitle(title: string): string {
    let filmTitle = title.split(' / ').pop().split('|').shift().trim();

    filmTitle = this.addYear(filmTitle);
    filmTitle = this.prepareSeasons(filmTitle);
    filmTitle = this.prepareEpisode(filmTitle);

    let noAccentTitle = this.accent.removeAccents(filmTitle);

    // Remove non-alhpanumeric
    return noAccentTitle
      .replace(/[^a-zA-Z0-9\x20]/g, '')
      .toLowerCase()
      .trim();
  }

  /**
   * Prepare search query for TV Series
   */
  private addYear(filmTitle: string): string {
    const filmType = this.store.filmType;
    if (
      filmType !== 'TV seriál' &&
      filmType !== 'epizoda' &&
      filmType !== 'episode' &&
      filmType !== 'série'
    ) {
      return filmTitle + ' ' + (this.store.year || '');
    } else {
      return filmTitle;
    }
  }

  /**
   * Prepare search query for Seasons
   */
  private prepareSeasons(title: string): string {
    const filmType = this.store.filmType;
    if (filmType === 'série') {
      const numSeries = title.match(this.numSeriesPattern);

      if (numSeries && numSeries.length) {
        // Add info about series (add leading zero)
        title += `season ${numSeries[1].replace(/^\d$/, '0$&')}`;
      }
      // Clean unused strings
      title = title
        .replace(this.yearPattern, '')
        .replace(this.numSeriesPattern, '')
        .replace(this.seasonTitlePattern, '');
    }
    return title;
  }

  /**
   * Prepare search query for Episodes
   */
  private prepareEpisode(title: string): string {
    const filmType = this.store.filmType;
    if (filmType === 'epizoda' || filmType === 'episode') {
      const titleSplit = title.split('-');
      const episodeArray = title.match(this.episodePattern);

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
}
