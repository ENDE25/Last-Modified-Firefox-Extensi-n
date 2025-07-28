# Last Modified Extension

Get the Firefox extensión [here](https://addons.mozilla.org/es-ES/firefox/addon/last-modified-extension/)

A browser extension that reveals the true last-modified date of web pages, helping you identify when content was actually published or updated.

<img width="443" height="245" alt="imagen" src="https://github.com/user-attachments/assets/89011646-64a6-4498-a397-e31b0d4c2c79" />


## Features

- **Multi-source detection**  
  Scans meta tags (`article:published_time`), HTML attributes (`data-pubdate`), and content patterns
- **Intelligent date parsing**  
  Recognizes formats like "July 28, 2023" or "2023-07-28"
- 🛡**Privacy first**  
  No tracking, analytics, or data collection
- **Works on**:
  - News sites (BBC, Wikipedia)
  - Blogs (WordPress, Medium)
  - Documentation pages

## Installation

### Firefox
1. Install from [Mozilla Add-ons](https://addons.mozilla.org/es-ES/firefox/addon/last-modified-extension/)
2. Or load manually:
   - Clone this repo
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on" → Select the `manifest.json`

### Chrome/Edge
1. Enable Developer Mode at `chrome://extensions`
2. Click "Load unpacked" → Select the extension folder

## How It Works

The extension checks:
1. **HTML Metadata**  
   ```html
   <meta property="article:published_time" content="2023-07-28T12:00:00Z">
   ```
2. **Semantic Markup**
   ```html
   <time datetime="2023-07-28">July 28</time>
   ```
3. **Content Patterns**
   - "Published on July 28, 2023"
   - "Last updated: 2023/07/28"

>[!Warning]
>This extension provides best-effort date detection. Accuracy depends on:
>1. Available page metadata
>2. Site structure consistency  
>3. Standard date formats  
