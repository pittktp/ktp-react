const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

// Set up Middleware
const auth = require('../middleware/auth');

// Set up Services
const AuthService = require('../services/authService');
const MemberService = require('../services/memberService');
const authService = new AuthService();
const memberService = new MemberService();

// Set Up S3 Service
const { uploadRequest, remove } = require('../services/s3Service');
const singleUpload = uploadRequest.single('image');

// Models
const Request = require('../models/request');

// Routes (all prefixed by `/requests`)

// GET all requests
router.get('/', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);
  
  if (validation_res.result === 'invalid') {
    return res.status(403).json(validation_res);
  }

  let requests = await Request.find({});
  return res.status(200).json({ requests });
});

// POST create new request
router.post('/', auth, async (req, res) => {
  let token = req.headers.authorization;
  let validation_res = await authService.validate(token);
  
  if (validation_res.result === 'invalid') {
    return res.status(403).json(validation_res);
  }

  if (req.body.image) {
    singleUpload(req, res, async (err) => {
      if (err) {
        return res.status(422).json({ success: false, error: err });
      }

      let picture = `https://pitt-ktp.s3.amazonaws.com/img/requests/${req.body.shortName}/${req.body.fileName}`;
      req.body.picture = picture;
      delete req.body.shortName;
      delete req.body.fileName;
      delete req.body.image;

      let request = new Request(req.body);
      let request_doc = await request.save();
      if (request_doc) {
        return res.status(201).json({ success: true, request: request_doc });
      }

      return res.status(500).json({ success: false, error: 'Something went wrong!' });
    });
  } else {
    let request = new Request(req.body);
    let request_doc = await request.save();
    if (request_doc) {
      return res.status(201).json({ success: true, request: request_doc });
    }

    return res.status(500).json({ success: false, error: 'Something went wrong!' });
  }
});

// PATCH Accept existing request
router.patch('/:id', auth, async (req, res) => {
  let token = req.headers.authorization;
  let valid_res = await authService.validate(token);

  if (valid_res.result === 'invalid')
    return res.status(403).json({ success: false, ...validation_res });

  if (!valid_res.member.admin)
    return res.status(403).json({ success: false, error: 'You do not have permission to do this' });

  if (!ObjectId.isValid(req.params.id))
    return res.status(404).json({ success: false, error: `Request could not be found` });

  let request_doc = await Request.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

  if (request_doc) {
    let updated = false;
    switch (request_doc.type) {
      case 'Brotherhood Points':
        updated = memberService.updatePoints(request_doc.submittedById, request_doc.value);
        break;
      case 'Excused Absence':
        updated = memberService.updateAbsences(request_doc.submittedById);
        break;
      case 'Service Hours':
        updated = memberService.updateHours(request_doc.submittedById, request_doc.value);
        break;
      default:
        let delete_res = await Request.findByIdAndDelete(req.params.id);
        return res.status(500).json({ success: false, error: 'Unknown request type' });
    }

    if (!updated) {
      return res.status(500).json({ success: false, error: 'Failed to update User' });
    }
    return res.status(200).json({ success: true, request: request_doc });
  }

  return res.status(500).json({ success: false, error: 'Something went wrong' });
});

// DELETE Deny existing request
router.delete('/:id', auth, async (req, res) => {
  let token = req.headers.authorization;
  let valid_res = await authService.validate(token);

  if (valid_res.result === 'invalid')
    return res.status(403).json({ success: false, ...validation_res });

  if (!valid_res.member.admin)
    return res.status(403).json({ success: false, error: 'You do not have permission to do this' });

  if (!ObjectId.isValid(req.params.id))
    return res.status(404).json({ success: false, error: 'Request could not be found' });
  let target_request = await Request.findById(req.params.id);
  if (target_request) {
    let delete_res = await Request.findByIdAndDelete(req.params.id);
    if (delete_res) {
      if (target_request.picture)
        remove(target_request.picture);
      return res.status(200).json({ success: true });
    }
  }

  return res.status(500).json({ success: false, error: 'Something went wrong'});
});

module.exports = router;