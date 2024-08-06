/* eslint-disable no-undef */

export const scrapePageContent = () => {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage({ message: "scrape_page" }, (response) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          if (response && response.content) {
            resolve(response.content);
          } else {
            reject(new Error("No content received from content script."));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  