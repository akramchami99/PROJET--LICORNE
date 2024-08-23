const express = require('express');
const router = express.Router();
const { getChoices, submitChoice } = require('../controllers/choiceController');

router.post('/submit-choice', submitChoice);
router.post('/get-choices', getChoices)
module.exports = router;
