const path = require('path');

const express = require('express');

const articlesController = require('../controllers/articles');

const router = express.Router();

router.get('/articles/hand-rankings', articlesController.getHandRankingsArticle);

router.get('/articles/how-to-play-poker', articlesController.getHowToPlayPokerArticle);

router.get('/articles/poker-lingo', articlesController.getPokerLingoArticle);

module.exports = router;