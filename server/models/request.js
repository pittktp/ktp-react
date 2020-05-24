const mongoose = require('mongoose');

// Represents a request object in our database
const Request = mongoose.model('Request', {
  type: { type: String },
  value: { type: Number },
  description: { type: String },
  submittedBy: { type: String },
  submittedById: { type: String },
  submittedDate: { type: String },
  approved: { type: Number },
});

module.exports = Request;
