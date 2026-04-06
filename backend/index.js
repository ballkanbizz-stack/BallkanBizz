require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const DB_FILE = 'backend-data.db';

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Failed to open database:', err);
    process.exit(1);
  }
});

const DAYS = 24 * 60 * 60 * 1000;
const FREE_YEAR_MS = 365 * DAYS;

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'store-owner',
      createdAt INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ownerId INTEGER NOT NULL,
      storeName TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      registeredAt INTEGER NOT NULL,
      freePeriodEndsAt INTEGER,
      nextDueAt INTEGER,
      paymentStatus TEXT NOT NULL DEFAULT 'free',
      FOREIGN KEY(ownerId) REFERENCES users(id)
    )
  `);
}

function normalizeStore(store) {
  const now = Date.now();
  const freePeriodEndsAt = store.freePeriodEndsAt;
  const nextDueAt = store.nextDueAt || freePeriodEndsAt;

  if (store.paymentStatus === 'paid') {
    if (nextDueAt && now > nextDueAt) {
      return {
        ...store,
        status: 'pending-payment',
        paymentStatus: 'pending',
        paymentDueAt: nextDueAt,
      };
    }
    return {
      ...store,
      status: 'active',
      paymentDueAt: nextDueAt,
    };
  }

  if (store.paymentStatus === 'free') {
    if (now > freePeriodEndsAt) {
      return {
        ...store,
        status: 'pending-payment',
        paymentStatus: 'pending',
        paymentDueAt: freePeriodEndsAt,
      };
    }
    return {
      ...store,
      status: 'active',
      paymentDueAt: freePeriodEndsAt,
    };
  }

  return {
    ...store,
    status: 'pending-payment',
    paymentDueAt: nextDueAt,
  };
}

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  const token = authorization.slice(7);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = payload;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

app.post('/api/register-store', (req, res) => {
  const { ownerName, email, password, storeName, description } = req.body;
  if (!ownerName || !email || !password || !storeName) {
    return res.status(400).json({ error: 'ownerName, email, password, and storeName are required' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const createdAt = Date.now();
  const freePeriodEndsAt = createdAt + FREE_YEAR_MS;
  const nextDueAt = freePeriodEndsAt;

  db.run(
    `INSERT INTO users (name, email, passwordHash, role, createdAt) VALUES (?, ?, ?, 'store-owner', ?)`,
    [ownerName, email, passwordHash, createdAt],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Email already exists' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Failed to create user' });
      }
      const ownerId = this.lastID;
      db.run(
        `INSERT INTO stores (ownerId, storeName, description, registeredAt, freePeriodEndsAt, nextDueAt, paymentStatus, status) VALUES (?, ?, ?, ?, ?, ?, 'free', 'active')`,
        [ownerId, storeName, description || '', createdAt, freePeriodEndsAt, nextDueAt],
        function (storeErr) {
          if (storeErr) {
            console.error(storeErr);
            return res.status(500).json({ error: 'Failed to create store' });
          }
          return res.json({ message: 'Store registered successfully', storeId: this.lastID });
        }
      );
    }
  );
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Login failed' });
    }
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });
});

app.get('/api/my-store', authenticate, (req, res) => {
  db.get(
    `SELECT stores.*, users.name AS ownerName, users.email AS ownerEmail FROM stores JOIN users ON users.id = stores.ownerId WHERE ownerId = ?`,
    [req.user.id],
    (err, store) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch store' });
      }
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
      res.json(normalizeStore(store));
    }
  );
});

app.get('/api/admin/stores', authenticate, requireAdmin, (req, res) => {
  db.all(
    `SELECT stores.*, users.name AS ownerName, users.email AS ownerEmail FROM stores JOIN users ON users.id = stores.ownerId ORDER BY stores.registeredAt DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch stores' });
      }
      res.json(rows.map(normalizeStore));
    }
  );
});

app.post('/api/admin/confirm-payment', authenticate, requireAdmin, (req, res) => {
  const { storeId } = req.body;
  if (!storeId) {
    return res.status(400).json({ error: 'storeId is required' });
  }
  const now = Date.now();
  const nextDueAt = now + FREE_YEAR_MS;

  db.run(
    `UPDATE stores SET paymentStatus = 'paid', status = 'active', freePeriodEndsAt = NULL, nextDueAt = ? WHERE id = ?`,
    [nextDueAt, storeId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update payment status' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Store not found' });
      }
      res.json({ message: 'Payment confirmed and next due date updated' });
    }
  );
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

function createAdminUser() {
  const adminEmail = 'admin@ballkanbizz.local';
  const adminPassword = 'Admin123!';
  const passwordHash = bcrypt.hashSync(adminPassword, 10);
  const createdAt = Date.now();

  db.get(`SELECT id FROM users WHERE email = ?`, [adminEmail], (err, row) => {
    if (err) {
      console.error('Failed to check admin user:', err);
      return;
    }
    if (!row) {
      db.run(
        `INSERT INTO users (name, email, passwordHash, role, createdAt) VALUES (?, ?, ?, 'admin', ?)`,
        ['Marketplace Admin', adminEmail, passwordHash, createdAt],
        (insertErr) => {
          if (insertErr) {
            console.error('Failed to create admin user:', insertErr);
          } else {
            console.log('Admin user created: admin@ballkanbizz.local / Admin123!');
          }
        }
      );
    }
  });
}

createTables();
createAdminUser();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
