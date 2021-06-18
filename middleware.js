const { photoSchema, resumeSchema, designSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Resume = require('./models/resume');
const Photo = require('./models/photo');
const Design = require('./models/design');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateResume = (req, res, next) => {
    const { error } = resumeSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    if(!resume.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/resumes/${id}`);
    }
    next();
}

module.exports.isPhotoAuthor = async(req, res, next) => {
    const { id } = req.params;
    const photo = await Photo.findById(id);
    if (!photo.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/photography/${id}`)
    }
    next();
}

module.exports.isDesignAuthor = async(req, res, next) => {
    const { id } = req.params;
    const design = await Design.findById(id);
    if (!design.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/designs/${id}`)
    }
    next();
}

module.exports.validatePhoto = (req, res, next) => {
    const { error } = photoSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateDesign = (req, res, next) => {
    const { error } = designSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/')
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}