import Accent from './accent';
import { isOldCsfd } from './utils';
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
  private year: number = 0;

  constructor(private accent: Accent) {
    this.yearPattern = /\([0-9]{4}\)/gi;
    this.numSeriesPattern = /Season\s*(\d+)/;
    this.seasonTitlePattern = /\(série\)/;
    this.episodePattern = /\(S?0*(\d+)?[xE]0*(\d+)\)/;
  }

  /**
   * Clean page title and prepare for search
   */
  public cleanTitle(pageTitle: string, filmType: string): string {
    let pTitle = pageTitle.split(' / ').pop().split('|').shift().trim();

    if (isOldCsfd()) {
      pTitle = this.prepareTvSeriesOld(pTitle);
      pTitle = this.prepareSeasonsOld(pTitle);
      pTitle = this.prepareEpisodeOld(pTitle);
    } else {
      pTitle = this.prepareTvSeries(pTitle, filmType);
      pTitle = this.prepareSeasons(pTitle, filmType);
      pTitle = this.prepareEpisode(pTitle, filmType);
    }
    // if (filmType) {

    // }
    // set year for alternative titles eventually
    const yearArray = pTitle.match(this.yearPattern);
    if (yearArray && yearArray.length) {
      this.setYear(+yearArray[0].replace(/[()]/g, ''));
    }

    const trimmedTitle = pTitle
      .replace(/\(TV film\)/gi, '')
      .replace(/\(TV pořad\)/gi, '')
      .replace(/\(TV seriál\)/gi, '')
      .replace(/\(divadelní záznam\)/gi, '')
      .replace(/\(koncert\)/gi, '')
      .replace(/\(série\)/gi, '')
      .replace(/\(epizoda\)/gi, '')
      .replace(/\(studentský film\)/gi, '')
      .replace(/\(amatérský film\)/gi, '')
      .replace(/\(hudební videoklip\)/gi, '')
      .replace(/\(epizoda\)/gi, '')
      .toLowerCase()
      .trim();

    const noAccentTitle = this.accent.removeAccents(trimmedTitle);

    // Remove non-alhpanumeric
    return noAccentTitle.replace(/[^a-zA-Z0-9\x20]/g, '');
  }

  /**
   * Prepare search query for TV Series
   */
  private prepareTvSeries(pTitle: string, filmType: string): string {
    if (
      filmType.includes('(TV seriál)') ||
      filmType.includes('(epizoda)') ||
      filmType.includes('(série)')
    ) {
      // Remove year
      pTitle = pTitle.replace(this.yearPattern, '');
    }
    return pTitle;
  }

  /**
   * Prepare search query for Seasons
   */
  private prepareSeasons(pTitle: string, filmType: string): string {
    if (filmType.includes('(série)')) {
      const numSeries = pTitle.match(this.numSeriesPattern);
      if (numSeries && numSeries.length) {
        // Add info about series (add leading zero)
        pTitle += `season ${numSeries[1].replace(/^\d$/, '0$&')}`;
      }
      // Clean unused strings
      pTitle = pTitle
        .replace(this.yearPattern, '')
        .replace(this.numSeriesPattern, '')
        .replace(this.seasonTitlePattern, '');
    }
    return pTitle;
  }

  /**
   * Prepare search query for Episodes
   */
  private prepareEpisode(pTitle: string, filmType: string): string {
    if (filmType.includes('(epizoda)')) {
      const pTitleSplit = pTitle.split('-');
      const episodeArray = pTitle.match(this.episodePattern);

      let seasonSlug = 'S';
      let episodeSlug = 'E';

      // If season doesn't exist, set as season 01
      if (episodeArray) {
        seasonSlug += episodeArray[1] ? episodeArray[1].replace(/^\d$/, '0$&') : '01';
        episodeSlug += episodeArray[2].replace(/^\d$/, '0$&');
      }

      pTitle = `${pTitleSplit[0]} ${seasonSlug}${episodeSlug}`;
    }
    return pTitle;
  }

  /**
   * Prepare search query for TV Series
   */
  private prepareTvSeriesOld(pTitle: string): string {
    if (pTitle.includes('(TV seriál)')) {
      // Remove year
      pTitle = pTitle.replace(this.yearPattern, '');
    }
    return pTitle;
  }

  /**
   * Prepare search query for Seasons
   */
  private prepareSeasonsOld(pTitle: string): string {
    if (pTitle.includes('(série)')) {
      const numSeries = pTitle.match(this.numSeriesPattern);
      if (numSeries && numSeries.length) {
        // Add info about series (add leading zero)
        pTitle += `season ${numSeries[1].replace(/^\d$/, '0$&')}`;
      }
      // Clean unused strings
      pTitle = pTitle
        .replace(this.yearPattern, '')
        .replace(this.numSeriesPattern, '')
        .replace(this.seasonTitlePattern, '');
    }
    return pTitle;
  }

  /**
   * Prepare search query for Episodes
   */
  private prepareEpisodeOld(pTitle: string): string {
    if (pTitle.includes('(epizoda)')) {
      const pTitleSplit = pTitle.split('-');
      const episodeArray = pTitle.match(this.episodePattern);

      let seasonSlug = 'S';
      let episodeSlug = 'E';

      // If season doesn't exist, set as season 01
      if (episodeArray) {
        seasonSlug += episodeArray[1] ? episodeArray[1].replace(/^\d$/, '0$&') : '01';
        episodeSlug += episodeArray[2].replace(/^\d$/, '0$&');
      }

      pTitle = `${pTitleSplit[0]} ${seasonSlug}${episodeSlug}`;
    }
    return pTitle;
  }

  private setYear(year: number): void {
    this.year = year;
  }

  public getYear(): number {
    return this.year;
  }
}
