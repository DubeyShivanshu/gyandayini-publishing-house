const express = require('express');
const router = express.Router();
const Media = require('../models/Media.model');

// GET /api/media - public access to active media
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    const media = await Media.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
