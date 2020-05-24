const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

let mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// Start DB connection
mongoose.connect(MONGO_URI, mongoOptions, (err) => {
  if (err) {
    console.log('Error connecting to MongoDB: ' + JSON.stringify(err, undefined, 2));
  } else {
    console.log('MongoDB connection successful!');
  }
});

module.exports = mongoose;
