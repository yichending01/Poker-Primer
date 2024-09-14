const bcrypt = require('bcryptjs');

const expValidator = require('express-validator');


const { csrfSync } = require('csrf-sync');
const { generateToken } = csrfSync();

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
        csrfToken: res.locals.csrfToken,
        errorMessage: null,
        oldInput: {
            email: "",
            password: ""
        },
        validationErrors: []
    })
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
        errorMessage: null,
        oldInput: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = expValidator.validationResult(req);
    if (!errors.isEmpty()) {
        let oldEmail;
        if (email === "@") { oldEmail = ""; } else { oldEmail = email;}
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            isLoggedIn: req.session.isLoggedIn,
            user: req.session.user,
            csrfToken: res.locals.csrfToken,
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: oldEmail,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    isLoggedIn: req.session.isLoggedIn,
                    user: req.session.user,
                    csrfToken: res.locals.csrfToken,
                    errorMessage: 'Invalid email or password.',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: [{path: 'email'}]
                });
            }

            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        // Regenerate the session to ensure a new session ID
                        req.session.regenerate(err => {
                            if (err) {
                                console.log('Error regenerating session:', err);
                                return res.redirect('/login');
                            }

                            // Set session variables for authenticated user
                            req.session.isLoggedIn = true;
                            req.session.user = user;

                            // Generate a new CSRF token for the new session
                            req.session.csrfToken = generateToken(req);

                            return req.session.save(err => {
                                if (err) {
                                    console.log('Error saving session:', err);
                                    return res.redirect('/login');
                                }
                                res.redirect('/');
                            });
                        });
                    } else {
                        return res.status(422).render('auth/login', {
                            pageTitle: 'Login',
                            isLoggedIn: req.session.isLoggedIn,
                            user: req.session.user,
                            csrfToken: res.locals.csrfToken,
                            errorMessage: 'Invalid email or password.',
                            oldInput: {
                                email: email,
                                password: password
                            },
                            validationErrors: [{path: 'email'}]
                        });
                    }
                })
                .catch(err => {
                    console.log('Error comparing passwords:', err);
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log('Error finding user:', err);
            res.redirect('/login');
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = expValidator.validationResult(req);
    if (!errors.isEmpty()) {
        let oldEmail;
        if (email === "@") { oldEmail = ""; } else { oldEmail = email;}
        return res.status(422).render('auth/signup', {
        pageTitle: 'Signup',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
        errorMessage: errors.array()[0].msg,
        oldInput: { email: oldEmail, password: password, confirmPassword: req.body.confirmPassword},
        validationErrors: errors.array()
    })
    }
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                blitzHighScore: 0,
                survivalHighScore: 0,
                twentyHandsHighScore: 10000,
                WYHblitzHighScore: 0,
                WYHsurvivalHighScore: 0
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
}

