// background.js

console.log("Background script loaded");

// Listener for messages from the React component
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "startScraping") {
    console.log("Received startScraping message");
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.error("No active tab found");
        sendResponse({ status: "No active tab found" });
        return;
      }

      const activeTab = tabs[0];
      if (!activeTab.id) {
        console.error("Active tab has no id");
        sendResponse({ status: "Active tab has no id" });
        return;
      }

      // Inject the content script into the active tab
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ['content.js']
      }, () => {
        console.log('Content script injected');
        sendResponse({ status: "Scraping started" });
      });
    });
    return true; // Keeps the message channel open to send a response asynchronously
  }

  if (request.message === "scrapedHTML") {
    console.log("Received scraped HTML content in background script:");
    sendResponse({ status: "HTML received" });
  }
});
