const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'leads.db');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      car_model TEXT,
      trim TEXT,
      color TEXT,
      wheel TEXT,
      interior TEXT,
      package_name TEXT,
      notes TEXT,
      customer_name TEXT,
      phone TEXT,
      email TEXT,
      preferred_time TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (createErr) => {
    if (createErr) {
      console.error('Failed to create table:', createErr.message);
    }
  });
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const carModels = [
  {
    name: 'Apex S',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
    tagline: 'Electric performance sedan'
  },
  {
    name: 'Monarch X',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    tagline: 'Luxury SUV for family adventures'
  },
  {
    name: 'Velocity GT',
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
    tagline: 'Sport coupe built for thrill'
  }
];

app.get('/', (req, res) => {
  res.render('index', { models: carModels });
});

app.get('/latest-leads', (req, res) => {
  db.all('SELECT * FROM leads ORDER BY created_at DESC LIMIT 50', (err, rows) => {
    if (err) {
      console.error('Could not fetch leads:', err.message);
      return res.status(500).send('Unable to load latest leads.');
    }

    res.render('leads', { leads: rows });
  });
});

app.get('/success', (req, res) => {
  const leadId = req.query.leadId || 'Unknown';
  res.render('success', { leadId });
});

app.post('/buy', (req, res) => {
  const {
    carModel,
    trim,
    color,
    wheel,
    interior,
    packageName,
    notes,
    customerName,
    phone,
    email,
    preferredTime
  } = req.body;

  if (!customerName || !phone || !email || !preferredTime) {
    return res.status(400).send('Please complete all required customer details.');
  }

  const query = `
    INSERT INTO leads (
      car_model, trim, color, wheel, interior, package_name,
      notes, customer_name, phone, email, preferred_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    carModel || 'Apex S',
    trim || 'Premium',
    color || 'Obsidian Black',
    wheel || '20-inch alloy',
    interior || 'Leather',
    packageName || 'Tech Plus',
    notes || '',
    customerName,
    phone,
    email,
    preferredTime
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Insert failed:', err.message);
      return res.status(500).send('Failed to save your inquiry.');
    }

    res.redirect(`/success?leadId=${this.lastID}`);
  });
});

app.listen(port, () => {
  console.log(`Automotive configurator running at http://localhost:${port}`);
});
