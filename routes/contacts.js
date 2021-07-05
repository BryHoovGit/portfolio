const express = require('express');
const router = express();
const catchAsync = require('../utils/catchAsync');
const contacts = require('../controllers/contacts');
const { validateContact, isLoggedIn, isContactAuthor, isAdmin } = require('../middleware');

const Contact = require('../models/contact');

router.route('/')
    .get(isLoggedIn, catchAsync(contacts.index))
    .post(isLoggedIn, validateContact, catchAsync(contacts.createContact))

router.get('/new', isLoggedIn, contacts.renderNewForm)

router.route('/:id')
    .get(isLoggedIn, isContactAuthor, catchAsync(contacts.showContact))
    .put(isLoggedIn, isContactAuthor, validateContact, catchAsync(contacts.updateContact))
    .delete(isLoggedIn, isContactAuthor, catchAsync(contacts.deleteContact))

router.get('/:id/edit', isLoggedIn, isContactAuthor, catchAsync(contacts.renderEditForm))

module.exports = router;