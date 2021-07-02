const express = require('express');
const router = express();
const catchAsync = require('../utils/catchAsync');
const developments = require('../controllers/developments')
const { validateDevelopment, isLoggedIn, isAuthor, isAdmin } = require('../middleware');
const multer = require('multer');
const { webDevStorage } = require('../cloudinary')

const Development = require('../models/development');

const upload = multer({ storage: webDevStorage });

router.route('/')
    .get(catchAsync(developments.index))
    .post(isLoggedIn, isAdmin, upload.array('image'), validateDevelopment, catchAsync(developments.createDevelopment))

router.get('/new', isLoggedIn, isAdmin, developments.renderNewForm)

router.route('/:id')
    .get(catchAsync(developments.showDevelopment))
    .put(isLoggedIn, isAdmin, isAuthor, upload.array('image'), validateDevelopment, catchAsync(developments.updateDevelopment))
    .delete(isLoggedIn, isAdmin, isAuthor, catchAsync(developments.deleteDevelopment))

router.get('/:id/edit', isLoggedIn, isAdmin, isAuthor, catchAsync(developments.renderEditForm))

module.exports = router;