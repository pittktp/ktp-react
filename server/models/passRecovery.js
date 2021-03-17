const mongoose = require('mongoose');

// Represents a Forgot Password object in our database

const ForgotPassRequest = mongoose.model('ForgotPassRequest', {
  email: {
    type: String,
    required: true,
  },
  reset_code: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true
  },
});

module.exports = ForgotPassRequest;

