// current search / filter / sort choices
const menuState = { query: '', type: 'all', sort: 'default' };

function createDishCard(item) {
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-lg-3';

  const card = document.createElement('article');
  card.className = 'dish';

  const media = document.createElement('div');
  media.className = 'dish-media';
  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.alt;
  img.width = 960;
  img.height = 720;
  img.loading = 'lazy';
  const tag = document.createElement('span');
  tag.className = 'dish-tag';
  tag.textContent = item.type;
  media.append(img, tag);

  const body = document.createElement('div');
  body.className = 'dish-body';
  const title = document.createElement('h3');
  title.className = 'h5';
  title.textContent = item.name;
  const text = document.createElement('p');
  text.className = 'dish-with';
  text.textContent = item.madeWith;

  const foot = document.createElement('div');
  foot.className = 'dish-foot';
  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = formatPrice(item.price);
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'btn btn-pumpkin dish-add';
  add.dataset.id = item.id;
  add.textContent = 'Add to order';
  add.setAttribute('aria-label', 'Add ' + item.name + ' to order');
  foot.append(price, add);

  body.append(title, text, foot);
  card.append(media, body);
  col.append(card);
  return col;
}

// apply search + type filter + sort to the data array
function getVisibleItems() {
  const query = menuState.query.trim().toLowerCase();
  const items = MENU.filter(item => {
    const matchesText = query === '' ||
      item.name.toLowerCase().includes(query) ||
      item.madeWith.toLowerCase().includes(query);
    const matchesType = menuState.type === 'all' || item.type.includes(menuState.type);
    return matchesText && matchesType;
  });
  if (menuState.sort === 'price-asc') items.sort((a, b) => a.price - b.price);
  else if (menuState.sort === 'price-desc') items.sort((a, b) => b.price - a.price);
  else if (menuState.sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}

function renderMenu() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  const items = getVisibleItems();
  grid.replaceChildren();
  items.forEach(item => grid.append(createDishCard(item)));

  document.getElementById('menuEmpty').hidden = items.length > 0;

  // calculated value: average price of what is shown
  const count = document.getElementById('menuCount');
  if (items.length === 0) {
    count.textContent = 'Showing 0 of ' + MENU.length + ' items';
  } else {
    let sum = 0;
    for (const item of items) sum += item.price;
    count.textContent = 'Showing ' + items.length + ' of ' + MENU.length +
      ' items · average price ' + formatPrice(Math.round(sum / items.length));
  }
  document.dispatchEvent(new CustomEvent('menu:rendered'));
}

function initMenuControls() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  const search = document.getElementById('menuSearch');
  const sort = document.getElementById('menuSort');
  const chips = document.querySelectorAll('.chip');

  function setType(type) {
    menuState.type = type;
    chips.forEach(chip => {
      const active = chip.dataset.filter === type;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  search.addEventListener('input', () => { menuState.query = search.value; renderMenu(); });
  search.addEventListener('keydown', e => {
    if (e.key === 'Escape') { search.value = ''; menuState.query = ''; renderMenu(); }
  });
  chips.forEach(chip => chip.addEventListener('click', () => { setType(chip.dataset.filter); renderMenu(); }));
  sort.addEventListener('change', () => { menuState.sort = sort.value; renderMenu(); });
  document.getElementById('menuReset').addEventListener('click', () => {
    menuState.query = ''; menuState.sort = 'default';
    search.value = ''; sort.value = 'default';
    setType('all');
    renderMenu();
    search.focus();
  });

  // one listener for all "Add to order" buttons
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.dish-add');
    if (!btn) return;
    addToCart(Number(btn.dataset.id));
    btn.textContent = 'Added ✓';
    clearTimeout(btn.resetTimer);
    btn.resetTimer = setTimeout(() => { btn.textContent = 'Add to order'; }, 900);
  });
}

initMenuControls();
renderMenu();
