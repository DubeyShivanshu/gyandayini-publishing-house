const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = req.uploadFolder || 'gyandayini/uploads';
    const isPdf = file.mimetype === 'application/pdf';
    return {
      folder,
      resource_type: isPdf ? 'raw' : 'image',
      allowed_formats: isPdf ? ['pdf'] : ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: isPdf ? [] : [{ width: 1920, quality: 'auto', fetch_format: 'auto' }]
    };
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete error:', err);
  }
};

module.exports = { cloudinary, upload, deleteFile };
