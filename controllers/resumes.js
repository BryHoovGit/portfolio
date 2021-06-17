const Resume = require('../models/resume');

module.exports.index = async (req, res) => {
    const resumes = await Resume.find({});
    res.render('resumes/index', { resumes })
};

module.exports.renderNewForm = (req, res) => {
    res.render('resumes/new');
};

module.exports.createResume = async(req, res, next) => {
    const resume = new Resume(req.body.resume);
    resume.author = req.user._id;
    await resume.save();
    req.flash('success', 'Successfully created a new resumé!');
    res.redirect(`/resumes/${resume._id}`);
};

module.exports.showResume = async (req, res) => {
    const resume = await (await Resume.findById(req.params.id)).populate({
        path: 'resumes',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!resume) {
        req.flash('error', 'Cannot find that resumé!');
        return res.redirect('/resumes');
    }
    res.render('resumes/show', { resume });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if (!resume) {
        req.flash('error', 'Canot find that resumé!');
        return res.redirect('/resumes');
    }
    res.render('resumes/edit', { resume });
};

module.exports.updateResume = async(req, res) => {
    const { id } = req.params;
    const resume = await Resume.findByIdAndUpdate(id, { ...req.body.resume });
    req.flash('success', 'Sucessfully updated resumé!');
    res.redirect(`/resumes/${resume._id}`);
};

module.exports.deleteResume = async (req, res) => {
    const { id } = req.params;
    await Resume.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted resumé');
    res.redirect('/resumes');
};

