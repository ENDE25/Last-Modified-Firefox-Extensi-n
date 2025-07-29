document.addEventListener('DOMContentLoaded', () => {
  const dateDisplay = document.getElementById('date');
  const refreshButton = document.getElementById('refresh');

  async function getPublicationDate() {
    dateDisplay.textContent = "Looking for publication date...";

    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

      if (!tab.url.startsWith('http')) {
        dateDisplay.textContent = "Not available for this page";
        return;
      }

      const results = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: () => {
          // 1. Check common meta tags
          const metaSelectors = [
            'meta[property="article:published_time"]',
            'meta[name="pubdate"]',
            'meta[name="publish-date"]',
            'meta[name="date"]',
            'meta[itemprop="datePublished"]',
            'time[itemprop="datePublished"]'
          ];

          for (const selector of metaSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              const content = element.getAttribute('content') ||
                              element.getAttribute('datetime') ||
                              element.textContent;
              if (content) {
                const date = new Date(content);
                if (!isNaN(date)) return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              }
            }
          }

          // 2. Check data attributes
          const dataSelectors = [
            '[data-published-date]',
            '[data-date-published]',
            '[data-pubdate]',
            '[data-article-date]'
          ];

          for (const selector of dataSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              const dateStr = element.getAttribute('data-published-date') ||
                              element.getAttribute('data-date-published') ||
                              element.getAttribute('data-pubdate') ||
                              element.getAttribute('data-article-date');
              if (dateStr) {
                const date = new Date(dateStr);
                if (!isNaN(date)) return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              }
            }
          }

          // 3. Search for common patterns in text
          const datePatterns = [
            /(\d{1,2}\s+[a-z]+\s+\d{4})/i,  // 28 July 2023
            /(\d{1,2}\/\d{1,2}\/\d{4})/,    // 07/28/2023
            /(\d{4}-\d{1,2}-\d{1,2})/       // 2023-07-28
          ];

          const possibleElements = [
            '.publication-date',
            '.article-date',
            '.post-date',
            '.entry-date',
            '.date',
            '.timestamp',
            '[class*="date"]',
            '[class*="time"]'
          ];

          for (const selector of possibleElements) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
              const text = element.textContent || element.innerText;
              if (text) {
                for (const pattern of datePatterns) {
                  const match = text.match(pattern);
                  if (match) {
                    const dateStr = match[1];
                    const date = new Date(dateStr);
                    if (!isNaN(date)) return date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  }
                }
              }
            }
          }

          return "Not found";
        }
      });

      if (results[0].result === "Not found") {
        dateDisplay.textContent = "Publication date not found";
      } else {
        dateDisplay.textContent = `Published on: ${results[0].result}`;
      }
    } catch (error) {
      console.error('Error:', error);
      dateDisplay.textContent = "Error while searching for date";
    }
  }

  getPublicationDate();
  refreshButton.addEventListener('click', getPublicationDate);
});
