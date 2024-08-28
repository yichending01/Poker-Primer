const User = require('../models/user');


exports.getGame01 = (req, res, next) => {
    res.render('game-01/game-01', {
        pageTitle: 'Drill',
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user
    });
}

exports.updateHighScore = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.json({newHighScore: false, highScore: 0});
    }

    const userId = req.session.user._id;
    const score = req.body.score;
    const gameMode = req.body.gameMode;
    const user = await User.findById(userId);
    if (gameMode === 0 && score > user.blitzHighScore) {
        user.blitzHighScore = score;
        await user.save();
        req.session.user = user;
        return res.json({newHighScore: true, highScore: user.blitzHighScore});
    } else if (gameMode === 1 && score > user.survivalHighScore) {
        user.survivalHighScore = score;
        await user.save();
        req.session.user = user;
        return res.json({newHighScore: true, highScore: user.survivalHighScore});
    } else if (gameMode === 2 && score < user.twentyHandsHighScore) {
        user.twentyHandsHighScore = score;
        await user.save();
        req.session.user = user;
        return res.json({newHighScore: true, highScore: user.twentyHandsHighScore});
    } else if (gameMode === 0) {
        return res.json({newHighScore: false, highScore: user.blitzHighScore});
    } else if (gameMode === 1) {
        return res.json({newHighScore: false, highScore: user.survivalHighScore});
    } else if (gameMode === 2) {
        return res.json({newHighScore: false, highScore: user.twentyHandsHighScore});
    }
}

