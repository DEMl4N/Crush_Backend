// mongoose 설정
const mongoose = require('mongoose');
const mongoURI = require('../config/mongodb');

mongoose.connect(mongoURI.local)
.then((response) => {
  console.log("Successfully connected to MongoDB.");
})
.catch((error) => {
  console.error(error);
});

module.exports.mongoose = mongoose;