/**
 * @class Alternatives
 *
 * Class for finding and handling alternative movie titles
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

export default class Alternatives {
  private altTitlesPattern = ['USA', 'anglický'];

  /**
   * Get all alt titles
   */
  public getAltTitles(): string[] {
    const altTitles = [];
    for (const value of this.altTitlesPattern) {
      altTitles.push(this.getAltTitle(value));
    }
    return altTitles.filter((title) => title);
  }

  /**
   * Get all alt titles
   */
  public getAltTitlesOld(): string[] {
    console.warn('old');
    const altTitles = [];
    for (const value of this.altTitlesPattern) {
      altTitles.push(this.getAltTitleOld(value));
    }
    return altTitles.filter((title) => title);
  }

  /**
   * Get single alt title by country name
   */
  public getAltTitle(name: string): string {
    let nextName;
    const countryFlag = document.querySelector('.film-names img[alt=' + name + ']');
    if (countryFlag) {
      nextName = countryFlag.parentElement.textContent.split('(')[0].trim();
      if (nextName) {
        return nextName;
      }
    }
    return '';
  }

  /**
   * Get single alt title by country name
   */
  public getAltTitleOld(name: string): string {
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
