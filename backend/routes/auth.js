const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const genToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({ _id: user._id, name: user.name, email: user.email, token: genToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ME
router.get('/me', protect, (req, res) => res.json(req.user));

// SETUP — first time admin create karo
// Usage: /api/auth/setup?key=SETUP_KEY&email=admin@example.com&password=yourpass&name=Carl
router.get('/setup', async (req, res) => {
  const { key, email, password, name } = req.query;
  if (!process.env.SETUP_KEY || key !== process.env.SETUP_KEY)
    return res.status(403).json({ message: 'Forbidden. Set SETUP_KEY in env.' });
  if (!email || !password)
    return res.status(400).json({ message: 'Need ?email=...&password=...&name=...' });
  try {
    // findOneAndUpdate bypasses pre-save hook so use create/save instead
    let user = await User.findOne({ email });
    if (user) {
      user.name = name || 'Admin';
      user.password = password; // pre-save hook will hash it
      await user.save();
    } else {
      user = await User.create({ name: name || 'Admin', email, password });
    }
    res.json({ message: '✅ Admin created/updated!', email: user.email });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;