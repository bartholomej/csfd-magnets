import { piratebay } from 'piratebay-scraper';
import { TPBProvider } from 'piratebay-scraper/interfaces';

const PROVIDERS = ['https://tpb.party', 'https://thepiratebay.zone/', 'https://pirateproxy.live/'];

let index = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.contentScriptQuery === 'fetchData') {
    getData(request, sender, sendResponse, PROVIDERS[index]);
    return true;
  } else {
    return false;
  }
});

const getData = (request: any, sender: any, sendResponse: any, provider: TPBProvider) => {
  piratebay
    .search(request.searchQuery, provider)
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
      index = index + 1;
      getData(request, sender, sendResponse, PROVIDERS[index]);
    });
};
