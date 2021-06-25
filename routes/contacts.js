const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const contacts = require('../controllers/contacts');
const { validateContact, isLoggedIn, isContactAuthor } = require('../middleware');
const multer = require('multer');

router.route('/')
    .get(isLoggedIn, (contacts.renderNewForm))
    .post(isLoggedIn, validateContact, catchAsync(contacts.createContact))

router.get('/view', isLoggedIn, catchAsync(contacts.index))

router.route('/:id')
    .get(catchAsync(contacts.showContact))
    .put(isLoggedIn, isContactAuthor, validateContact, catchAsync(contacts.updateContact))
    .delete(isLoggedIn, isContactAuthor, catchAsync(contacts.deleteContact))

router.get('/:id/edit', isLoggedIn, isContactAuthor, catchAsync(contacts.renderEditForm))

module.exports = router;