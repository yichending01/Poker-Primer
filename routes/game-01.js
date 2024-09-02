const path = require('path');

const express = require('express');

const User = require('../models/user');

const game01Controller = require('../controllers/game-01');

const whatsYourHandConstroller = require('../controllers/whats-your-hand');

const router = express.Router();

router.get('/game-01', game01Controller.getGame01);

router.post('/update-high-score', game01Controller.updateHighScore);

router.get('/whats-your-hand', whatsYourHandConstroller.getWhatsYourHand);

router.post('/whats-your-hand/update-high-score', whatsYourHandConstroller.updateHighScore);




module.exports = router;