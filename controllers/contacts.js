const Contact = require('../models/contact');

module.exports.index = async (req, res) => {
    const contacts = await Contact.find({});
    res.render('contacts/index', { contacts })
};

module.exports.renderNewForm = (req, res) => {
    res.render('contacts/new');
};

module.exports.createContact = async (req, res, next) => {
    const contact = new Contact(req.body.contact);
    contact.author = req.user._id;
    await contact.save();
    req.flash('success', 'Sucessfully sent contact request!');
    res.redirect(`/contact/${contact._id}`);
};

module.exports.showContact = async (req, res) => {
    const contact = await Contact.findById(req.params.id).populate('author');
    if(!contact) {
        req.flash('error', 'Cannot find that contact!');
        return res.redirect('/contact');
    }
    res.render('contacts/show', { contact });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
        req.flash('error', 'Canot find that contact!');
        return res.redirect('/contact');
    }
    res.render('contacts/edit', { contact });
};

module.exports.updateContact = async(req, res) => {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, { ...req.body.contact });
    await contact.save();
    req.flash('success', 'Sucessfully updated contact!');
    res.redirect(`/contact/${contact._id}`);
};

module.exports.deleteContact = async (req, res) => {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted contact!');
    res.redirect('/contact');
};















