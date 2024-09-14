exports.getHandEvaluator = (req, res, next) => {
    res.render('tools/hand-evaluator', {
        pageTitle: 'Hand Evaluator',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user});
}

exports.getOddsCalculator = (req, res, next) => {
    res.render('tools/odds-calculator', {
        pageTitle: 'Odds Calculator',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user});
}