const Development = require('../models/development');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const development = await Development.find({});
    res.render('developments/index', { development })
};

module.exports.renderNewForm = (req, res) => {
    res.render('developments/new');
};

module.exports.createDevelopment = async (req, res, next) => {
    const development = new Development(req.body.development);
    development.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    development.author = req.user._id;
    await development.save();
    req.flash('success', 'Successfully created a new project!');
    res.redirect(`/development/${development._id}`);
};

module.exports.showDevelopment = async (req, res) => {
    const development = await Development.findById(req.params.id).populate('author');
    if(!development) {
        req.flash('error', 'Cannot find that project!');
        return res.redirect('/developments');
    }
    res.render('developments/show', { development });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const development = await Development.findById(id);
    if (!development) {
        req.flash('error', 'Canot find that resumé!');
        return res.redirect('/developments');
    }
    res.render('developments/edit', { development });
};

module.exports.updateDevelopment = async (req, res) => {
    const { id } = req.params;
    const development = await Development.findByIdAndUpdate(id, { ...req.body.development });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    development.images.push(...imgs);
    await development.save();
    if(req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await development.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Sucessfully updated project!');
    res.redirect(`/development/${development._id}`);
};

module.exports.deleteDevelopment = async (req, res) => {
    const { id } = req.params;
    await Development.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted project!');
    res.redirect('/development');
};

