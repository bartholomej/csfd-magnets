/**
 * @class Alternatives
 *
 * Class for finding and handling alternative movie titles. [Legacy]
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

export default class AlternativesOld {
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
   * Get single alt title by country name
   */
  public getAltTitle(name: string): string {
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
