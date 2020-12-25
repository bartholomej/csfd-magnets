/**
 * @class Alternatives
 *
 * Class for finding and handling alternative movie titles. [Legacy]
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

import { altTitlesPattern } from './utils';

export default class AlternativesOld {
  /**
   * Get all alt titles
   */
  public getAltTitles(): string[] {
    const altTitles = [];
    for (const value of altTitlesPattern) {
      altTitles.push(this.getAltTitle(value));
    }
    const altTitlesUnique = [...new Set(altTitles)];
    return altTitlesUnique.filter((title) => title);
  }

  /**
   * Get single alt title by country name
   */
  private getAltTitle(name: string): string {
    let nextName;
    const countryFlag = document.querySelector('.names img[alt=' + name + ']');
    if (countryFlag) {
      nextName = countryFlag.nextElementSibling;
      if (nextName) {
        return nextName.textContent;
      }
    }
    return '';
  }
}
