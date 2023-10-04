require('dotenv').config();

module.exports = {
  local: 'mongodb://127.0.0.1:27017/mylist',
  remote: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@34.64.96.158:27017/mylist`
};
