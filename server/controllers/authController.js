const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Set up Middleware
const auth = require('../middleware/auth');

// Set up Auth Service
const AuthService = require('../services/authService');
const authService = new AuthService();

// Models
const Member = require('../models/member');
const ForgotPassRequest = require('../models/passRecovery');

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
// Assigned generated reset code to user's account and send code to user's email
router.post('/forgot-password', async (req, res) => {
  // Validate email from request body
  if (!req.body.hasOwnProperty('email')) {
    return res.status(401).json({ success: false, err: 'No Email Provided' });
  } else if (!req.body.email.includes('@pitt.edu')) {
    return res.status(401).json({ success: false, err: 'Invalid Email Address' });
  }

  let { email } = req.body;

  // Find account with matching email
  let member = await Member.findOne({ email });

  if (!member) {
    return res.status(404).json({ success: false, err: 'Account Not Found' });
  }

  // Generate reset code
  let reset_code = crypto.randomBytes(10).toString('hex');
  let hashed_reset_code = await bcrypt.hash(reset_code, await bcrypt.genSalt());

  // Insert reset request into db
  let currDate = new Date(Date.now());
  let expires = currDate.setMinutes(currDate.getMinutes() + 15);
  let forgotPassDoc = new ForgotPassRequest({
    reset_code: hashed_reset_code,
    email,
    expires,
  });

  try {
    let _ = await forgotPassDoc.save();
  } catch (err) {
    return res.status(500).json({ success: false, err: 'Something Went Wrong!' });
  }

  // Send email with reset code
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS, // TODO: REMOVE WITH ENV VAR
      pass: process.env.EMAIL_PASS, // TODO: REMOVE WITH ENV VAR
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: member.email,
    subject: 'KTP Password Reset',
    text: `Someone requested a password reset code for your account.\n
      If this was not you, please contact the current Tech Chair immediately!\n\n
      Password Reset Code: ${reset_code}`,
  };

  transporter.sendMail(mailOptions, (error, _info) => {
    if (error)
      return res.status(500).json({ success: false, err: 'Email Not Sent!' });
    
    return res.status(200).json({ success: true, message: 'Email Sent!' });
  });
});

// POST - RESET PASSWORD
// Validates reset code is assigned to user, removes it, and updates account with new password
router.post('/reset-password', async (req, res) => {
  // Validate email from request body
  if (!req.body.hasOwnProperty('email')) {
    return res.status(401).json({ success: false, err: 'No Email Provided' });
  } else if (!req.body.email.includes('@pitt.edu')) {
    return res.status(401).json({ success: false, err: 'Invalid Email Address' });
  }

  // Validate reset_code from request body
  if (!req.body.hasOwnProperty('reset_code')) {
    return res.status(401).json({ success: false, err: 'No Reset Code Provided' });
  }

  // Validate password from request body
  if (!req.body.hasOwnProperty('password')) {
    return res.status(401).json({ success: false, err: 'No Password Provided' });
  }

  // Deconstructure fields from request body
  let { email, password, reset_code } = req.body;

  // Find matching user account
  let member = await Member.findOne({ email });

  if (!member) {
    return res.status(404).json({ success: false, err: 'Account Not Found' });
  }

  let forgotPassDoc = await ForgotPassRequest.findOne({ email, active: true });

  if (!forgotPassDoc) {
    return res.status(401).json({ success: false, err: 'No Active Recovery Codes' });
  } else if (await bcrypt.compare(reset_code, forgotPassDoc.reset_code) === false) {
    return res.status(401).json({ success: false, err: 'Invalid Recovery Code' });
  } else if (new Date(Date.now()) > new Date(forgotPassDoc.expires)) {
    let _  = await forgotPassDoc.updateOne({ $set: { active: false } });
    return res.status(401).json({ success: false, err: 'Expired Reset Code'});
  }

  // Reset Code is valid, so update code to be inactive
  let _ = await forgotPassDoc.updateOne({ $set: { active: false } });

  // Hash new password and assign to member, remove reset_code from user account
  const hashedpw = await bcrypt.hash(password, await bcrypt.genSalt());
  let update_res = await Member.findOneAndUpdate({ email }, { $set: { password: hashedpw } });

  if (update_res) {
    return res.status(200).json({ success: true, message: 'Password Reset' });
  }

  return res.status(500).json({ success: false, err: 'An error occurred' });
});

module.exports = router;
