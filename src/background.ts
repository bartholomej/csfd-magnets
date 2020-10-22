import { ThePirateBayScraper } from 'piratebay-scraper';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.contentScriptQuery === 'fetchData') {
    const TPBScraper = new ThePirateBayScraper();
    TPBScraper.search(request.url)
      .then((response) => {
        sendResponse(response);
      })
      .catch((error) => sendResponse(error));
  }
});
