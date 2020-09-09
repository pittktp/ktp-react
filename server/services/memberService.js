// Model
const Member = require('../models/member');

// Very simple service which handles only a few basic updates
// Good example of async/await and MongoDB query operators
class MemberService {
  async updateAbsences(id) {
    let doc = await Member.findByIdAndUpdate(id, { $inc: { absences: -1 } });
    return doc ? true : false;
  }

  async updateHours(id, amount) {
    let doc = await Member.findByIdAndUpdate(id, { $inc: { serviceHours: amount } }, { new: true });
    return doc ? true : false;
  }

  async updatePoints(id, amount) {
    let doc = await Member.findByIdAndUpdate(id, { $inc: { points: amount } }, { new: true });
    return doc ? true : false;
  }
}

module.exports = MemberService;