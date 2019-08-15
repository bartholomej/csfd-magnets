import Accent from './accent';
/**
 * @class Cleaner
 *
 * Class for parsing, trimming and cleaning titles
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

'use strict';

export default class Cleaner {
  private yearPattern: RegExp;
  private numSeriesPattern: RegExp;
  private episodePattern: RegExp;
  private year: number = 0;

  constructor(private accent: Accent) {
    this.yearPattern = /\([0-9]{4}\)/ig;
    this.numSeriesPattern = /Série\s*(\d+)/;
    this.episodePattern = /\(S?0*(\d+)?[xE]0*(\d+)\)/;
  }
  /**
   * Clean page title and prepare for search
   */
  public cleanTitle(pageTitle: string): string {
    let pTitle = pageTitle.split(' / ').pop().split('|').shift().trim();

    pTitle = this.prepareTvSeries(pTitle);
    pTitle = this.prepareSeasons(pTitle);
    pTitle = this.prepareEpisode(pTitle);

    // set year for alternative titles eventually
    this.setYear(+pTitle.match(this.yearPattern)[0]);

    let trimmedTitle = pTitle.replace(/\(TV film\)/ig, '')
      .replace(/\(TV pořad\)/ig, '')
      .replace(/\(TV seriál\)/ig, '')
      .replace(/\(divadelní záznam\)/ig, '')
      .replace(/\(koncert\)/ig, '')
      .replace(/\(série\)/ig, '')
      .replace(/\(epizoda\)/ig, '')
      .replace(/\(studentský film\)/ig, '')
      .replace(/\(amatérský film\)/ig, '')
      .replace(/\(hudební videoklip\)/ig, '')
      .replace(/\(epizoda\)/ig, '')
      .toLowerCase()
      .trim();

      let noAccentTitle = this.accent.removeAccents(trimmedTitle);

      // Remove non-alhpanumeric
      return noAccentTitle.replace(/[^a-zA-Z0-9\x20]/g, '');
  }

  /**
   * Prepare search query for TV Series
   */
  private prepareTvSeries(pTitle: string) {
    if (pTitle.includes('(TV seriál)')) {
      // Remove year
      pTitle = pTitle.replace(this.yearPattern, '');
    }
    return pTitle;
  }

  /**
   * Prepare search query for Seasons
   */
  private prepareSeasons(pTitle: string) {
    if (pTitle.includes('(série)')) {
      let numSeries = pTitle.match(this.numSeriesPattern);

      // Add info about series (add leading zero)
      pTitle += `season ${numSeries[1].replace(/^\d$/, '0$&')}`;

      // Clean unused string
      pTitle = pTitle.replace(this.yearPattern, '')
        .replace(this.numSeriesPattern, '');
    }
    return pTitle;
  }

  /**
   * Prepare search query for Episodes
   */
  private prepareEpisode(pTitle: string) {
    if (pTitle.includes('(epizoda)')) {
      let pTitleSplit = pTitle.split('-');
      let episodeArray = pTitle.match(this.episodePattern);

      let seasonSlug = `S`;
      let episodeSlug = `E`;

      // If season doesn't exist, set as season 01
      if (episodeArray) {
        seasonSlug += episodeArray[1] ? episodeArray[1].replace(/^\d$/, '0$&') : `01`;
        episodeSlug += episodeArray[2].replace(/^\d$/, '0$&');
      }

      pTitle = `${pTitleSplit[0]} ${seasonSlug}${episodeSlug}`;
    }
    return pTitle;
  }

  private setYear(year: number) {
    this.year = year;
  }

  public getYear(): number {
    return this.year;
  }
}
