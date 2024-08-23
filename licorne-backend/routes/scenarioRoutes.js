const express = require('express');
const router = express.Router();
const { getScenario } = require('../controllers/scenarioController');

router.get('/get-scenario', getScenario);

module.exports = router;
