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
    this.attempt = 0;

    this.alternative = new Alternatives();
    this.cleaner = new Cleaner();
    this.renderer = new Renderer();

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
    this.wrapper = this.renderer.prepareBox(this.placingNode[0], this.movieTitle);
    this.getItems(this.searchUrl);
  }

  /**
   * Assemble search url
   */
  buildSearchUrl(movieTitle) {
    var searchUrl = 'https://thepiratebay.org/search/' + encodeURIComponent(movieTitle) + '/0/99/0';
    return searchUrl;
  }

  /**
   * Fetch items and create virtual node
   */
  getItems(searchUrl) {
    fetch(searchUrl).then(res => {
      return res.text();
    }).then(html => {
      // Create virtual node for DOM traversing
      let virtualNode = document.createElement('html');
      virtualNode.innerHTML = html;

      // Get first five search results
      let items = [].slice.call(virtualNode.querySelectorAll('#searchResult tbody tr')).slice(0, 5);

      // Remove loader
      this.wrapper.getElementsByClassName('loader')[0].remove();

      // Handle items
      this.handleItems(this.wrapper, items);
    });
  }

  /**
   * Parse and handle data for every loop
   */
  handleItems(wrapper, items) {
    let list = wrapper.getElementsByTagName('ul')[0];
    let sizePattern = /.+Size (.+?),.+/i;
    wrapper.querySelector('.search-more').href = this.searchUrl;

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
        this.wrapper.parentNode.removeChild(this.wrapper);

        let year = this.cleaner.getYear() || '';
        this.searchMovie(`${altTitle} ${year}`);
        this.attempt++;
      } else {
        wrapper.querySelector('.not-found').classList.add('active');
      }
    }
  }
}

new CsfdMagnets();
