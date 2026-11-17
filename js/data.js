// ---------- data: every card on the page is built from this array ----------
const MENU = [
  { id: 1, name: 'Gingerbread Latte', type: 'Hot', madeWith: 'Oat, whole', price: 2200,
    image: 'images/pumpkin-spice-latte.jpg',
    alt: 'Latte with leaf-shaped foam art in a speckled white cup, next to a pumpkin and cinnamon sticks' },
  { id: 2, name: 'Frosted Cold Brew', type: 'Iced', madeWith: 'Vanilla cream', price: 2000,
    image: 'images/cobweb-cold-brew.jpg',
    alt: 'Tall glass of iced coffee topped with whipped cream and caramel, with a dark paper straw' },
  { id: 3, name: 'Mulled Apple Cider', type: 'Hot', madeWith: 'Cinnamon stick', price: 1900,
    image: 'images/caramel-apple-cider.jpg',
    alt: 'Glass mug of warm apple cider with an apple slice, star anise and a cinnamon stick' },
  { id: 4, name: 'Black Sesame Mocha', type: 'Hot / Iced', madeWith: 'Dark chocolate', price: 2300,
    image: 'images/black-sesame-mocha.jpg',
    alt: 'Dark ceramic mug of mocha topped with black and white sesame seeds and a chocolate web' },
  { id: 5, name: 'Gingerbread Loaf', type: 'Bake', madeWith: 'Pecans, maple glaze', price: 1500,
    image: 'images/pumpkin-loaf.jpg',
    alt: 'Loaf of pumpkin bread topped with chopped nuts, with two slices on a plate' },
  { id: 6, name: 'Snow Almond Croissant', type: 'Bake', madeWith: 'Almond, chocolate', price: 1400,
    image: 'images/bat-wing-croissant.jpg',
    alt: 'Golden flaky croissant on a speckled plate with a small bowl of jam' },
  { id: 7, name: 'Iced Holiday Cookie', type: 'Bake', madeWith: 'Brown butter', price: 1200,
    image: 'images/candy-corn-cookie.jpg',
    alt: 'Two orange iced cookies shaped like jack-o\'-lanterns on a plate' },
  { id: 8, name: 'Blueberry Cheesecake', type: 'Bake', madeWith: 'Blueberry, cream cheese', price: 1800,
    image: 'images/blueberry-cheesecake.jpg',
    alt: 'Slice of cheesecake with layers of cream and blueberry filling on a biscuit base' }
];

// 2200 -> "2 200 ₸" (non-breaking spaces so the price never wraps)
function formatPrice(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0₸';
}
