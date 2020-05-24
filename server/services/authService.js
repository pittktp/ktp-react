const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./dbService');

// Models
const Member = require('../models/member');

class AuthService {
  // Validates the given token
  // Valid => Returns Member
  // Expired within Acceptable Range => Refreshes Token and Returns Member
  // Invalid => Returns Error
  async validate(token) {
    return await jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          // Expired Token
          let expiredAt = err.expiredAt;
          let now = Math.floor(Date.now() / 1000);
          let acceptableRange = 86400 * 7;
          if ((now - expiredAt) < acceptableRange) {
            // Get Member ObjectID
            let decode_res = jwt.decode(token);
            let member = await Member.findOne({ _id: decode_res.member_id }).select('-password');
            const new_token = jwt.sign({ member_id: decode_res.member_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return { result: 'refreshed', member_id: decode_res.member_id, token: new_token, member };
          }
        }

        // Invalid Token
        return { result: 'invalid', error: err.message };
      } else {
        // Valid Token
        let member = await Member.findOne({ _id: decoded.member_id }).select('-password');
        return { result: 'valid', member_id: decoded.member_id, member };
      }
    });
  }

  // Handles loggin in users
  async login(credentials) {
    const hasEmail = credentials.hasOwnProperty('email');
    const hasPassword = credentials.hasOwnProperty('password');

    if (!hasEmail || !hasPassword) {
      let payload = { error: 'Missing required fields!' };
      return { status_code: 400, payload };
    }

    const { email, password } = credentials;
    let member = await Member.findOne({ email });

    if (!member) {
      let payload = { error: 'Invalid Credentials!' };
      return { status_code: 401, payload };
    } else {
      const match = await bcrypt.compare(password, member.password);

      if (!match) {
        let payload = { error: 'Invalid Credentials!' };
        return { status_code: 401, payload };
      }

      let token = jwt.sign({ member_id: member._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      delete member.password; // Remove password field from object
      let payload = { token, member };
      return { status_code: 200, payload };
    }
  }

  // Handles registering new user accounts
  async register(credentials) {
    const hasName = credentials.hasOwnProperty('name');
    const hasEmail = credentials.hasOwnProperty('email');
    const hasPassword = credentials.hasOwnProperty('password');

    // Ensure all necessary info is provided
    if (!hasName || !hasEmail || !hasPassword) {
      let payload = { error: 'Missing Required Fields!' };
      return { status_code: 400, payload };
    }

    const { email, password, code } = credentials;

    // Check if Account exists
    let exists = await Member.findOne({ email }).select('-password');
    if (exists) {
      let payload = { error: 'That email is already in use!' };
      return { status_code: 400, payload };
    }

    const hashedpw = await bcrypt.hash(password, await bcrypt.genSalt());
    const is_admin = code === process.env.ADMIN_CODE;
    // Remove code from credentials object so it doesnt get put into the DB
    delete credentials.code;
    const member_doc = new Member({
      ...credentials,
      password: hashedpw,
      admin: is_admin,
    });

    let member = await member_doc.save();

    if (member) {
      delete member.password; // Remove password from object
      const token = jwt.sign({ member_id: member._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      let payload = { token, member };
      return { status_code: 201, payload };
    } else {
      let payload = { error: 'Failed to create account!' };
      return { status_code: 500, payload };
    }
  }
}

module.exports = AuthService;
