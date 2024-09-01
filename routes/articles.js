const path = require('path');

const express = require('express');

const articlesController = require('../controllers/articles');

const router = express.Router();

router.get('/articles/hand-rankings', articlesController.getHandRankingsArticle);

module.exports = router;