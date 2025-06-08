// realtime.js

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. CONFIGURATION: UPDATE THESE VALUES ---
  // You'll get this URL after deploying your backend in Part 3.
  const BACKEND_URL = 'wss://your-backend-app-name.onrender.com';

  // Find the IDs or classes of the HTML elements you want to update.
  // Replace these with the actual selectors from your index.html.
  const SELECTORS = {
    stockPrice: '#stock-price-placeholder', // e.g., '#apple-stock-price'
    cryptoPrice: '.crypto-price-placeholder', // e.g., '#bitcoin-price'
    newsHeadline: '#news-headline-placeholder', // e.g., '#latest-news-headline'
    newsSource: '#news-source-placeholder', // e.g., '#latest-news-source'
  };
  // ---------------------------------------------

  console.log('Attempting to connect to WebSocket server...');

  const ws = new WebSocket(BACKEND_URL);

  ws.onopen = () => {
    console.log('✅ WebSocket connection established.');
    // You could send a message to the server if needed
    // ws.send(JSON.stringify({ message: 'Hello Server!' }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received data:', data);

      // Update the HTML content based on the data type
      switch (data.type) {
        case 'financial':
          updateElement(SELECTORS.stockPrice, `$${data.price}`);
          break;
        case 'crypto':
          updateElement(SELECTORS.cryptoPrice, `$${data.price}`);
          break;
        case 'news':
          updateElement(SELECTORS.newsHeadline, data.headline);
          updateElement(SELECTORS.newsSource, data.source);
          break;
        default:
          console.warn('Received unknown data type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing message or updating UI:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed. It will automatically reconnect.');
  };

  /**
   * Helper function to update the text content of an HTML element.
   * @param {string} selector - The CSS selector of the element.
   * @param {string} text - The new text content.
   */
  function updateElement(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = text;
    } else {
      console.warn(`Element with selector "${selector}" not found.`);
    }
  }
});
