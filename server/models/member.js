const mongoose = require('mongoose');

// Represents a member object in our database
const Member = mongoose.model('Member', {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  serviceHours: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: 'Brother',
  },
  admin: {
    type: Boolean,
    default: false,
  },
  absences: {
    type: Number,
    default: 0,
  },
  rushClass: {
    type: String,
    default: "",
  },
  picture: {
    type: String,
    default: "",
  },
  courses: {
    type: Array,
    default: [],
  },
  linkedIn: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  gradSemester: {
    type: String,
    default: "",
  },
  major: {
    type: String,
    default: "Undeclared",
  },
  description: {
    type: String,
    default: 'This person doesn\'t have a bio, but it\'s safe to assume they love technology.',
  },
  color: {
    type: Array,
    default: ['#28B463', '#145BBD'],
  }
});

module.exports = Member;
