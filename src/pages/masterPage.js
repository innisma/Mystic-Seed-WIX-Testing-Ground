/**
 * Master Page (Global) Code — The Mystic Seed
 * 
 * Runs on every page. Handles site-wide behavior.
 * Converted from AI Studio Navbar.tsx and Footer.tsx.
 *
 * ELEMENT ID MAPPING (from .wix/types/masterPage/masterPage.d.ts):
 *
 *   Header:
 *     #header1               → Site header
 *     #horizontalMenu1       → Primary navigation menu
 *     #horizontalMenu2       → Secondary navigation menu
 *     #searchBox1            → Search box
 *     #shoppingCartIcon1     → Cart icon (IFrame)
 *     #loginSocialBar1       → Account nav bar
 *     #image47, #image48     → Logo / brand images
 *
 *   Footer:
 *     #footer1               → Site footer
 *     #text31                → Footer text element
 *     #text36 - #text40      → Footer text elements (contact, links, etc.)
 *     #socialBar3            → Social media icons
 *     #wixChat1              → Wix Chat widget (IFrame)
 *
 *   NOTE: Most navbar/footer behavior (responsive menu, scroll effects,
 *   social links, contact info) is handled by the Wix Editor natively.
 *   This code only adds custom behavior on top.
 */

$w.onReady(function () {

    // ═══════════════════════════════════════════════
    // NAVBAR — Additional behavior
    // ═══════════════════════════════════════════════

    // Wix handles sticky header, responsive menu toggle, and nav links
    // natively through the Editor's header settings. No custom code needed
    // for those features.

    // Optional: Highlight current page in navigation
    // (Wix menus do this automatically, so this is just a fallback)


    // ═══════════════════════════════════════════════
    // FOOTER — Newsletter signup handler
    // ═══════════════════════════════════════════════

    // If there's a newsletter email input in the footer, 
    // you can wire it up here. The Footer.tsx had an email input
    // with a "Join" button. If your Wix footer has similar elements,
    // uncomment and adjust the IDs below:
    //
    // $w('#footerEmailInput').onKeyPress((event) => {
    //   if (event.key === 'Enter') {
    //     handleNewsletterSignup();
    //   }
    // });
    //
    // $w('#footerJoinButton').onClick(() => {
    //   handleNewsletterSignup();
    // });

});

/**
 * Newsletter signup handler.
 * In the AI Studio version, this was a form in the Footer component.
 * In Wix, you can use triggered emails, wix-crm, or a Wix Form widget.
 * Uncomment and customize when ready.
 */
// async function handleNewsletterSignup() {
//   const email = $w('#footerEmailInput').value;
//   if (!email || !email.trim()) return;
//
//   // Option 1: Use Wix CRM to create a contact
//   // import wixCrm from 'wix-crm';
//   // await wixCrm.createContact({ emails: [email.trim()] });
//
//   // Option 2: Save to a CMS collection
//   // import wixData from 'wix-data';
//   // await wixData.insert('NewsletterSubscribers', { email: email.trim() });
//
//   $w('#footerEmailInput').value = '';
//   // Show success feedback
// }
