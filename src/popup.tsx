import { useEffect } from "react"

function IndexPopup() {
  useEffect(() => {
    // Open the main tab when the popup is clicked
    chrome.tabs.create({
      url: chrome.runtime.getURL("tabs/main.html")
    })
  }, [])

  return null
}

export default IndexPopup
