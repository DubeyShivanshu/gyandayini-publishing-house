const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha');

const captchaStore = new Map(); // In production, use Redis

// GET /api/captcha/generate
router.get('/generate', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 3,
    color: true,
    background: '#f5f0e8'
  });
  const id = Date.now().toString() + Math.random().toString(36).substring(2);
  captchaStore.set(id, { text: captcha.text.toLowerCase(), expiresAt: Date.now() + 5 * 60 * 1000 });
  
  // Cleanup expired
  for (const [key, val] of captchaStore.entries()) {
    if (Date.now() > val.expiresAt) captchaStore.delete(key);
  }

  res.json({ success: true, captchaId: id, svg: captcha.data });
});

// POST /api/captcha/verify
router.post('/verify', (req, res) => {
  const { captchaId, answer } = req.body;
  const stored = captchaStore.get(captchaId);
  
  if (!stored) return res.status(400).json({ success: false, message: 'Captcha expired or invalid' });
  if (Date.now() > stored.expiresAt) {
    captchaStore.delete(captchaId);
    return res.status(400).json({ success: false, message: 'Captcha expired' });
  }
  if (answer.toLowerCase() !== stored.text) {
    return res.status(400).json({ success: false, message: 'Incorrect captcha' });
  }
  
  captchaStore.delete(captchaId);
  res.json({ success: true, message: 'Captcha verified' });
});

module.exports = router;
