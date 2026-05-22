const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect } = require('../middleware/auth');

router.get('/:key', async (req, res) => {
  try {
    const s = await Settings.findOne({ key: req.params.key });
    res.json(s ? s.value : null);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { key, value } = req.body;
    const s = await Settings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    res.json(s);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
