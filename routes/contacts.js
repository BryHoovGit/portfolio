const express = require('express');
const router = express();
const catchAsync = require('../utils/catchAsync');
const contacts = require('../controllers/contacts');
const { validateContact, isLoggedIn, isContactAuthor, isAdmin } = require('../middleware');

const Contact = require('../models/contact');

router.route('/')
    .get(isLoggedIn, isAdmin, catchAsync(contacts.index))
    .post(isLoggedIn, validateContact, catchAsync(contacts.createContact))

router.get('/new', contacts.renderNewForm)

router.route('/:id')
    .get(isLoggedIn, isAdmin, catchAsync(contacts.showContact))
    .put(isLoggedIn, isAdmin, validateContact,  catchAsync(contacts.updateContact))
    .delete(isLoggedIn, isAdmin, catchAsync(contacts.deleteContact))

router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(contacts.renderEditForm))

module.exports = router;