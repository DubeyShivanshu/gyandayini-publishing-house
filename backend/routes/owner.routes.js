const express = require('express');
const router = express.Router();
const Request = require('../models/Request.model');
const Media = require('../models/Media.model');
const { protect, ownerOnly } = require('../middleware/auth.middleware');

// All owner routes are protected
router.use(protect, ownerOnly);

// ─ REQUESTS

// GET /api/owner/requests - all requests with filters & pagination
router.get('/requests', async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const total = await Request.countDocuments(filter);
    const requests = await Request.find(filter)
      .populate('cardPrinting.templateId', 'name category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, requests, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/owner/requests/stats
router.get('/requests/stats', async (req, res) => {
  try {
    const stats = await Request.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const total = await Request.countDocuments();
    const today = await Request.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    res.json({ success: true, stats, total, today });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/owner/requests/:requestId
router.get('/requests/:requestId', async (req, res) => {
  try {
    const request = await Request.findOne({ requestId: req.params.requestId })
      .populate('cardPrinting.templateId');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/owner/requests/:requestId/status - update status (3 steps only)
router.put('/requests/:requestId/status', async (req, res) => {
  try {
    const { status, ownerNotes } = req.body;
    const VALID_STATUSES = ['pending', 'payment_received', 'completed'];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Use: pending, payment_received, or completed' });
    }

    const updateData = { status };
    if (ownerNotes !== undefined) updateData.ownerNotes = ownerNotes;

    const request = await Request.findOneAndUpdate(
      { requestId: req.params.requestId },
      updateData,
      { new: true }
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, message: `Status updated to: ${status.replace(/_/g, ' ')}`, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/owner/requests/:requestId/receipt - generate/update receipt
router.put('/requests/:requestId/receipt', async (req, res) => {
  try {
    const { items, notes } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item is required in receipt' });
    }

    // Calculate totals
    const processedItems = items.map(item => ({
      itemName: item.itemName,
      quantity: Number(item.quantity),
      pricePerItem: Number(item.pricePerItem),
      totalPrice: Number(item.quantity) * Number(item.pricePerItem)
    }));
    const grandTotal = processedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const request = await Request.findOneAndUpdate(
      { requestId: req.params.requestId },
      {
        receipt: {
          items: processedItems,
          grandTotal,
          notes: notes || '',
          generatedAt: new Date()
        }
      },
      { new: true }
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, message: 'Receipt generated successfully', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─ MEDIA MANAGEMENT

// GET /api/owner/media - all media items
router.get('/media', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;
    const media = await Media.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/owner/media - add media item
router.post('/media', async (req, res) => {
  try {
    const { type, title, imageUrl, publicId, order } = req.body;
    if (!type || !imageUrl || !publicId) {
      return res.status(400).json({ success: false, message: 'Type, imageUrl, and publicId are required' });
    }
    const media = await Media.create({ type, title, imageUrl, publicId, order: order || 0, uploadedBy: req.user._id });
    res.status(201).json({ success: true, media });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/owner/media/:id - update media
router.put('/media/:id', async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/owner/media/:id
router.delete('/media/:id', async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

