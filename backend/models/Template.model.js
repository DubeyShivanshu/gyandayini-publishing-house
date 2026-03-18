const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
  fieldKey: { type: String, required: true },
  labelHindi: { type: String },
  labelEnglish: { type: String, required: true },
  type: { type: String, enum: ['text', 'textarea', 'date', 'number', 'select'], default: 'text' },
  options: [String],
  required: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
});

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['marriage', 'birthday', 'anniversary', 'death', 'other'], required: true },
  previewImageUrl: { type: String, required: true },
  previewImagePublicId: String,
  thumbnailUrl: String,
  language: { type: String, enum: ['hindi', 'english', 'both'], default: 'hindi' },
  basePrice: { type: Number, required: true },
  pricePerUnit: { type: Number },
  formFields: [formFieldSchema],
  isActive: { type: Boolean, default: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

templateSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Template', templateSchema);
