const mongoose = require('mongoose');

// Receipt line item schema
const receiptItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  pricePerItem: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
}, { _id: false });

const requestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    default: () => 'GYD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    unique: true
  },
  type: {
    type: String,
    enum: ['printing', 'govt_form', 'card_printing', 'photo_frame'],
    required: true
  },
  // 3-step status only
  status: {
    type: String,
    enum: ['pending', 'payment_received', 'completed'],
    default: 'pending'
  },

  // Customer info
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Printing / Photo Frame fields
  printing: {
    fileUrl: String,
    filePublicId: String,
    fileType: { type: String, enum: ['image', 'pdf', 'other'] },
    size: String,
    quantity: { type: Number, default: 1 },
    paperType: String,
    colorMode: { type: String, enum: ['color', 'black_white'], default: 'color' },
    instructions: String
  },

  // Govt Form fields
  govtForm: {
    formType: { type: String, enum: ['pan', 'aadhaar', 'domicile', 'income', 'caste', 'birth', 'death', 'other'] },
    formDetails: { type: mongoose.Schema.Types.Mixed },
    uploadedDocs: [{ url: String, publicId: String, name: String }]
  },

  // Card Printing fields
  cardPrinting: {
    category: { type: String, enum: ['marriage', 'birthday', 'anniversary', 'death', 'other'] },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    formData: { type: mongoose.Schema.Types.Mixed },
    language: { type: String, enum: ['hindi', 'english', 'both'], default: 'hindi' },
    quantity: { type: Number, default: 100 }
  },

  // Receipt - set by owner
  receipt: {
    items: [receiptItemSchema],
    grandTotal: { type: Number, default: 0 },
    notes: String,
    generatedAt: Date
  },

  // Owner notes
  ownerNotes: String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

requestSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Request', requestSchema);
