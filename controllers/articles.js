exports.getHandRankingsArticle = (req, res, next) => {
    res.render('articles/hand-rankings', {
        pageTitle: 'Hand Rankings',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user});
}