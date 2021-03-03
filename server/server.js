require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('./services/dbService');
const path = require('path');
const AWS = require('aws-sdk');
const app = express();

// Setup AWS
// TODO: Do we need this here?
AWS.config.update({
  region: 'us-east-1',
});

// Set Up Middleware
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Set up Controllers
const authController = require('./controllers/authController');
const memberController = require('./controllers/memberController');
const requestController = require('./controllers/requestController');

app.use('/auth', authController);
app.use('/members', memberController);
app.use('/requests', requestController);

// Start listening on port 3030
app.listen(3030, () => console.log('Server started on port 3030'));