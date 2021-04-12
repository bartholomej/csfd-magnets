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

    // Usually original title
    altTitles.push(this.firstTitleInTheList);

    for (const value of altTitlesPattern) {
      altTitles.push(this.getAltTitle(value));
    }

    // Make it unique and remove blank values
    const altTitlesUnique = [...new Set(altTitles)];
    return altTitlesUnique.filter((title) => title);
  }

  /**
   * Get single alt title by country name
   */
  private getAltTitle(name: string): string {
    const countryFlag = document.querySelector('.film-names img[alt=' + name + ']');
    return this.cleanTitle(countryFlag);
  }

  /**
   * Get first alternative title in the list which is the most probably original name
   */
  private get firstTitleInTheList(): string {
    const firstName = document.querySelector('.film-names img:first-child');
    return this.cleanTitle(firstName);
  }

  /**
   * Clean flag title
   */
  private cleanTitle(title: Element): string {
    return title?.parentElement.textContent.split('(')[0].trim();
  }
}
