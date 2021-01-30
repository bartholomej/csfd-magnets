import { piratebay } from 'piratebay-scraper';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.contentScriptQuery === 'fetchData') {
    piratebay
      .search(request.searchQuery)
      .then((response) => {
        if (response) {
          return response;
        }
        throw new Error("Can't connect to movie provider :(");
      })
      .then((response) => {
        sendResponse(response);
      })
      .catch((error) => {
        throw new Error(error);
      });
    return true;
  } else {
    return false;
  }
});
