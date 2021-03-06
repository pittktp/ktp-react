const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

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

// POST - Forgot Password
router.post('/forgot-password', async (req, res) => {
  // Validate email from request body
  if (!req.body.hasOwnProperty('email')) {
    return res.status(401).json({ success: false, err: 'No Email Provided' });
  } else if (!req.body.email.includes('@pitt.edu')) {
    return res.status(401).json({ success: false, err: 'Invalid Email Address' });
  }

  // Validate reset_code and password from request body
  if (!req.body.hasOwnProperty('reset_code')) {
    return res.status(401).json({ success: false, err: 'No Reset Code Provided' });
  } else if (req.body.reset_code !== process.env.RESET_CODE) {
    return res.status(401).json({ success: false, err: 'Invalid Reset Code' });
  }

  if (!req.body.hasOwnProperty('password')) {
    return res.status(401).json({ success: false, err: 'No Password Provided' });
  }

  let { email, password } = req.body;

  // Find account with matching email
  let member = await Member.findOne({ email });

  if (!member) {
    return res.status(404).json({ success: false, err: 'Account Not Found' });
  }

  // Add field for reset code
  const hashedpw = await bcrypt.hash(password, await bcrypt.genSalt());
  let update_res = await Member.findOneAndUpdate({ email }, { $set: { password: hashedpw } });

  if (update_res) {
    return res.status(200).json({ success: true, message: 'Password Reset' });
  }

  return res.status(500).json({ success: false, err: 'An error occurred' });
});

module.exports = router;
