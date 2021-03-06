const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const photos = require('../controllers/photos');
const { validatePhoto, isLoggedIn, isPhotoAuthor, isAdmin } = require('../middleware');
const multer = require('multer');
const { photographyStorage } = require('../cloudinary')
const upload = multer({ storage: photographyStorage });

const Photo = require('../models/photo');

router.route('/')
    .get(catchAsync(photos.index))
    .post(isLoggedIn, isAdmin, upload.array('image'), validatePhoto, catchAsync(photos.createPhoto))

router.get('/new', isLoggedIn, isAdmin, photos.renderNewForm)

router.route('/:id')
    .get(catchAsync(photos.showPhoto))
    .put(isLoggedIn, isAdmin, isPhotoAuthor, upload.array('image'), validatePhoto, catchAsync(photos.updatePhoto))
    .delete(isLoggedIn, isAdmin, isPhotoAuthor, catchAsync(photos.deletePhoto))

router.get('/:id/edit', isLoggedIn, isAdmin, isPhotoAuthor, catchAsync(photos.renderEditForm))

module.exports = router;