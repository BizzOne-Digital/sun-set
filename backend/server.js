const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── DB Connection (Vercel serverless safe) ──────────────────────
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection error:', err.message);
    isConnected = false;
    throw err;
  }
}

// Middleware — connect DB on every request (serverless safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed. Please try again.' });
  }
});

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/auth',                    require('./routes/auth'));
app.use('/api/bookings',                require('./routes/bookings'));
app.use('/api/blocked-dates',           require('./routes/blockedDates'));
app.use('/api/rooms',                   require('./routes/rooms'));
app.use('/api/reviews',                 require('./routes/reviews'));
app.use('/api/gallery',                 require('./routes/gallery'));
app.use('/api/leads',                   require('./routes/leads'));
app.use('/api/management-applications', require('./routes/managementApplications'));
app.use('/api/managed-properties',      require('./routes/managedProperties'));
app.use('/api/settings',                require('./routes/settings'));

app.get('/', (req, res) => res.json({ message: 'Sunset Retreat JA API v2 ✓' }));

module.exports = app;