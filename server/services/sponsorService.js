const Sponsor = require('../models/sponsor');

const requiredKeys = ['companyName', 'email', 'password'];

class SponsorService {
  async create(data) {
    let payload = {};
    if (!validate(data)) {
      payload = { success: false, error: 'Missing required fields' };
      return { status: 400, payload };
    }

    // TODO: Create Sponsor Object
    let sponsor = await new Sponsor(data).save();

    if (sponsor) {
      payload = { success: true, sponsor };
      return { status: 201, payload };
    }

    payload = { success: false, error: 'Failed to Create Sponsor' };
    return { status: 500, payload };
  }
}

function validate(data) {
  for (key in requiredKeys) {
    if (!data.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}

module.exports = SponsorService;
