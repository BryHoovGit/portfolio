const Contact = require('../models/contact');

module.exports.index = async (req, res) => {
    const contacts = await Contact.find({});
    res.render('contact/index', { contacts })
};

module.exports.renderNewForm = (req, res) => {
    res.render('contact/new');
};

module.exports.createContact = async(req, res, next) => {
    const contact = new Contact(req.body.contact);
    contact.author = req.user._id;
    await contact.save();
    req.flash('success', 'Successfully sent a new contact request!');
    res.redirect(`/contact/${contact._id}`);
};

module.exports.showContact = async (req, res) => {
    const contact = await (await Contact.findById(req.params.id)).populate({
        path: 'contacts',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!contact) {
        req.flash('error', 'Cannot find that contact request!');
        return res.redirect('/contact');
    }
    res.render('contact/show', { contact });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
        req.flash('error', 'Canot find that contact request!');
        return res.redirect('/contacts');
    }
    res.render('contact/edit', { contact });
};

module.exports.updateContact = async(req, res) => {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, { ...req.body.contact });
    req.flash('success', 'Sucessfully updated contact request!');
    res.redirect(`/contact/${contact._id}`);
};

module.exports.deleteContact = async (req, res) => {
    const { id } = req.params;
    await contact.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted contact request');
    res.redirect('/contact');
};

