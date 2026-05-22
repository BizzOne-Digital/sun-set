const express = require('express');
const router = express.Router();
const ManagedProperty = require('../models/ManagedProperty');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const props = await ManagedProperty.find().sort({ createdAt: -1 });
    res.json(props);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const prop = await ManagedProperty.create(req.body);
    res.status(201).json(prop);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    const prop = await ManagedProperty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prop);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await ManagedProperty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
