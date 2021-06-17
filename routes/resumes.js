const express = require('express');
const router = express();
const resumes = require('../controllers/resumes')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateResume } = require('../middleware');


router.route('/')
    .get(catchAsync(resumes.index))
    .post(isLoggedIn, validateResume, catchAsync(resumes.createResume))

router.get('/new', isLoggedIn, resumes.renderNewForm)

router.route('/:id')
    .get(catchAsync(resumes.showResume))
    .put(isLoggedIn, isAuthor, validateResume, catchAsync(resumes.updateResume))
    .delete(isLoggedIn, isAuthor, catchAsync(resumes.deleteResume))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(resumes.renderEditForm))

module.exports = router;