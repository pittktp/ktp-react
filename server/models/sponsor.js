const mongoose = require('mongoose');

// Represents a sponsor object in our database
const Sponsor = mongoose.model('Sponsor', {
  companyName: {
    type: String,
    required: true,
  },
  tier: {
    type: Number,
    default: 1,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  scheduledEvents: {
    type: Array,
    default: [],
  },
  requestedEvents: {
    type: Array,
    default: [],
  }
});

module.exports = Sponsor;
