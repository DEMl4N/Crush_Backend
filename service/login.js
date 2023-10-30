/* eslint-disable camelcase */
// mongoose 불러오기
const mongoose = require('../database/mongoose');

const logger = require('../config/logger');

// 스키마와 모델 구성
const user_schema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  comment: String
});

const user_model = mongoose.model('user', user_schema);

function findUserById(id) {
  const user = user_model
    .findOne({
      id
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('find_user: ', isSuccessful);
      }
    })
    .catch((error) => {
      logger.error(error);
      return null;
    });
  return user;
}

function findUserByNmae(name) {
  const user = user_model
    .findOne({
      name
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('find_user: ', isSuccessful);
      }
    })
    .catch((error) => {
      logger.error(error);
      return null;
    });
  return user;
}

function create_user(user_info) {
  const user = user_model
    .create({
      id: user_info.id,
      name: user_info.name,
      email: user_info.email,
      comment: ''
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('create_user: ', isSuccessful);
      }
    })
    .catch((error) => {
      logger.error(error);
      return null;
    });
  return user;
}

function update_user(username, comment) {
  const user = user_model
    .findOneAndUpdate(
      {
        name: username
      },
      {
        name: username,
        comment
      }
    )
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('update_user: ', isSuccessful);
      }
    })
    .catch((error) => {
      logger.error(error);
      return null;
    });
  return user;
}

module.exports = {
  findUserById,
  findUserByNmae,
  create_user,
  update_user
};
