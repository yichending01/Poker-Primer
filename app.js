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
// const morgan = require('morgan');

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
    invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
    generateToken, // Use this in your routes to generate, store, and get a CSRF token.
    getTokenFromRequest, // use this to retrieve the token submitted by a user
    getTokenFromState, // The default method for retrieving a token from state.
    storeTokenInState, // The default method for storing a token in state.
    revokeToken, // Revokes/deletes a token by calling storeTokenInState(undefined)
 // This is the default CSRF protection middleware.
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
const game01Routes = require('./routes/game-01');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const handEvaluatorRoutes = require('./routes/hand-evaluator')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(helmet());
app.use(compression());
// app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use(flash());

app.use((req, res, next) => {
    res.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = generateToken(req);
    next();
});




app.use(indexRoutes);
app.use(game01Routes);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(handEvaluatorRoutes);

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




