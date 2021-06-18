const Design = require('../models/design');
const Review = require('../models/review');
const Photo = require('../models/photo');

module.exports.createDesignReview = async (req, res) => {
    const design = await Design.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    design.reviews.push(review);
    await review.save();
    await design.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/designs/${design._id}`);
};

module.exports.deleteDesignReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Design.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/designs/${id}`);
};

module.exports.createPhotoReview = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    photo.reviews.push(review);
    await review.save();
    await photo.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/photography/${photo._id}`);
};

module.exports.deletePhotoReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Photo.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/photography/${id}`);
};