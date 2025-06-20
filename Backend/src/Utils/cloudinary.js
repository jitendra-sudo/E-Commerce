const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ShopSutra',
        allowed_formats: ['jpg', 'png', 'jpeg' , 'webp', 'gif', 'avif','mp4' , 'mov', 'avi', 'mkv', 'webm'],
    }
});

const upload = multer({ storage: storage });

const uploadImage = (req, res, next) => {
      const single = upload.single('file');

    single(req, res, (err) => {
        if (err) {
            console.error('Error uploading image:', err);
            return res.status(500).json({ error: 'Image upload failed' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        req.imageUrl = req.file.path; 
        next();
    } ); }


module.exports = uploadImage;