const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/cloudinary.middleware');

// POST /api/upload/file - general file upload
router.post('/file', (req, res, next) => {
  req.uploadFolder = 'gyandayini/uploads';
  next();
}, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({
    success: true,
    url: req.file.path,
    publicId: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype
  });
});

// POST /api/upload/template-preview - template image
router.post('/template-preview', (req, res, next) => {
  req.uploadFolder = 'gyandayini/templates';
  next();
}, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, url: req.file.path, publicId: req.file.filename });
});

// POST /api/upload/payment-screenshot
router.post('/payment-screenshot', (req, res, next) => {
  req.uploadFolder = 'gyandayini/payments';
  next();
}, upload.single('screenshot'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, url: req.file.path, publicId: req.file.filename });
});

// POST /api/upload/docs - multiple docs upload
router.post('/docs', (req, res, next) => {
  req.uploadFolder = 'gyandayini/documents';
  next();
}, upload.array('docs', 5), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No files uploaded' });
  const files = req.files.map(f => ({ url: f.path, publicId: f.filename, name: f.originalname }));
  res.json({ success: true, files });
});

module.exports = router;
