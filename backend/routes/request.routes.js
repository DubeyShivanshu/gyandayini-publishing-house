const express = require('express');
const router = express.Router();
const Request = require('../models/Request.model');
const { protect } = require('../middleware/auth.middleware');

// POST /api/requests - create new request
router.post('/', async (req, res) => {
  try {
    const { type, customerName, customerPhone, customerEmail, printing, govtForm, cardPrinting, userId } = req.body;

    const request = await Request.create({
      type, customerName, customerPhone, customerEmail,
      printing, govtForm, cardPrinting, userId
    });

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully',
      requestId: request.requestId,
      request
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/requests/track - track by requestId + phone (no auth required)
router.get('/track', async (req, res) => {
  try {
    const { requestId, phone } = req.query;
    if (!requestId || !phone) {
      return res.status(400).json({ success: false, message: 'Request ID and phone are required' });
    }
    const request = await Request.findOne({ requestId: requestId.trim().toUpperCase(), customerPhone: phone.trim() })
      .populate('cardPrinting.templateId', 'name category previewImageUrl');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found. Check ID and phone number.' });
    }
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/requests/my - get logged-in user's requests
router.get('/my', protect, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

