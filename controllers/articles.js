exports.getHandRankingsArticle = (req, res, next) => {
    res.render('articles/hand-rankings', {
        pageTitle: 'Hand Rankings',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user});
}

exports.getHowToPlayPokerArticle = (req, res, next) => {
    res.render('articles/how-to-play-poker', {
        pageTitle: 'How to Play Poker',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user});
}

exports.getPokerLingoArticle = (req, res, next) => {
    res.render('articles/poker-lingo', {
        pageTitle: 'Poker Lingo',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user});
}