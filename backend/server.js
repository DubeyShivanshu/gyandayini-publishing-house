const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/requests', require('./routes/request.routes'));
app.use('/api/templates', require('./routes/template.routes'));
app.use('/api/otp', require('./routes/otp.routes'));
app.use('/api/captcha', require('./routes/captcha.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/owner', require('./routes/owner.routes'));
app.use('/api/media', require('./routes/media.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Gyandayini API running', timestamp: new Date() });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

