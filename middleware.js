const { photoSchema, developmentSchema, designSchema, reviewSchema, contactSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Development = require('./models/development');
const Photo = require('./models/photo');
const Design = require('./models/design');
const Review = require('./models/review');
const Contact = require('./models/contact');
const User = require('./models/user')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isContactAuthor = async(req, res, next) => {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/contact/${id}`)
    }
    next();
}

module.exports.validateContact = (req, res, next) => {
    const { error } = contactSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const development = await Development.findById(id);
    if(!development.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/development/${id}`);
    }
    next();
}

module.exports.isAdmin = async(req, res, next) => {
    if(!req.user) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/');
    }
    if(req.user.role !== 'Admin') {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/');
    }
    next();
}

module.exports.validateDevelopment = (req, res, next) => {
    const { error } = developmentSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
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
