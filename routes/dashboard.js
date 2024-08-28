const path = require('path');

const express = require('express');

const dashboardController = require('../controllers/dashboard');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/dashboard', isAuth, dashboardController.getDashboard);


module.exports = router;