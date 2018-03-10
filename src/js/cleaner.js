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
  constructor() {
    this.yearPattern = /\([0-9]{4}\)/ig;
    this.numSeriesPattern = /Série\s*(\d+)/;
    this.episodePattern = /\(S?0*(\d+)?[xE]0*(\d+)\)/;
    this.accent = new Accent();
  }
  /**
   * Clean page title and prepare for search
   */
  cleanTitle(pageTitle) {
    let pTitle = pageTitle.split(' / ').pop().split('|').shift().trim();

    pTitle = this.prepareTvSeries(pTitle);
    pTitle = this.prepareSeasons(pTitle);
    pTitle = this.prepareEpisode(pTitle);

    // set year for alternative titles eventually
    this.setYear(pTitle.match(this.yearPattern));

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

      // Remove non-alhpanumerics
      return noAccentTitle.replace(/[^a-zA-Z0-9\x20]/g, '');
  }

  /**
   * Prepare search query for TV Series
   */
  prepareTvSeries(pTitle) {
    if (pTitle.includes('(TV seriál)')) {
      // Remove year
      pTitle = pTitle.replace(this.yearPattern, '');
    }
    return pTitle;
  }

  /**
   * Prepare search query for Seasons
   */
  prepareSeasons(pTitle) {
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
  prepareEpisode(pTitle) {
    if (pTitle.includes('(epizoda)')) {
      let pTitleSplit = pTitle.split('-');
      let episodeArray = pTitle.match(this.episodePattern);

      let seasonSlug = `S`;
      let episodeSlug = `E`;

      // If season doesn't exist, set as season 01
      if (episodeArray[1]) {
        seasonSlug += episodeArray[1].replace(/^\d$/, '0$&');
      } else {
        seasonSlug += `01`;
      }
      episodeSlug += episodeArray[2].replace(/^\d$/, '0$&');

      pTitle = `${pTitleSplit[0]} ${seasonSlug}${episodeSlug}`;
    }
    return pTitle;
  }

  setYear(year) {
    this.year = year;
  }

  getYear() {
    return this.year;
  }
}
