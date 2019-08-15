import Alternatives from './services/alternatives'
import Renderer from './services/renderer'
import Cleaner from './services/cleaner'

import { MagnetData } from './interfaces/interfaces'
import Accent from './services/accent';
/**
 * @class CsfdMagnets
 *
 * CSFD Magnets adds a small widget within each
 * movie detail to show information about magnet links...
 * ...or something like that...
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

'use strict';

class CsfdMagnets {
  private attempt = 0;
  private placingNode: NodeListOf<HTMLElement>;
  private altTitles: string[];
  private movieTitle: string;
  private searchUrl: string;
  private wrapper: HTMLDivElement;

  private searchPattern = (movieUrl: string) => (
    `https://thepiratebay.org/search/${encodeURIComponent(movieUrl)}/0/0/0`
  );

  constructor(
    private cleaner: Cleaner,
    private renderer: Renderer,
    private alternative: Alternatives
  ) {
    let url = window.location.href.split('/');
    if (url[2].includes('csfd.cz') && url[3] === 'film') {
      this.placingNode = document.querySelectorAll('#my-rating');
      if (!this.placingNode.length) {
        this.placingNode = document.querySelectorAll('#rating')
      }
      let pageTitle = document.title;
      this.searchMovie(pageTitle);
      this.altTitles = this.alternative.getAltTitles();
    }
  }

  /**
   * Search movie (trigger)
   */
  private searchMovie(title: string): void {
    this.movieTitle = this.cleaner.cleanTitle(title);
    this.searchUrl = this.buildSearchUrl(this.movieTitle);
    this.wrapper = this.renderer.prepareBox(this.placingNode[0], this.movieTitle, this.searchUrl);
    this.getItems(this.searchUrl);
  }

  /**
   * Assemble search url
   */
  private buildSearchUrl(movieTitle: string): string {
    var searchUrl = this.searchPattern(movieTitle);
    return searchUrl;
  }

  /**
   * Fetch items and create virtual node
   */
  private getItems(url: string): void {
    chrome.runtime.sendMessage({
      contentScriptQuery: 'fetchData',
      url
    }, (response: string) => {
      if (response) {
        // Create virtual node for DOM traversing
        let virtualNode = document.createElement('html');

        virtualNode.innerHTML = DOMPurify.sanitize(response);

        // Get first five search results
        let items: HTMLTableRowElement[] = [].slice.call(virtualNode.querySelectorAll('#searchResult tbody tr')).slice(0, 5);

        this.removeLoader();

        // Handle items
        this.handleItems(items);
      } else {
        this.removeLoader();
        this.setNotFound();
        throw new Error('Can\'t connect to movie provider :(');
      }
    });
  }

  /**
   * Parse and handle data for every loop
   */
  private handleItems(items: HTMLTableRowElement[] | any[]): void {
    let list = this.wrapper.getElementsByTagName('ul')[0];
    let sizePattern = /.+Size (.+?),.+/i;

    for (let item of items) {
      let description: string = item.querySelector('font.detDesc').textContent;
      let data: MagnetData = {
        description: description,
        size: sizePattern.exec(description)[1],
        seedLeech: [].slice.call(item.querySelectorAll('td[align="right"]')),
        linkName: item.querySelector('a.detLink').textContent,
        link: item.querySelector('a[title="Download this torrent using magnet"]').href
      }
      this.renderer.createListItem(data, list);
    }

    // No items found
    if (!items.length) {
      // Give me one more chance to find it for you!
      let altTitle = this.altTitles[this.attempt];
      if (altTitle) {
        // Remove box and do it again
        this.removeBox();

        let year = this.cleaner.getYear() || '';
        this.searchMovie(`${altTitle} ${year}`);
        this.attempt++;
      } else {
        this.setNotFound();
      }
    }
  }

  private removeLoader() {
    this.wrapper.getElementsByClassName('loader')[0].remove();
  }

  private removeBox() {
    this.wrapper.parentNode.removeChild(this.wrapper);
  }

  private setNotFound() {
    this.wrapper.querySelector('.not-found').classList.add('active');
  }
}

new CsfdMagnets(
  new Cleaner(new Accent()),
  new Renderer(),
  new Alternatives()
);
