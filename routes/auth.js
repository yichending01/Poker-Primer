const path = require('path');

const express = require('express');

const expValidator = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const csrfSynchronisedProtection = require('../app.js'); 

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', csrfSynchronisedProtection, [
    expValidator.body('email')
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail()
], authController.postLogin);

router.post('/signup', csrfSynchronisedProtection, 
    [
    expValidator.check('email')
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom((val, { req }) => {
            return User.findOne({email: val})
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email exists already.');
                }
            });
        })
        .normalizeEmail(), 
    expValidator.check('password', "Enter a password at least 10 characters long").isLength({min: 10}),
    expValidator.body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match!')
        }
        return true;
    })
    ],
    authController.postSignup);

router.post('/logout', csrfSynchronisedProtection, authController.postLogout);

module.exports = router;

