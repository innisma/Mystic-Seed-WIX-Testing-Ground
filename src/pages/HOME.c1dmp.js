/**
 * HOME Page Code — The Mystic Seed
 * 
 * Converted from AI Studio React components (Hero.tsx, ProductSection.tsx, MysticChat.tsx).
 * All React JSX/state has been flattened to imperative Velo $w() selectors.
 *
 * ELEMENT ID MAPPING (from .wix/types/c1dmp/c1dmp.d.ts):
 * 
 *   Hero Section:
 *     #section1              → Hero section container
 *     #Section1RegularTitle1 → Hero heading text
 *     #text27                → Hero subheading / quote text
 *     #button15              → "Explore the Shop" CTA
 *     #button19              → "Consult the Oracle" CTA
 *
 *   Product Section:
 *     #section4                     → Products section container
 *     #Section1RegularMediaImage1   → Product image slot 1
 *     #Section1RegularMediaImage2   → Product image slot 2
 *     #Section1RegularMediaImage3   → Product image slot 3
 *     #text123                      → Product 1 name
 *     #text124                      → Product 2 name
 *     #text125                      → Product 3 name
 *     #text138                      → Product 1 description/price
 *     #text139                      → Product 2 description/price
 *     #text140                      → Product 3 description/price
 *     #button20                     → Category: All
 *     #button21                     → Category: Books
 *     #button27                     → Category: Seeds
 *     #button28                     → Category: Rituals
 *
 *   Oracle Chat Section:
 *     #section13             → Oracle chat section container
 *     #input53               → Chat text input
 *     #button15              → (shared) or use another button for send
 *     #text28                → Chat response / conversation display
 *     #box2                  → Chat container box
 *
 *   NOTE: If your Wix Editor element IDs differ from the mapping above,
 *   update the selectors in this file to match your actual element IDs.
 *   Check .wix/types/c1dmp/c1dmp.d.ts for the authoritative list.
 */

import { getOracleGuidance } from 'backend/geminiService.jsw';
import { PRODUCTS } from 'public/constants.js';

// ─── Module-level state (replaces React useState) ───
let chatMessages = [];
let isOracleThinking = false;
let currentCategory = 'all';
let currentProductPage = 0; // Which set of 3 products to show

$w.onReady(function () {

  // ═══════════════════════════════════════════════
  // HERO SECTION — CTA Button Handlers
  // ═══════════════════════════════════════════════

  // "Explore the Shop" button → scroll to product section
  $w('#button15').onClick(() => {
    $w('#section4').scrollTo();
  });

  // "Consult the Oracle" button → scroll to chat section
  $w('#button19').onClick(() => {
    $w('#section13').scrollTo();
  });

  // ═══════════════════════════════════════════════
  // PRODUCT SECTION — Display & Category Filters
  // ═══════════════════════════════════════════════

  // Initial product display
  displayProducts(PRODUCTS);

  // Category filter buttons
  $w('#button20').onClick(() => { filterByCategory('all'); });
  $w('#button21').onClick(() => { filterByCategory('books'); });
  $w('#button27').onClick(() => { filterByCategory('seeds'); });
  $w('#button28').onClick(() => { filterByCategory('rituals'); });

  // ═══════════════════════════════════════════════
  // ORACLE CHAT — Input & Response Handling
  // ═══════════════════════════════════════════════

  // Initialize chat display
  $w('#text28').html = '<p style="opacity:0.4; font-style:italic; text-align:center;">Ask about your path, a book recommendation, or the meaning of growth...</p>';

  // Send on Enter key
  $w('#input53').onKeyPress((event) => {
    if (event.key === 'Enter') {
      handleChatSend();
    }
  });

  // Send button (using button that's near the input — adjust ID if needed)
  $w('#button28').onClick(() => {
    // Note: If button28 is already used for category filter,
    // use a different available button for chat send.
    // This is a placeholder — see NOTE below.
  });

});

// ═══════════════════════════════════════════════
// PRODUCT DISPLAY FUNCTIONS
// ═══════════════════════════════════════════════

/**
 * Displays up to 3 products in the available image/text slots.
 * Maps to the 3 product card positions on the HOME page.
 */
function displayProducts(products) {
  const imageElements = ['#Section1RegularMediaImage1', '#Section1RegularMediaImage2', '#Section1RegularMediaImage3'];
  const nameElements = ['#text123', '#text124', '#text125'];
  const detailElements = ['#text138', '#text139', '#text140'];

  // Show up to 3 products
  for (let i = 0; i < 3; i++) {
    if (i < products.length) {
      const product = products[i];

      // Set product image
      $w(imageElements[i]).src = product.image;
      $w(imageElements[i]).alt = product.name;
      $w(imageElements[i]).show();

      // Set product name
      $w(nameElements[i]).text = product.name;
      $w(nameElements[i]).show();

      // Set product description + price
      $w(detailElements[i]).text = `${product.description}\n$${product.price.toFixed(2)}`;
      $w(detailElements[i]).show();

    } else {
      // Hide unused slots
      $w(imageElements[i]).hide();
      $w(nameElements[i]).hide();
      $w(detailElements[i]).hide();
    }
  }
}

/**
 * Filters products by category and updates the display.
 */
function filterByCategory(category) {
  currentCategory = category;

  let filtered;
  if (category === 'all') {
    filtered = PRODUCTS;
  } else {
    filtered = PRODUCTS.filter(p => p.category === category);
  }

  displayProducts(filtered);
}

// ═══════════════════════════════════════════════
// ORACLE CHAT FUNCTIONS
// ═══════════════════════════════════════════════

/**
 * Handles sending a chat message to the Oracle.
 * Calls the backend geminiService, then displays the response.
 */
async function handleChatSend() {
  const userInput = $w('#input53').value;

  if (!userInput || !userInput.trim() || isOracleThinking) {
    return;
  }

  // Add user message to chat history
  chatMessages.push({ role: 'user', text: userInput.trim() });
  $w('#input53').value = ''; // Clear input
  isOracleThinking = true;

  // Update chat display with user message + thinking indicator
  renderChatMessages(true);

  try {
    // Call backend Oracle service
    const guidance = await getOracleGuidance(userInput.trim());

    // Add Oracle response to chat history
    chatMessages.push({ role: 'model', text: guidance });
  } catch (err) {
    chatMessages.push({
      role: 'model',
      text: 'The stars are occluded at the moment. Plant your intentions and return when the moon is high.'
    });
  }

  isOracleThinking = false;
  renderChatMessages(false);
}

/**
 * Renders the chat conversation as HTML in a text element.
 * Since there's no Repeater, we accumulate messages as styled HTML.
 */
function renderChatMessages(showTyping) {
  let html = '';

  for (const msg of chatMessages) {
    if (msg.role === 'user') {
      html += `<p style="text-align:right; background:rgba(5,150,105,0.15); border:1px solid rgba(16,185,129,0.2); padding:10px 14px; border-radius:12px 12px 0 12px; margin:8px 0; color:#d1fae5; font-size:14px;">${escapeHtml(msg.text)}</p>`;
    } else {
      html += `<p style="text-align:left; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:10px 14px; border-radius:12px 12px 12px 0; margin:8px 0; color:#d1d5db; font-style:italic; font-family:'Playfair Display',serif; font-size:15px;">${escapeHtml(msg.text)}</p>`;
    }
  }

  if (showTyping) {
    html += '<p style="text-align:left; color:#6b7280; font-style:italic; font-size:13px; padding:8px;">✦ The Oracle is reflecting...</p>';
  }

  if (chatMessages.length === 0 && !showTyping) {
    html = '<p style="opacity:0.4; font-style:italic; text-align:center;">Ask about your path, a book recommendation, or the meaning of growth...</p>';
  }

  $w('#text28').html = html;
}

/**
 * Escapes HTML entities to prevent XSS in chat messages.
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}