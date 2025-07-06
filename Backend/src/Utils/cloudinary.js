const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ShopSutra',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'avif', 'mp4', 'mov', 'avi', 'mkv', 'webm'],
  }
});

const upload = multer({ storage });

module.exports = upload; 
