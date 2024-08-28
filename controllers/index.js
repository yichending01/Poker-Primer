exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Poker Primer',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
    });
}