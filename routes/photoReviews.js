const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Photo = require('../models/photo')
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createPhotoReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deletePhotoReview))

module.exports = router;