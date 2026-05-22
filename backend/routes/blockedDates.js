const express = require('express');
const router = express.Router();
const BlockedDate = require('../models/BlockedDate');
const { protect } = require('../middleware/auth');

// PUBLIC: Get blocked dates
router.get('/', async (req, res) => {
  try {
    const { roomId } = req.query;
    const query = roomId ? { room: roomId } : {};
    const dates = await BlockedDate.find(query);
    res.json(dates);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN: Block a date
router.post('/', protect, async (req, res) => {
  try {
    const { date, roomId, reason } = req.body;
    const blocked = await BlockedDate.create({ date, room: roomId, reason });
    res.status(201).json(blocked);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN: Block date range
router.post('/range', protect, async (req, res) => {
  try {
    const { startDate, endDate, roomId, reason } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const docs = [];
    const d = new Date(start);
    while (d <= end) {
      docs.push({ date: new Date(d), room: roomId, reason });
      d.setDate(d.getDate() + 1);
    }
    await BlockedDate.insertMany(docs, { ordered: false }).catch(() => {});
    res.status(201).json({ message: `${docs.length} dates blocked` });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN: Unblock a date
router.delete('/:id', protect, async (req, res) => {
  try {
    await BlockedDate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Unblocked' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
