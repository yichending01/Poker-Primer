const path = require('path');

const express = require('express');

const User = require('../models/user');

const game01Controller = require('../controllers/game-01');

const router = express.Router();

router.get('/game-01', game01Controller.getGame01);

router.post('/update-high-score', game01Controller.updateHighScore);


module.exports = router;