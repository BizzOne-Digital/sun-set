const express = require('express');
const router = express.Router();
const ManagementApplication = require('../models/ManagementApplication');
const { protect } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const app = await ManagementApplication.create(req.body);
    res.status(201).json({ message: 'Application received! We will contact you within 24 hours.', app });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/', protect, async (req, res) => {
  try {
    const apps = await ManagementApplication.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    const app = await ManagementApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(app);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await ManagementApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
