const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const designs = require('../controllers/designs');
const { validateDesign, isLoggedIn, isDesignAuthor, storageSelect } = require('../middleware');
const multer = require('multer');
const { designStorage } = require('../cloudinary')

const upload = multer({ storage: designStorage });

const Design = require('../models/design');

router.route('/')
    .get(catchAsync(designs.index))
    .post(isLoggedIn, upload.array('image'), validateDesign, catchAsync(designs.createDesign))

router.route('/commercial')
    .get(catchAsync(designs.commercial))
    

router.route('/commissions')
    .get(catchAsync(designs.commissions))
    

router.get('/new', isLoggedIn, designs.renderNewForm)

router.route('/:id')
    .get(catchAsync(designs.showDesign))
    .put(isLoggedIn, isDesignAuthor, validateDesign, catchAsync(designs.updateDesign))
    .delete(isLoggedIn, isDesignAuthor, catchAsync(designs.deleteDesign))

router.get('/:id/edit', isLoggedIn, isDesignAuthor, catchAsync(designs.renderEditForm))

module.exports = router;