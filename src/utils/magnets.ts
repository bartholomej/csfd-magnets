import { mount } from 'svelte';
import MagnetsWidget from '../components/MagnetsWidget.svelte';
import { cleanTitle } from './cleaner';
import { getAltTitles } from './alternatives';
import { store } from './store';
import { CSFDFilmTypes } from './interfaces';
import { getAlternativeDomain, getCSFDSiteDomain, getFilmID, isDev } from './helpers';
import { TPBResult } from 'piratebay-scraper/interfaces';
import { searchUrl } from 'piratebay-scraper/vars';

/**
 * Main entry point to run CSFD Magnets
 */
export function runCsfdMagnets(): void {
  const url = window.location.href.split('/');
  store.CSFDSiteDomain = getCSFDSiteDomain(url[2]);

  // Only run on film detail pages
  if (store.CSFDSiteDomain && url[3] === 'film') {
    const placingNode = document.querySelector('.film-rating') as HTMLElement;
    if (!placingNode) {
      console.warn('CSFD Magnets: Target node .film-rating not found.');
      return;
    }

    // Extract page metadata
    extractMetadata(url[4]);

    // Retrieve sorted alternative titles
    const altTitles = getAltTitles();
    const initialTitle = getInitialTitle(altTitles);

    if (initialTitle) {
      searchMovie(initialTitle, altTitles, placingNode);
    }
  }
}

/**
 * Extract and save metadata to the global store
 */
function extractMetadata(filmIdSegment: string): void {
  store.filmId = getFilmID(filmIdSegment);

  const movieInfoNode = document.querySelector('script[type="application/ld+json"]')?.textContent;
  if (movieInfoNode) {
    try {
      const movieInfo = JSON.parse(movieInfoNode);
      store.year = +movieInfo.dateCreated;
    } catch (error) {
      console.error('CSFD Magnets: Error parsing ld+json', error);
    }
  }

  const typeText = document.querySelector('.film-header-name .type')?.textContent;
  store.filmType = (typeText?.replace(/[{()}]/g, '') as CSFDFilmTypes) || 'film';
}

/**
 * Determine the initial film title to search
 */
function getInitialTitle(altTitles: string[]): string {
  switch (store.filmType) {
    case 'episode':
    case 'epizoda':
      return document.title;

    default:
      return store.CSFDSiteDomain === 'csfd.*' ? altTitles[0] || document.title : document.title;
  }
}

/**
 * Clean title, render loader widget, and trigger fetching items
 */
function searchMovie(
  title: string,
  altTitles: string[],
  placingNode: HTMLElement,
  componentInstance?: any,
  container?: HTMLDivElement
): void {
  const movieTitle = cleanTitle(title);

  // Remove the currently searched title from remaining alternatives to avoid duplicate retries
  const remainingAltTitles = altTitles.filter((t) => t.toLowerCase() !== title.toLowerCase());

  let wrapper = container;
  let component = componentInstance;

  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.classList.add('tpb-wrapper');
    placingNode.parentNode?.insertBefore(wrapper, placingNode.nextSibling);

    component = mount(MagnetsWidget, {
      target: wrapper,
      props: {
        movieTitle,
        searchUrl: searchUrl(movieTitle),
        urlPath: window.location.pathname,
        alternativeSiteDomain: getAlternativeDomain(store.CSFDSiteDomain!),
      },
    });
  } else {
    // If we are retrying, we just update the props inside the existing Svelte component!
    component.updateSearch({
      movieTitle,
      searchUrl: searchUrl(movieTitle),
    });
  }

  console.log(`CSFD MAGNETS ${isDev ? 'β' : ''}: Searching for '${movieTitle}'...`);

  // Start background fetch
  fetchData(movieTitle, remainingAltTitles, placingNode, component, wrapper);
}

/**
 * Send message to background script to scrape data
 */
function fetchData(
  searchQuery: string,
  altTitles: string[],
  placingNode: HTMLElement,
  component: any,
  wrapper: HTMLDivElement
): void {
  browser.runtime.sendMessage(
    {
      contentScriptQuery: 'fetchData',
      searchQuery,
    },
    (response: TPBResult[]) => {
      if (response && Array.isArray(response)) {
        handleSearchResponse(response.slice(0, 5), altTitles, placingNode, component, wrapper);
      } else {
        handleSearchError(altTitles, placingNode, component, wrapper);
      }
    }
  );
}

/**
 * Process scraping response
 */
function handleSearchResponse(
  items: TPBResult[],
  altTitles: string[],
  placingNode: HTMLElement,
  component: any,
  wrapper: HTMLDivElement
): void {
  if (items.length > 0) {
    component.setResults(items);
  } else {
    retrySearch(altTitles, placingNode, component, wrapper);
  }
}

/**
 * Handle connection/scraping errors
 */
function handleSearchError(
  altTitles: string[],
  placingNode: HTMLElement,
  component: any,
  wrapper: HTMLDivElement
): void {
  retrySearch(altTitles, placingNode, component, wrapper);
}

/**
 * Attempt to search the next alternative title or show not found
 */
function retrySearch(
  altTitles: string[],
  placingNode: HTMLElement,
  component: any,
  wrapper: HTMLDivElement
): void {
  const nextAltTitle = altTitles[0];
  if (nextAltTitle) {
    searchMovie(nextAltTitle, altTitles, placingNode, component, wrapper);
  } else {
    component.setError();
  }
}
