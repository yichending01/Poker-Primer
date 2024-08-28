const User = require('../models/user');

exports.getDashboard = (req, res, next) => {
    res.render('dashboard', {
        pageTitle: 'Dashboard',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user});
}