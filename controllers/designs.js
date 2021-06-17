const Design = require('../models/design');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const designs = await Design.find({});
    res.render('designs/index', { designs })
};

module.exports.commercial = async (req, res) => {
    const designs = await Design.find({});
    res.render('designs/commercial', { designs })
};

module.exports.commissions = async (req, res) => {
    const designs = await Design.find({});
    res.render('designs/commissions', { designs })
};

module.exports.renderNewForm = (req, res) => {
    res.render('designs/new');
};

module.exports.createDesign = async(req, res, next) => {
    const design = new Design(req.body.design);
    const categoryCommercial = document.querySelector('#commercial')
    design.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    design.author = req.user._id;
    if(!categoryCommercial){
        
    } else {
        
    }
    console.log(categoryCommerical, design)
    await design.save();
    req.flash('success', 'Successfully created a new design!');
    res.redirect(`/designs/${design._id}`);
};

module.exports.showDesign = async (req, res) => {
    const design = await (Design.findById(req.params.id)).populate({
        path: 'designs',
        populate: {
            path: 'author',
            path: 'category'
        }
    }).populate('author').populate('category');
    if(!design) {
        req.flash('error', 'Cannot find that design!');
        return res.redirect('/designs');
    }
    res.render('designs/show', { design });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const design = await Design.findByIdAndUpdate(id);
    if (!design) {
        req.flash('error', 'Canot find that design!');
        return res.redirect('/designs');
    }
    res.render('designs/edit', { design });
};

module.exports.updateDesign = async(req, res) => {
    const { id } = req.params;
    const design = await Design.findByIdAndUpdate(id, { ...req.body.design });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    design.images.push(...imgs);
    await design.save();
    if(req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await design.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Sucessfully updated design!');
    res.redirect(`/designs/${design._id}`);
};

module.exports.deleteDesign = async (req, res) => {
    const { id } = req.params;
    await Design.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted design');
    res.redirect('/designs');
};

