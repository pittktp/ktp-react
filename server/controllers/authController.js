// Importing Packages
const express = require('express');
const router = express.Router();

// Set up Middleware
const auth = require('../middleware/auth');

// Set up Auth Service
const AuthService = require('../services/authService');
const authService = new AuthService();

// Models
const Member = require('../models/member');

// Routes (all routes here are prefixed by `/auth`)

// GET (Protected) - Validate
router.get('/validate', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);
  if (validation_res.result === 'invalid') {
    return res.status(403).json(validation_res);
  } else {
    return res.status(200).json(validation_res);
  }
});

// POST - Login
router.post('/login', async (req, res) => {
  let result = await authService.login(req.body);
  return res.status(result.status_code).json(result.payload);
});

// POST - Register
router.post('/register', async (req, res) => {
  let result = await authService.register(req.body);
  return res.status(result.status_code).json(result.payload);
});

module.exports = router;
