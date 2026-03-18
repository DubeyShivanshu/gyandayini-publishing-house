const express = require('express');
const router = express.Router();
const { sendEmailOTP, verifyEmailOTP } = require('../utils/otp.util');

// POST /api/otp/send-email
router.post('/send-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }
    const result = await sendEmailOTP(email.toLowerCase().trim());
    res.json({ success: true, message: 'OTP sent to your email address', ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/otp/verify-email
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    const result = await verifyEmailOTP(email.toLowerCase().trim(), otp.trim());
    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

