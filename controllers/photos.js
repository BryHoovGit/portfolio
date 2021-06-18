const Photo = require('../models/photo');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const photos = await Photo.find({});
    res.render('photography/index', { photos })
};

module.exports.renderNewForm = (req, res) => {
    res.render('photography/new');
};

module.exports.createPhoto = async(req, res, next) => {
    const photo = new Photo(req.body.photo);
    photo.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    photo.author = req.user._id;
    await photo.save();
    req.flash('success', 'Successfully created a new image!');
    res.redirect(`/photography/${photo._id}`);
};

module.exports.showPhoto = async (req, res) => {
    const photo = await (Photo.findById(req.params.id)).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!photo) {
        req.flash('error', 'Cannot find that image!');
        return res.redirect('/photography');
    }
    res.render('photography/show', { photo });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const photo = await Photo.findById(id);
    if (!photo) {
        req.flash('error', 'Canot find that image!');
        return res.redirect('/photography');
    }
    res.render('photography/edit', { photo });
};

module.exports.updatePhoto = async(req, res) => {
    const { id } = req.params;
    const photo = await Photo.findByIdAndUpdate(id, { ...req.body.photo });
    if (req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        photo.images.push(...imgs);
    }
    await photo.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await photo.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Sucessfully updated image!');
    res.redirect(`/photography/${photo._id}`);
};

module.exports.deletePhoto = async (req, res) => {
    const { id } = req.params;
    const photo = await Photo.findByIdAndDelete(id);
    for(let image of photo.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
    req.flash('success', 'Sucessfully deleted image');
    res.redirect('/photography');
};

