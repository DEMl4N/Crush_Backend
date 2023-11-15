/* eslint-disable camelcase */
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('../config/multer');
const loginService = require('../service/login');
const jwtService = require('../service/jwt');
const imageService = require('../service/image');
const logger = require('../config/logger');

const router = express.Router();

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verify_ret = jwtService.verifyToken(token, process.env.SECRET_KEY);
    if (verify_ret.ok) {
      logger.info('verify_ret: ', verify_ret);
      const user = await loginService.findUserById(verify_ret.id);
      const image = await imageService.findImageById(user.profile_image_id);
      logger.info('user: ', user);
      if (user == null) {
        res.status(404).json({
          code: 404,
          message: 'user not found'
        });
      } else {
        res.status(200).json({
          code: 200,
          message: 'user found',
          user,
          url: image.url
        });
      }
    } else {
      res.status(400).json({
        code: 400,
        message: '토큰이 올바르지 않습니다.'
      });
    }
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: '올바르지 않은 요청입니다.'
    });
  }
});

router.put('/me', multer.single('image'), async (req, res) => {
  logger.info('req.body: ', req.body.user_name);
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verify_ret = jwtService.verifyToken(token, process.env.SECRET_KEY);
    const { user_name, comment } = req.body;
    if (user_name == null || user_name === '') {
      res.status(400).json({
        code: 400,
        message: 'user_name is null'
      });
      return;
    }
    if (!verify_ret.ok) {
      res.status(400).json({
        code: 400,
        message: '토큰이 올바르지 않습니다.'
      });
      return;
    }
    let image = null;
    if (req.file) {
      const filename = uuidv4() + req.file.originalname;
      const user = await loginService.findUserById(verify_ret.id);
      if (user.profile_image_id != null && user.profile_image_id !== '') {
        await imageService.deleteImageById(user.profile_image_id);
      }
      image = await imageService.createImage(req.file, filename);
    }
    let image_id = null;
    if (image != null) {
      image_id = image.id;
    }
    const user = await loginService.update_user(verify_ret.id, user_name, comment, image_id);
    logger.info('user: ', user);
    if (user == null) {
      res.status(404).json({
        code: 404,
        message: 'user not found'
      });
    } else {
      res.status(200).json({
        code: 200,
        message: 'user updated',
        user,
        image: image.url
      });
    }
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: '올바르지 않은 요청입니다.'
    });
  }
});

router.put('/me/background', multer.single('image'), async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verify_ret = jwtService.verifyToken(token, process.env.SECRET_KEY);
    if (!req.file) {
      res.status(400).json({
        code: 400,
        message: 'No file uploaded.'
      });
      return;
    }
    if (!verify_ret.ok) {
      res.status(400).json({
        code: 400,
        message: '토큰이 올바르지 않습니다.'
      });
      return;
    }
    const filename = uuidv4() + req.file.originalname;
    const find_user = await loginService.findUserById(verify_ret.id);
    if (find_user.background_image_id != null && find_user.background_image_id !== '') {
      await imageService.deleteImageById(find_user.background_image_id);
    }
    const image = await imageService.createImage(req.file, filename);
    const user = await loginService.update_background(verify_ret.id, image.id);
    if (user == null) {
      res.status(404).json({
        code: 404,
        message: 'user not found'
      });
    } else {
      res.status(200).json({
        code: 200,
        message: 'user updated',
        user,
        image: image.url
      });
    }
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: '올바르지 않은 요청입니다.'
    });
  }
});

/* GET users listing. */
router.get('/:user_name', async (req, res) => {
  try {
    const { user_name } = req.params;
    const user = await loginService.findUserByName(user_name);
    if (user == null) {
      res.status(404).json({
        code: 404,
        message: 'user not found'
      });
    } else {
      res.status(200).json({
        code: 200,
        message: 'user found',
        user
      });
    }
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: '올바르지 않은 요청입니다.'
    });
  }
});

module.exports = router;
