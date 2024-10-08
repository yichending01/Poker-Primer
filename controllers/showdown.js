const User = require('../models/user');


exports.getShowdown = (req, res, next) => {
    res.render('drills/showdown', {
        pageTitle: 'Showdown',
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
        // convert to time
        let m = parseInt(score / 60, 10);
        let s = parseInt(score % 60, 10);
        s = s < 10 ? "0" + s : s;
        return res.json({newHighScore: true, highScore: m + ":" + s});
    } else if (gameMode === 0) {
        return res.json({newHighScore: false, highScore: user.blitzHighScore});
    } else if (gameMode === 1) {
        return res.json({newHighScore: false, highScore: user.survivalHighScore});
    } else if (gameMode === 2) {
        // convert to time
        let m = parseInt(user.twentyHandsHighScore / 60, 10);
        let s = parseInt(user.twentyHandsHighScore % 60, 10);
        s = s < 10 ? "0" + s : s;
        return res.json({newHighScore: false, highScore: m + ":" + s});
    }
}

