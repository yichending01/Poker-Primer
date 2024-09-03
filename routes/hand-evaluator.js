const path = require('path');

const express = require('express');

const handEvaluatorController = require('../controllers/hand-evaluator');

const router = express.Router();

router.get('/hand-evaluator', handEvaluatorController.getHandEvaluator);

router.get('/odds-calculator', handEvaluatorController.getOddsCalculator);

module.exports = router;