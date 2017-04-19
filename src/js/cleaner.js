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

class Cleaner {
  /**
   * Clean page title and prepare for search
   */
  cleanTitle(pageTitle) {
    let pTitle = pageTitle.split('/').pop().split('|').shift().trim();
    let yearPattern = /\([0-9]{4}\)/ig;

    pTitle = this.prepareTvSeries(pTitle, yearPattern);
    pTitle = this.prepareSeasons(pTitle, yearPattern);
    pTitle = this.prepareEpisode(pTitle);

    // set year for alternative titles eventually
    this.setYear(pTitle.match(yearPattern));

    return pTitle.replace(/\(TV film\)/ig, '')
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
      .replace(/\'/ig, '')
      .replace(/\)/ig, '')
      .replace(/\(/ig, '')
      .replace(/\./ig, '')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();
  }

  /**
   * Prepare search query for TV Series
   */
  prepareTvSeries(pTitle, yearPattern) {
    if (pTitle.includes('(TV seriál)')) {
      // Remove year
      pTitle = pTitle.replace(yearPattern, '');
    }
    return pTitle;
  }

  /**
   * Prepare search query for Seasons
   */
  prepareSeasons(pTitle, yearPattern) {
    if (pTitle.includes('(série)')) {
      let numSeriesPattern = /Série\s*(\d+)/;
      let numSeries = pTitle.match(numSeriesPattern);

      // Add info about series (add leading zero)
      pTitle += `season ${numSeries[1].replace(/^\d$/, '0$&')}`;

      // Clean unused string
      pTitle = pTitle.replace(yearPattern, '')
        .replace(numSeriesPattern, '');
    }
    return pTitle;
  }

  /**
   * Prepare search query for Episodes
   */
  prepareEpisode(pTitle) {
    if (pTitle.includes('(epizoda)')) {
      let pTitleSplit = pTitle.split('-');
      let episodePattern = /\(S?0*(\d+)?[xE]0*(\d+)\)/;
      let episodeArray = pTitle.match(episodePattern);

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
