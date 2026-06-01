import { altTitlesPattern } from './helpers';

/**
 * Get all alt titles
 */
export function getAltTitles(): string[] {
  const englishTitles: string[] = [];
  const originalTitles: string[] = [];
  const localTitles: string[] = [];

  const listItems = document.querySelectorAll('.film-names li');

  // In case of old DOM or simple layout where there are no li but just img inside .film-names
  const flags =
    listItems.length > 0
      ? Array.from(listItems)
          .map((li) => li.querySelector('img'))
          .filter((img): img is HTMLImageElement => img !== null)
      : Array.from(document.querySelectorAll('.film-names img'));

  const englishPatterns = altTitlesPattern.map((p) => p.replace(/^["']|["']$/g, ''));

  for (const flag of flags) {
    const title = cleanTitle(flag);
    if (!title) continue;

    const alt = flag.getAttribute('alt') || flag.getAttribute('title') || '';
    const cleanAlt = alt.trim();

    if (cleanAlt === 'Česko' || cleanAlt === 'Slovensko') {
      localTitles.push(title);
    } else if (
      englishPatterns.some((pattern) => cleanAlt.toLowerCase() === pattern.toLowerCase())
    ) {
      englishTitles.push(title);
    } else {
      originalTitles.push(title);
    }
  }

  // Merge in preferred order: English -> Original -> Local
  const mergedTitles = [...englishTitles, ...originalTitles, ...localTitles];

  // Make it unique and remove blank values
  const uniqueTitles = [...new Set(mergedTitles)];
  return uniqueTitles.filter((title) => title);
}

/**
 * Clean flag title
 */
function cleanTitle(title: Element): string {
  if (!title || !title.parentElement) {
    return '';
  }
  const cloned = title.parentElement.cloneNode(true) as HTMLElement;
  cloned.querySelectorAll('span').forEach((span) => span.remove());
  return cloned.textContent!.split('(')[0].trim();
}
