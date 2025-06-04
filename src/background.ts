export {}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FETCH_URL") {
    console.log("ACTION: FETCH_URL\nURL: ", request.url)
    fetch(request.url)
      .then((response) => response.text())
      .then((text) => {
        sendResponse({ success: true, data: text })
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message })
      })
    return true // Required for async sendResponse
  }
})
