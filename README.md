# IX Coffee
Winter coffee shop website (New Year / Christmas theme). WEB Technologies 1 (Front End) - Final Project.
Pages: `index.html`, `menu.html`, `loyalty.html`. Stack: HTML5, CSS (Bootstrap 5.3.3 + own CSS variables), JavaScript, jQuery 3.7.1.

- Light / dark mode: toggle in the navbar of every page, saved in localStorage (`ix-theme`)
- Saved user data (localStorage, JSON): cart (`ix-cart`), size (`ix-size`), last order, visitor name/email/phone, club member, club card design
- `css/style.css` - all styles (colours are CSS variables for both modes)
- `js/theme.js` - light / dark mode (loaded in `<head>`)
- `js/storage.js` - safe localStorage helpers (JSON)
- `js/data.js` - MENU array and price formatting
- `js/script.js` - falling snow
- `js/menu.js` - menu cards, search / filter / sort
- `js/cart.js` - cart, totals, navbar counter, cart drawer (all pages)
- `js/form.js` - pre-order form validation
- `js/loyalty.js` - Regulars Club: levels, status calculator, cup shelf, card builder (PNG), join form
- `js/effects.js` - jQuery effects (smooth scroll, accordion, fades, slide message, counter blink)
- `images/` - menu photos
