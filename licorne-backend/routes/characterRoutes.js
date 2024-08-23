const express = require('express');
const router = express.Router();
const { createCharacter, getUnicorn, assignPoint, updateCurrentScenario, updateCurrentStep, } = require('../controllers/characterController');

router.post('/create-character', createCharacter);
router.post('/get-unicorn', getUnicorn);  
router.post('/assign-points', assignPoint)   
router.post('/update-scenario', updateCurrentScenario) 
router.post('/update-step', updateCurrentStep)    

module.exports = router;

