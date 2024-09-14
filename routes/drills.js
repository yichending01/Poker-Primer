const path = require('path');

const express = require('express');

const User = require('../models/user');

const showdownController = require('../controllers/showdown');

const whatsYourHandConstroller = require('../controllers/whats-your-hand');

const router = express.Router();

router.get('/showdown', showdownController.getShowdown);

router.post('/update-high-score', showdownController.updateHighScore);

router.get('/whats-your-hand', whatsYourHandConstroller.getWhatsYourHand);

router.post('/whats-your-hand/update-high-score', whatsYourHandConstroller.updateHighScore);




module.exports = router;