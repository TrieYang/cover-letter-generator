// content.js
console.log("Content script loaded");

function scrapeHTML() {
    const htmlContent = document.documentElement.outerHTML;
    console.log("Scraping HTML content..."); // Log to ensure function is called

    // Send the HTML content to the background script
    chrome.runtime.sendMessage({ message: "scrapedHTML", html: htmlContent }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error scraping content:", chrome.runtime.lastError);
        
      } else {
        console.log("Response from background:", response.status);
       
      }
    });
  }
  
  scrapeHTML();
  
  
  