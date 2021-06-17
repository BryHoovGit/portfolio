const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const designStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Design',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

const photographyStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Photography',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    designStorage,
    photographyStorage
}