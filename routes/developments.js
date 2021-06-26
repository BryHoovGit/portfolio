const express = require('express');
const router = express();
const catchAsync = require('../utils/catchAsync');
const developments = require('../controllers/developments')
const { validateDevelopment, isLoggedIn, isAuthor } = require('../middleware');
const multer = require('multer');
const { webDevStorage } = require('../cloudinary')

const Development = require('../models/development');

const upload = multer({ storage: webDevStorage });

router.route('/')
    .get(catchAsync(developments.index))
    .post(isLoggedIn, upload.array('image'), validateDevelopment, catchAsync(developments.createDevelopment))

router.get('/new', isLoggedIn, developments.renderNewForm)

router.route('/:id')
    .get(catchAsync(developments.showDevelopment))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateDevelopment, catchAsync(developments.updateDevelopment))
    .delete(isLoggedIn, isAuthor, catchAsync(developments.deleteDevelopment))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(developments.renderEditForm))

module.exports = router;