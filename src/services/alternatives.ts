/**
 * @class Alternatives
 *
 * Class for finding and handling alternative movie titles
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

import { altTitlesPattern } from './utils';

export default class Alternatives {
  /**
   * Get all alt titles
   */
  public getAltTitles(): string[] {
    const altTitles = [];
    for (const value of altTitlesPattern) {
      altTitles.push(this.getAltTitle(value));
    }
    return altTitles.filter((title) => title);
  }

  /**
   * Get single alt title by country name
   */
  public getAltTitle(name: string): string {
    let nextName: string;
    const countryFlag = document.querySelector('.film-names img[alt=' + name + ']');
    if (countryFlag) {
      nextName = countryFlag.parentElement.textContent.split('(')[0].trim();
      if (nextName) {
        return nextName;
      }
    }
    return '';
  }
}
