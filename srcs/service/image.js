/* eslint-disable import/order */
/* eslint-disable no-array-constructor */
/* eslint-disable new-cap */
/* eslint-disable consistent-return */
/* eslint-disable no-new-object */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const { v4: uuidv4 } = require('uuid');

const mongoose = require('../database/mongoose');

const logger = require('../config/logger');
require('dotenv').config();
const { Storage } = require('@google-cloud/storage');

const { format } = require('util');

// Instantiate a storage client
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCS_KEYFILE_PATH
});

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCS_BUCKET);

// 스키마와 모델 구성
const image_schema = new mongoose.Schema({
  name: String,
  url: String
});

const image_model = mongoose.model('image', image_schema);

async function findAllImages() {
  let images = null;
  images = await image_model
    .find()
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('find_images: ', isSuccessful);
        const find_images = new Array();
        isSuccessful.forEach((image) => {
          const find_image = new Object();
          find_image.id = image.id;
          find_image.name = image.name;
          find_image.url = image.url;
          find_images.push(find_image);
        });
        return find_images;
      }
    })
    .catch((error) => {
      logger.error(error);
    });
  logger.info('find_images2: ', images);
  return images;
}

async function findImageById(_id) {
  let image = null;
  image = await image_model
    .findOne({
      _id
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('find_image: ', isSuccessful);
        const find_image = new Object();
        find_image.id = isSuccessful._doc._id;
        find_image.name = isSuccessful._doc.name;
        find_image.url = isSuccessful._doc.url;
        return find_image;
      }
    })
    .catch((error) => {
      logger.error(error);
    });
  logger.info('find_image2: ', image);
  return image;
}

async function createImage(file, filename) {
  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream();

  const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
  const new_image = await image_model
    .create({
      name: blob.name,
      url: publicUrl
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('create_image: ', isSuccessful);
        // const create_image = new Object();
        // create_image.id = isSuccessful._doc._id;
        // create_image.name = blob.name;
        // create_image.url = publicUrl;
        return isSuccessful;
      }
    })
    .catch((error) => {
      logger.error(error);
      throw new Error(error);
    });

  blobStream.end(file.buffer);
  return new_image;
}

async function deleteImageById(_id) {
  if (_id == null) return null;

  let image = null;
  image = await image_model
    .findOne({
      _id
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('find_image: ', isSuccessful);
        const find_image = new Object();
        find_image.id = isSuccessful._doc._id;
        find_image.name = isSuccessful._doc.name;
        find_image.url = isSuccessful._doc.url;
        return find_image;
      }
    })
    .catch((error) => {
      logger.error(error);
    });

  if (image == null) {
    return null;
  }

  await image_model
    .deleteOne({
      _id
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('delete_image: ', isSuccessful);
        return isSuccessful;
      }
    })
    .catch((error) => {
      logger.error(error);
    });

  const blob = bucket.file(image.name);
  if (blob == null) {
    return null;
  }
  blob.delete();

  return image;
}

module.exports = { findAllImages, findImageById, createImage, deleteImageById, image_schema, image_model };
