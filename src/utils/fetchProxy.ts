export async function fetchThroughBackground(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "FETCH_URL", url }, (response) => {
      if (response.success) {
        resolve(response.data)
      } else {
        reject(new Error(response.error))
      }
    })
  })
}
