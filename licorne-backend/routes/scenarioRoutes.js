const express = require('express');
const router = express.Router();
const { getScenario, createScenario, updateScenario, deleteScenario } = require('../controllers/scenarioController');

router.get('/get-scenario', getScenario);
router.post('/create-scenario',createScenario)
router.put('/update-scenario/:id',updateScenario)
router.delete('/delete-scenario/:id', deleteScenario)

module.exports = router;
