// mongoose 설정
const mongoose = require('mongoose');
const mongoURI = require('../config/mongodb');
const logger = require('../config/logger');
require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  mongoose
    .connect(mongoURI.remote)
    .then((response) => {
      logger.info('Successfully connected to MongoDB.');
    })
    .catch((error) => {
      logger.error(error);
    });
} else {
  mongoose
    .connect(mongoURI.local)
    .then((response) => {
      logger.info('Successfully connected to MongoDB.');
    })
    .catch((error) => {
      logger.error(error);
    });
}

module.exports = mongoose;
