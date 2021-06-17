const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const photos = require('../controllers/photos');
const { validatePhoto, isLoggedIn, isPhotoAuthor } = require('../middleware');
const multer = require('multer');
const { photographyStorage } = require('../cloudinary')
const upload = multer({ storage: photographyStorage });

const Photo = require('../models/photo');

router.route('/')
    .get(catchAsync(photos.index))
    .post(isLoggedIn, upload.array('image'), validatePhoto, catchAsync(photos.createPhoto))

router.get('/new', isLoggedIn, photos.renderNewForm)

router.route('/:id')
    .get(catchAsync(photos.showPhoto))
    .put(isLoggedIn, isPhotoAuthor, upload.array('image'), validatePhoto, catchAsync(photos.updatePhoto))
    .delete(isLoggedIn, isPhotoAuthor, catchAsync(photos.deletePhoto))

router.get('/:id/edit', isLoggedIn, isPhotoAuthor, catchAsync(photos.renderEditForm))

module.exports = router;