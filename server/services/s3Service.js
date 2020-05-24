const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: 'us-east-1',
});

const S3 = new AWS.S3();

const fileFilter = (req, file, cb) => {
  switch (file.mimetype) {
    case 'image/gif':
    case 'image/jpeg':
    case 'image/png':
      cb(null, true);
      break;
    default:
      cb(new Error('Invalid file type, only JPEG, PNG, and GIF is allowed!'));
      break;
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3: S3,
    bucket: 'pitt-ktp',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: 'TESTING_METADATA' });
    },
    key: (req, file, cb) => {
      var path = `img/profile/${req.body.shortName}/${req.body.newFileName}`;
      cb(null, path);
    }
  }),
});

const remove = filePath => {
  const fileKey = filePath.replace('https://pitt-ktp.s3.amazonaws.com/', '');
  const params = { Bucket: 'pitt-ktp', Key: fileKey };

  S3.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    }
  });
}

module.exports = { upload, remove };
