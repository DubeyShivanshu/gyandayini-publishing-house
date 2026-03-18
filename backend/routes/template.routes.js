const express = require('express');
const router = express.Router();
const Template = require('../models/Template.model');
const { protect, ownerOnly } = require('../middleware/auth.middleware');

// GET /api/templates - get all active templates
router.get('/', async (req, res) => {
  try {
    const { category, language } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (language) filter.language = { $in: [language, 'both'] };
    const templates = await Template.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/templates/:id
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/templates - owner creates template
router.post('/', protect, ownerOnly, async (req, res) => {
  try {
    const template = await Template.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/templates/:id - owner updates template
router.put('/:id', protect, ownerOnly, async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/templates/:id
router.delete('/:id', protect, ownerOnly, async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
