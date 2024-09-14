const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { csrfSync } = require('csrf-sync');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.u68b6.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});


app.use(bodyParser.urlencoded({ extended: false }));

const {
    invalidCsrfTokenError, 
    generateToken, 
  } = csrfSync();

const { csrfSynchronisedProtection } = csrfSync({
getTokenFromRequest: (req) => {
    return req.body["_csrf"];
}, // Used to retrieve the token submitted by the user in a form
});

module.exports = csrfSynchronisedProtection;



app.set('view engine', 'ejs');
app.set('views', 'views');

const indexRoutes = require('./routes/index');
const drillRoutes = require('./routes/drills');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const toolRoutes = require('./routes/tools');
const articleRoutes = require('./routes/articles');


app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store: store}));

app.use(flash());

app.use((req, res, next) => {
    res.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = generateToken(req);
    next();
});




app.use(indexRoutes);
app.use(drillRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(toolRoutes);
app.use(articleRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});

mongoose
    .connect(
        MONGODB_URI
    )
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });




