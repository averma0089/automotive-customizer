const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard-cat-please-change',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

// Simple in-memory product catalog
const products = [
  { id: 1, name: 'Model S', price: 79999, desc: 'Luxury electric sedan', img: '/images/car1.jpg' },
  { id: 2, name: 'Model X', price: 89999, desc: 'Spacious electric SUV', img: '/images/car2.jpg' },
  { id: 3, name: 'Roadster', price: 199999, desc: 'High performance sports car', img: '/images/car3.jpg' }
];

app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  next();
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/shop', (req, res) => {
  res.render('shop', { title: 'Shop', products, cart: req.session.cart });
});

app.post('/cart/add', (req, res) => {
  const id = Number(req.body.id);
  const product = products.find(p => p.id === id);
  if (product) {
    const existing = req.session.cart.find(i => i.id === id);
    if (existing) existing.qty += 1;
    else req.session.cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  res.redirect('/shop');
});

app.post('/cart/remove', (req, res) => {
  const id = Number(req.body.id);
  req.session.cart = req.session.cart.filter(i => i.id !== id);
  res.redirect('/shop');
});

app.get('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  res.render('checkout', { title: 'Checkout', cart, total });
});

app.post('/checkout', (req, res) => {
  const { name, email, address } = req.body;
  const cart = req.session.cart || [];
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  // In a real app you'd create an order record and process payment.
  // Here we just show a confirmation page and clear the cart.
  req.session.cart = [];
  res.render('confirmation', { title: 'Order Confirmation', order: { name, email, address, cart, total } });
});

// Simple assets for product images (placeholder SVGs)
app.get('/images/:name', (req, res) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='700' viewBox='0 0 1200 700'><rect width='100%' height='100%' fill='#e9ecef'/><text x='50%' y='50%' alignment-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='#6c757d'>Car image</text></svg>`;
  res.type('image/svg+xml').send(svg);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
