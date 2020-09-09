const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Set up AWS
AWS.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: 'us-east-1',
});

// Create new S3 object instance
const S3 = new AWS.S3();

// Ensure only valid image file types (GIF, JPEG/JPG, PNG) are uploaded
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

// Function that handles uploading images to S3
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

// Function that handles removing images from S3
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
