const User = require('../models/user');


exports.getWhatsYourHand = (req, res, next) => {
    res.render('drills/whats-your-hand', {
        pageTitle: "What's Your Hand?",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user
    });
}

exports.updateHighScore = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.json({newHighScore: false, highScore: "Login to save your high score!"});
    }

    const userId = req.session.user._id;
    const score = req.body.score;
    const gameMode = req.body.gameMode;
    const user = await User.findById(userId);
    if (gameMode === 0 && score > user.WYHblitzHighScore) {
        user.WYHblitzHighScore = score;
        await user.save();
        req.session.user = user;
        return res.json({newHighScore: true, highScore: user.WYHblitzHighScore});
    } else if (gameMode === 1 && score > user.WYHsurvivalHighScore) {
        user.WYHsurvivalHighScore = score;
        await user.save();
        req.session.user = user;
        return res.json({newHighScore: true, highScore: user.WYHsurvivalHighScore});
    } else if (gameMode === 0) {
        return res.json({newHighScore: false, highScore: user.WYHblitzHighScore});
    } else if (gameMode === 1) {
        return res.json({newHighScore: false, highScore: user.WYHsurvivalHighScore});
    }
}