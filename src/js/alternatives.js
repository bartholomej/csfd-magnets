/**
 * @class Alternatives
 *
 * Class for finding and handling alternative movie titles
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

'use strict';

export default class Alternatives {
  constructor() {
    this.altTitlesPattern = ['USA', 'anglický'];
    this.altTitles = [];
  }

  /**
   * Get all alt titles
   */
  getAltTitles() {
    let altTitles = [];
    let altTitle;
    for (let value of this.altTitlesPattern) {
      altTitles.push(this.getAltTitle(value));
    }
    return altTitles.filter(title => title);
  }

  /**
   * Get single alt title by country name
   */
  getAltTitle(name) {
    let nextName;
    let countryFlag = document.querySelector(".names img[alt=" + name + "]");
    if (countryFlag) {
      nextName = countryFlag.nextElementSibling;
      if (nextName) {
        return nextName.textContent;
      }
    }
    return false;
  }
}
