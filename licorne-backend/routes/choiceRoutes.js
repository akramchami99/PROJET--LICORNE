const express = require('express');
const router = express.Router();
const { getChoices, submitChoice,getChoicesForScenario } = require('../controllers/choiceController');

router.post('/submit-choice', submitChoice);
router.post('/get-choices', getChoices)
router.get('/getScenario-choices/:id',getChoicesForScenario)
module.exports = router;
