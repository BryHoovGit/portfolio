const Contact = require('../models/contact');

module.exports.index = async (req, res) => {
    const contacts = await contact.find({});
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
    res.redirect('/');
};

module.exports.showContact = async (req, res) => {
    const contact = await (Contact.findById(req.params.id)).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if(!contact) {
        req.flash('error', 'Cannot find that contact!');
        return res.redirect('/contacts');
    }
    res.render('contacts/show', { contact });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id);
    if (!contact) {
        req.flash('error', 'Canot find that contact!');
        return res.redirect('/contacts');
    }
    res.render('contacts/edit', { contact });
};

module.exports.updateContact = async(req, res) => {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(id, { ...req.body.contact });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    contact.images.push(...imgs);
    await contact.save();
    if(req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await contact.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Sucessfully updated contact!');
    res.redirect(`/contacts/${contact._id}`);
};

module.exports.deleteContact = async (req, res) => {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted contact');
    res.redirect('/contacts');
};















