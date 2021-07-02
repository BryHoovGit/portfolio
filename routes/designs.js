const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const designs = require('../controllers/designs');
const { validateDesign, isLoggedIn, isDesignAuthor, isAdmin } = require('../middleware');
const multer = require('multer');
const { designStorage } = require('../cloudinary')

const upload = multer({ storage: designStorage });

const Design = require('../models/design');

router.route('/')
    .get(catchAsync(designs.index))
    .post(isLoggedIn, isAdmin, upload.array('image'), validateDesign, catchAsync(designs.createDesign))

router.route('/commercial')
    .get(catchAsync(designs.commercial))
    

router.route('/commissions')
    .get(catchAsync(designs.commissions))
    

router.get('/new', isLoggedIn, isAdmin, designs.renderNewForm)

router.route('/:id')
    .get(catchAsync(designs.showDesign))
    .put(isLoggedIn, isAdmin, isDesignAuthor, upload.array('image'), validateDesign, catchAsync(designs.updateDesign))
    .delete(isLoggedIn, isAdmin, isDesignAuthor, catchAsync(designs.deleteDesign))

router.get('/:id/edit', isLoggedIn, isAdmin, isDesignAuthor, catchAsync(designs.renderEditForm))

module.exports = router;