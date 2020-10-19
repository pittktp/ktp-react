const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

// Set up Middleware
const auth = require('../middleware/auth');

// Set up Auth Service
const AuthService = require('../services/authService');
const authService = new AuthService();

// Set Up S3 Service
const { upload, remove } = require('../services/s3Service');
const singleUpload = upload.single('image');

// Models
const Member = require('../models/member');

// Routes (all routes here are prefixed by `/members`)

// GET all Members
router.get('/', async (req, res) => {
  let token = req.headers.authorization;
  if (token) {
    let validation_res = await authService.validate(token);
    if (validation_res.result !== 'invalid') {
      let members = await Member.find({}).select('-password');
      return res.status(200).json({ type: 'private', members });
    }
  }
  let members = await Member.find({}).select('-email -password -picture');
  return res.status(200).json({ type: 'public', members });
});

// PATCH (Update) Attendence
router.patch('/attendence', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);

  if (validation_res.result === 'invalid') {
    return res.status(403).json(validation_res);
  }

  const { member } = validation_res;

  if (!member.admin) {
    return res.status(403).json({ error: 'You do not have permission to do that' });
  }

  Member.updateMany({ _id: { $in: req.body.absent } }, { $inc: { absences: 1 } }, { new: true })
    .then(result => res.status(200).json({ result: 'success', msg: 'Absences Recorded!' }))
    .catch(err => res.status(500).json({ result: 'fail', msg: err.message }));
});

// PATCH (Update) Zero DB
router.patch('/clear', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);

  if (validation_res === 'invalid') {
    return res.status(403).json({ success: false, ...validation_res });
  }

  if (!validation_res.member.admin) {
    return res.status(403).json({ success: false, error: 'You do not have permission to do that' });
  }

  let updates = { serviceHours: 0, points: 0, absences: 0 };
  let update_res = await Member.updateMany({}, { $set: updates }, { new: true });

  if (update_res) {
    return res.status(200).json({ success: true });
  }

  return res.status(500).json({ success: false, error: 'Something went wrong' });
});

// GET Member By Email ID
router.get('/email/:id', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);

  if (validation_res.result === 'invalid') {
    return res.status(403).json({ found: false, ...validation_res });
  }

  let member = await Member.findOne({ email: `${req.params.id}@pitt.edu`}).select('-password');

  if (member) {
    return res.status(200).json({ found: true, member });
  }

  return res.status(404).json({ found: false, error: 'No matching member found' });
});

// GET Member By Id
router.get('/:id', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);

  if (validation_res.result === 'invalid') {
    return res.status(403).json(validation_res);
  }

  return res.status(200).json({ member: validation_res.member });
});

// PATCH (Update) Member
router.patch('/:id', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);

  if (validation_res.result === 'invalid') {
    return res.status(403).json({ success: false, ...validation_res });
  }

  if (!validation_res.member.admin && validation_res.member._id !== req.params.id) {
    return res.status(403).json({ success: false, error: 'You do not have permission to do that' });
  }

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, error: `No member found with id: ${req.params.id}` });
  }

  let member = await Member.findByIdAndUpdate(req.params.id, { $set: req.body.updates }, { new: true });

  if (member) {
    return res.status(200).json({ success: true });
  }

  return res.status(500).json({ success: false, error: 'Something went wrong' });
});

// DELETE Member
router.delete('/:id', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);

  if (validation_res.result === 'invalid') {
    return res.status(403).json({ success: false, ...validation_res });
  }

  if (!validation_res.member.admin) {
    return res.status(403).json({ success: false, error: 'You do not have permission to do that' });
  }

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, error: `No member found with id: ${req.params.id}` });
  }

  let delete_res = await Member.findOneAndDelete(req.params.id);

  if (delete_res) {
    return res.status(200).json({ success: true });
  }

  return res.status(500).json({ success: false, error: 'Something went wrong' });
});

// POST Upload Profile Picture
// Files can ONLY be sent through POST
router.post('/:id/image/upload', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);

  if (validation_res.result === 'invalid') {
    return res.status(403).json({ success: false, ...validation_res });
  }

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, error: `No member found with id: ${req.params.id}` });
  }

  req.body.domain = 'profile';
  singleUpload(req, res, async (err, some) => {
    if (err) {
      return res.status(422).json({ success: false, error: err });
    }

    let picture = `https://pitt-ktp.s3.amazonaws.com/img/profile/${req.body.shortName}/${req.body.newFileName}`;
    let member = await Member.findOneAndUpdate(req.params._id, { $set: { picture } }, { new: true });

    if (member) {
      return res.status(200).json({ success: true });
    }

    return res.status(500).json({ success: false, error: 'Something went wrong' });
  });
});

router.delete('/:id/image/delete', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);

  if (validation_res.result === 'invalid') {
    return res.status(403).json({ success: false, ...validation_res });
  }

  if (!ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, error: `No member found with id: ${req.params.id}` });
  }

  let filePath = validation_res.member.picture;
  let member = await Member.findByIdAndUpdate(req.params.id, { $set: { picture: '' } }, { new: true });

  if (member) {
    remove(filePath);
    return res.status(200).json({ success: true });
  }

  return res.status(500).json({ success: false, error: 'Something went wrong' });
});

module.exports = router;
