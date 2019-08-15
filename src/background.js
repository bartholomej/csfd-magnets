chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.contentScriptQuery == 'fetchData') {
    fetch(request.url).then(res => {
      if (res.ok) {
        return res.text();
      }
      throw new Error('Can\'t connect to movie provider :(');
    })
      .then(html => html)
      .then(response => {
        sendResponse(response);
      })
      .catch(error => sendResponse(error))
    return true;
  }
});
