// ---------- cart: lines are {id, qty}, saved in localStorage as JSON, prices always come from the MENU array ----------
// This file is loaded on every page: the navbar counter and the cart drawer work everywhere.
const MAX_QTY = 10;
const LARGE_SURCHARGE = 300; // per drink, only when "Large" is chosen
const CART_KEY = 'ix-cart';
const SIZE_KEY = 'ix-size';
const LAST_ORDER_KEY = 'ix-last-order';

function findItem(id) {
  return MENU.find(item => item.id === id);
}

// the saved data can be empty, old or edited by hand: keep only valid lines
function loadCart() {
  const saved = Store.get(CART_KEY, []);
  const lines = [];
  if (!Array.isArray(saved)) return lines;
  for (const entry of saved) {
    const id = Number(entry && entry.id);
    const qty = Math.floor(Number(entry && entry.qty));
    if (!findItem(id) || !(qty >= 1) || lines.some(l => l.id === id)) continue;
    lines.push({ id, qty: Math.min(qty, MAX_QTY) });
  }
  return lines;
}

const cartLines = loadCart();

function saveCart() {
  Store.set(CART_KEY, cartLines);
}

function currentSize() {
  const checked = document.querySelector('#orderForm input[name="size"]:checked');
  if (checked) return checked.value;
  return Store.get(SIZE_KEY, 'regular') === 'large' ? 'large' : 'regular';
}

// calculated values: item count, drinks count, subtotal, surcharge, total
function cartTotals() {
  let count = 0, drinks = 0, subtotal = 0;
  for (const line of cartLines) {
    const item = findItem(line.id);
    count += line.qty;
    subtotal += item.price * line.qty;
    if (item.type !== 'Bake') drinks += line.qty;
  }
  const surcharge = currentSize() === 'large' ? drinks * LARGE_SURCHARGE : 0;
  return { count, drinks, subtotal, surcharge, total: subtotal + surcharge };
}

function commitCart(note) {
  saveCart();
  renderCart(note);
}

function addToCart(id) {
  const line = cartLines.find(l => l.id === id);
  if (!line) {
    cartLines.push({ id, qty: 1 });
  } else if (line.qty >= MAX_QTY) {
    renderCart('You can order up to ' + MAX_QTY + ' of one item.');
    return;
  } else {
    line.qty += 1;
  }
  commitCart();
}

function changeQty(id, delta) {
  const index = cartLines.findIndex(l => l.id === id);
  if (index === -1) return;
  const next = cartLines[index].qty + delta;
  if (next > MAX_QTY) { renderCart('You can order up to ' + MAX_QTY + ' of one item.'); return; }
  if (next < 1) cartLines.splice(index, 1);
  else cartLines[index].qty = next;
  commitCart();
}

function removeFromCart(id) {
  const index = cartLines.findIndex(l => l.id === id);
  if (index !== -1) cartLines.splice(index, 1);
  commitCart();
}

function clearCart() {
  cartLines.length = 0;
  commitCart();
}

function makeEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function makeButton(className, text, label, handler) {
  const btn = makeEl('button', className, text);
  btn.type = 'button';
  btn.setAttribute('aria-label', label);
  btn.addEventListener('click', handler);
  return btn;
}

function sumRow(label, value, className) {
  const row = makeEl('div', 'cart-sum-row' + (className ? ' ' + className : ''));
  row.append(makeEl('span', '', label), makeEl('span', '', value));
  return row;
}

const onMenuPage = Boolean(document.getElementById('orderForm'));

// draws the cart into one box (the pre-order form on the menu page, or the drawer on every page)
function fillCart(box, totals, note, inDrawer) {
  box.replaceChildren();

  if (cartLines.length === 0) {
    box.append(makeEl('p', 'cart-empty', inDrawer ? 'Your cart is empty. Add something tasty from the menu.' : 'Your cart is empty. Add something tasty from the menu above.'));
  } else {
    cartLines.forEach(line => {
      const item = findItem(line.id);
      const row = makeEl('div', 'cart-row');
      const info = makeEl('div', 'cart-info');
      info.append(makeEl('span', 'cart-name', item.name), makeEl('span', 'cart-line-price', formatPrice(item.price * line.qty)));
      const qty = makeEl('div', 'qty');
      qty.append(
        makeButton('qty-btn', '−', 'Decrease quantity of ' + item.name, () => changeQty(item.id, -1)),
        makeEl('span', 'qty-num', String(line.qty)),
        makeButton('qty-btn', '+', 'Increase quantity of ' + item.name, () => changeQty(item.id, 1))
      );
      row.append(info, qty, makeButton('cart-remove', '×', 'Remove ' + item.name + ' from cart', () => removeFromCart(item.id)));
      box.append(row);
    });
    const sum = makeEl('div', 'cart-sum');
    sum.append(sumRow('Items', String(totals.count)));
    if (totals.surcharge > 0) sum.append(sumRow('Large size (' + totals.drinks + ' × ' + formatPrice(LARGE_SURCHARGE) + ')', formatPrice(totals.surcharge)));
    sum.append(sumRow('Total', formatPrice(totals.total), 'cart-total'));
    box.append(sum);
    box.append(makeButton('btn-clear', 'Clear cart', 'Remove all items from the cart', clearCart));
  }
  if (note) box.append(makeEl('p', 'cart-note', note));

  if (inDrawer) {
    const link = makeEl('a', 'btn btn-pumpkin w-100 mt-3', cartLines.length === 0 ? 'Open the menu' : 'Go to checkout');
    link.href = cartLines.length === 0 ? 'menu.html' : 'menu.html#preorder';
    if (onMenuPage && cartLines.length > 0) link.setAttribute('data-bs-dismiss', 'offcanvas');
    box.append(link);
    const last = Store.get(LAST_ORDER_KEY, null);
    if (last && typeof last.name === 'string' && typeof last.total === 'number') {
      box.append(makeEl('p', 'cart-last', 'Last order: ' + last.count + (last.count === 1 ? ' item' : ' items') + ', ' + formatPrice(last.total) + ', for ' + last.name + '.'));
    }
  }
}

function renderCart(note) {
  const totals = cartTotals();
  const box = document.getElementById('cart');
  if (box) fillCart(box, totals, note, false);
  const drawer = document.getElementById('drawerCart');
  if (drawer) fillCart(drawer, totals, note, true);

  // counter in the navbar (every page)
  const badge = document.getElementById('navCartCount');
  if (badge) {
    badge.textContent = String(totals.count);
    badge.hidden = totals.count === 0;
  }
  const navCart = document.getElementById('navCart');
  if (navCart) navCart.setAttribute('aria-label', 'Open your order: ' + totals.count + (totals.count === 1 ? ' item' : ' items') + ', ' + formatPrice(totals.total));

  // floating shortcut button (menu page)
  const fabText = document.getElementById('cartFabText');
  if (fabText) fabText.textContent = totals.count + (totals.count === 1 ? ' item · ' : ' items · ') + formatPrice(totals.total);
  const cartError = document.getElementById('cartError');
  if (cartError && totals.count > 0) cartError.hidden = true;

  document.dispatchEvent(new CustomEvent('cart:changed', { detail: totals }));
}

// the drawer is built once here, so every page gets the same cart without repeating the markup
function buildDrawer() {
  if (document.getElementById('cartDrawer')) return;
  const drawer = makeEl('div', 'offcanvas offcanvas-end');
  drawer.id = 'cartDrawer';
  drawer.tabIndex = -1;
  drawer.setAttribute('aria-labelledby', 'cartDrawerTitle');
  const head = makeEl('div', 'offcanvas-header');
  const title = makeEl('span', 'offcanvas-title h5', 'Your order');
  title.id = 'cartDrawerTitle';
  const close = makeEl('button', 'btn-close');
  close.type = 'button';
  close.setAttribute('data-bs-dismiss', 'offcanvas');
  close.setAttribute('aria-label', 'Close');
  head.append(title, close);
  const body = makeEl('div', 'offcanvas-body');
  const cart = makeEl('div', 'cart');
  cart.id = 'drawerCart';
  cart.setAttribute('aria-live', 'polite');
  body.append(cart);
  drawer.append(head, body);
  document.body.append(drawer);
}

// size change updates the total, and the choice is remembered
const orderFormForCart = document.getElementById('orderForm');
if (orderFormForCart) {
  const savedSize = Store.get(SIZE_KEY, 'regular');
  const radio = orderFormForCart.querySelector('input[name="size"][value="' + (savedSize === 'large' ? 'large' : 'regular') + '"]');
  if (radio) radio.checked = true;
  orderFormForCart.addEventListener('change', e => {
    if (e.target.name === 'size') {
      Store.set(SIZE_KEY, e.target.value);
      renderCart();
    }
  });
}

// the same cart in another open tab
window.addEventListener('storage', e => {
  if (e.key !== CART_KEY) return;
  cartLines.splice(0, cartLines.length, ...loadCart());
  renderCart();
});

buildDrawer();
renderCart();
// listeners from effects.js are ready after the page is parsed: tell them the saved cart once more
document.addEventListener('DOMContentLoaded', () => renderCart());
