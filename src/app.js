import Alternatives from './js/alternatives'
import Renderer from './js/renderer'
import Cleaner from './js/cleaner'

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
  constructor() {
    this.alternative = new Alternatives();
    this.cleaner = new Cleaner();
    this.renderer = new Renderer();
    this.attempt = 0;

    this.searchUrl = (movieUrl) => (
      `https://thepiratebay.org/search/${encodeURIComponent(movieUrl)}/0/0/0`
    );

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
  searchMovie(title) {
    this.movieTitle = this.cleaner.cleanTitle(title);
    this.searchUrl = this.buildSearchUrl(this.movieTitle);
    this.wrapper = this.renderer.prepareBox(this.placingNode[0], this.movieTitle, this.searchUrl);
    this.getItems(this.searchUrl);
  }

  /**
   * Assemble search url
   */
  buildSearchUrl(movieTitle) {
    var searchUrl = this.searchUrl(movieTitle);
    return searchUrl;
  }

  /**
   * Fetch items and create virtual node
   */
  getItems(searchUrl) {
    fetch(searchUrl).then(res => {
      if (res.ok) {
        return res.text();
      }
      this.removeLoader();
      this.setNotFound();
      throw new Error('Can\'t connect to movie provider :(');
    }).then(html => {
      // Create virtual node for DOM traversing
      let virtualNode = document.createElement('html');
      virtualNode.innerHTML = html;

      // Get first five search results
      let items = [].slice.call(virtualNode.querySelectorAll('#searchResult tbody tr')).slice(0, 5);

      this.removeLoader();

      // Handle items
      this.handleItems(items);
    }).catch(() => {
      this.removeLoader();
      this.setNotFound();
      throw new Error('Can\'t talk with movie provider :(');
    });
  }

  /**
   * Parse and handle data for every loop
   */
  handleItems(items) {
    let list = this.wrapper.getElementsByTagName('ul')[0];
    let sizePattern = /.+Size (.+?),.+/i;

    for (let item of items) {
      let description = item.querySelector('font.detDesc').textContent;
      let data = {
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

  removeLoader() {
    this.wrapper.getElementsByClassName('loader')[0].remove();
  }

  removeBox() {
    this.wrapper.parentNode.removeChild(this.wrapper);
  }

  setNotFound() {
    this.wrapper.querySelector('.not-found').classList.add('active');
  }
}

new CsfdMagnets();
