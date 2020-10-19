const express = require('express');
const router = express.Router();

// Set up Middleware
const auth = require('../middleware/auth');

// Set up Auth Service
const AuthService = require('../services/authService');
const authService = new AuthService();

// Set up Sponsor Service
const SponsorService = require('../services/sponsorService');
const sponsorService = new SponsorService();

// Models
const Member = require('../models/member');
const Sponsor = require('../models/sponsor');

// Routes (all routes here are prefixed by `/admin`)

router.post('/create-sponsor', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);

  if (validation_res.result === 'invalid') {
    return res.status(401).json(validation_res);
  }

  const { member } = validation_res;

  if (!member.admin) {
    return res.status(403).json({ error: 'You do not have permission to do that' });
  }

  let creation_res = await sponsorService.create(res.body);

  return res.status(creation_res.status).json(creation_res.payload);
});