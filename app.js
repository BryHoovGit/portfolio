if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const multiparty = require('multiparty');
const nodemailer = require('nodemailer');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const Contact = require('./models/contact');

const userRoutes = require('./routes/users')
const resumeRoutes = require('./routes/resumes');
const photoRoutes = require('./routes/photos');
const designRoutes = require('./routes/designs');
const photoReviewRoutes = require('./routes/photoReviews');
const designReviewRoutes = require('./routes/designRoutes');

mongoose.connect('mongodb://localhost:27017/portfolio', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if(!['/login','/register'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes)
app.use('/resumes', resumeRoutes);
app.use('/photography', photoRoutes);
app.use('/designs', designRoutes);
app.use('/designs/:id/reviews', designReviewRoutes);
app.use('/photography/:id/reviews', photoReviewRoutes);
// app.use('/contact', contactRoutes);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  
transporter.verify(function (error, success) {
if (error) {
    console.log(error);
} else {
    console.log("Server is ready to take our messages");
}
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/contact', async(req, res) => {
    const contacts = await Contact.find({});
    res.render('contact', { contacts });
});

app.post('/contact/send', async (req, res, next) => {
    const contact = new Contact(req.body.contact);
    contact.author = req.user._id;
    await contact.save();
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function (err, fields) {
        console.log(fields);
        Object.keys(fields).forEach(function (property) {
            data[property] = fields[property].toString();
        });
        const mail = {
            from: contact.name,
            to: process.env.EMAIL,
            email: contact.email,
            phoneNumber: contact.phoneNumber,
            message: contact.message
        };
      
        transporter.sendMail(mail, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send('Something went wrong.');
            } else {
                res.status(200).send('Contact email sent!')
            }
        });
        req.flash('success', 'Sucessfully sent contact request!');
        res.redirect('/');
    });
});

app.get('/resume', (req, res) => {
    res.render('resumes/myResume')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});