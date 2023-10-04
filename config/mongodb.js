require('dotenv').config();

module.exports = {
  local: 'mongodb://127.0.0.1:27017/mylist',
  remote: process.env.MONGODB_URI
};
