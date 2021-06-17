const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const designs = require('../controllers/designs');
const { validateDesign, isLoggedIn, isDesignAuthor } = require('../middleware');
const multer = require('multer');
const { designStorage, commercialStorage, commissionStorage } = require('../cloudinary')
const upload = multer({ storage: designStorage });
const uploadCommercial = multer({storage: commercialStorage});
const uploadCommission = multer({storage: commissionStorage});

const Design = require('../models/design');

router.route('/')
    .get(catchAsync(designs.index))
    .post(isLoggedIn, upload.array('image'), validateDesign, catchAsync(designs.createDesign))

router.route('/commercial')
    .get(catchAsync(designs.commercial))
    .post(isLoggedIn, uploadCommercial.array('image'), validateDesign, catchAsync(designs.createDesign))

router.route('/commissions')
    .get(catchAsync(designs.commissions))
    .post(isLoggedIn, uploadCommission.array('image'), validateDesign, catchAsync(designs.createDesign))

router.get('/new', isLoggedIn, designs.renderNewForm)

router.route('/:id')
    .get(catchAsync(designs.showDesign))
    .put(isLoggedIn, isDesignAuthor, validateDesign, catchAsync(designs.updateDesign))
    .delete(isLoggedIn, isDesignAuthor, catchAsync(designs.deleteDesign))

router.get('/:id/edit', isLoggedIn, isDesignAuthor, catchAsync(designs.renderEditForm))

module.exports = router;