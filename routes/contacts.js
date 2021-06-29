const express = require('express');
const router =express();
const catchAsync = require('../utils/catchAsync');
const contacts = require('../controllers/contacts');
const { validateContact, isLoggedIn, isContactAuthor } = require('../middleware');

const Contact = require('../models/contact');

router.route('/')
    .get(isLoggedIn, contacts.renderNewForm)
    .post(isLoggedIn, validateContact, catchAsync(contacts.createContact))

router.get('/view', isLoggedIn, catchAsync(contacts.index))

router.route('/:id')
    .get(isLoggedIn, isContactAuthor, catchAsync(contacts.showContact))
    .put(isLoggedIn, isContactAuthor, validateContact, catchAsync(contacts.updateContact))
    .delete(isLoggedIn, isContactAuthor, catchAsync(contacts.deleteContact))

router.get('/:id/edit', isLoggedIn, isContactAuthor, catchAsync(contacts.renderEditForm))

module.exports = router;