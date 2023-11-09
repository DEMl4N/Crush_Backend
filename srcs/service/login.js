/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-new-object */
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

async function findUserById(id) {
  let user = null;
  user = await user_model
    .findOne({
      id
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('find_user: ', isSuccessful);
        const find_user = new Object();
        find_user.id = isSuccessful._doc.id;
        find_user.name = isSuccessful._doc.name;
        find_user.email = isSuccessful._doc.email;
        find_user.comment = isSuccessful._doc.comment;
        logger.info('find_user2: ', find_user);
        return find_user;
      }
    })
    .catch((error) => {
      logger.error(error);
    });
  logger.info('find_user3: ', user);
  return user;
}

async function findUserByName(name) {
  let user = null;
  user = await user_model
    .findOne({
      name
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('find_user: ', isSuccessful);
        const find_user = new Object();
        find_user.id = isSuccessful._doc.id;
        find_user.name = isSuccessful._doc.name;
        find_user.email = isSuccessful._doc.email;
        find_user.comment = isSuccessful._doc.comment;
        return find_user;
      }
    })
    .catch((error) => {
      logger.error(error);
    });
  return user;
}

async function create_user(user_info) {
  let user = null;
  user = await user_model
    .create({
      id: user_info.id,
      name: user_info.name,
      email: user_info.email,
      comment: ''
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('create_user: ', isSuccessful);
        const find_user = new Object();
        find_user.id = isSuccessful._doc.id;
        find_user.name = isSuccessful._doc.name;
        find_user.email = isSuccessful._doc.email;
        find_user.comment = isSuccessful._doc.comment;
        return find_user;
      }
    })
    .catch((error) => {
      logger.error(error);
    });
  return user;
}

async function update_user(id, username, comment) {
  let user = null;
  user = await user_model
    .findOneAndUpdate(
      {
        id
      },
      {
        name: username,
        comment
      },
      {
        new: true
      }
    )
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('update_user: ', isSuccessful);
        const find_user = new Object();
        find_user.id = isSuccessful._doc.id;
        find_user.name = isSuccessful._doc.name;
        find_user.email = isSuccessful._doc.email;
        find_user.comment = isSuccessful._doc.comment;
        return find_user;
      }
    })
    .catch((error) => {
      logger.error(error);
    });
  return user;
}

module.exports = {
  findUserById,
  findUserByName,
  create_user,
  update_user
};
