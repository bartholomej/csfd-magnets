import { TPBResult } from 'piratebay-scraper/interfaces';
import { searchUrl } from 'piratebay-scraper/vars';
import Accent from './services/accent';
import Alternatives from './services/alternatives';
import AlternativesOld from './services/alternatives-old';
import Cleaner from './services/cleaner';
import Renderer from './services/renderer';
import { isOldCsfd } from './services/utils';

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

class CsfdMagnets {
  private attempt = 0;
  private placingNode: NodeListOf<HTMLElement>;
  private altTitles: string[];
  private movieTitle: string;
  private wrapper: HTMLDivElement;

  constructor(
    private cleaner: Cleaner,
    private renderer: Renderer,
    private alternative: Alternatives,
    private alternativeOld: AlternativesOld
  ) {
    const url = window.location.href.split('/');
    if (url[2].includes('csfd.cz') && url[3] === 'film') {
      // New or old CSFD
      if (isOldCsfd()) {
        this.placingNode = document.querySelectorAll('#my-rating');
        if (!this.placingNode.length) {
          this.placingNode = document.querySelectorAll('#rating');
        }
      } else {
        this.placingNode = document.querySelectorAll('.box-rating-container');
      }

      const pageTitle = document.title;
      this.searchMovie(pageTitle);
      if (isOldCsfd()) {
        this.altTitles = this.alternativeOld.getAltTitles();
      } else {
        this.altTitles = this.alternative.getAltTitles();
      }
    }
  }

  /**
   * Search movie (trigger)
   */
  private searchMovie(title: string): void {
    this.movieTitle = this.cleaner.cleanTitle(title);
    this.wrapper = this.renderer.prepareBox(
      this.placingNode[0],
      this.movieTitle,
      searchUrl(this.movieTitle)
    );
    this.getItems(this.movieTitle);
  }

  /**
   * Fetch items
   */
  private getItems(searchQuery: string): void {
    chrome.runtime.sendMessage(
      {
        contentScriptQuery: 'fetchData',
        searchQuery
      },
      (response: TPBResult[]) => {
        if (response) {
          this.removeLoader();

          // Handle items
          this.handleItems(response.slice(0, 5));
        } else {
          this.removeLoader();
          this.setNotFound();
          throw new Error("Can't connect to movie provider :(");
        }
      }
    );
  }

  /**
   * Parse and handle data for every loop
   */
  private handleItems(items: TPBResult[]): void {
    const list = this.wrapper.getElementsByTagName('ul')[0];

    for (const item of items) {
      this.renderer.createListItem(item, list);
    }

    // No items found
    if (!items.length) {
      // Give me one more chance to find it for you!
      const altTitle = this.altTitles[this.attempt];
      if (altTitle) {
        // Remove box and do it again
        this.removeBox();

        const year = this.cleaner.getYear() || '';
        this.searchMovie(`${altTitle} (${year})`);
        this.attempt++;
      } else {
        this.setNotFound();
      }
    }
  }

  private removeLoader(): void {
    this.wrapper.getElementsByClassName('loader')[0].remove();
  }

  private removeBox(): void {
    this.wrapper.parentNode.removeChild(this.wrapper);
  }

  private setNotFound(): void {
    this.wrapper.querySelector('.not-found').classList.add('active');
  }
}

export default new CsfdMagnets(
  new Cleaner(new Accent()),
  new Renderer(),
  new Alternatives(),
  new AlternativesOld()
);
