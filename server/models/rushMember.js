const mongoose = require('mongoose');

// Represents an individual who is interested in rushing in our database
const RushMember = mongoose.model('RushMember', {
  name: { type: String },
  email: { type: String },
  year: { type: String },
  major: { type: String },
  ref: { type: String },
});

module.exports = RushMember;