const express = require('express');
const { login, register } = require('../controllers/authController');
const router = express.Router();

// POST /api/login - Login a user and get a token
router.post('/login', login);

// POST /api/register - Register a new user
router.post('/register', register);

module.exports = router;
