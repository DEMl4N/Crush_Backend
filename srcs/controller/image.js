const express = require('express');
const { v4: uuidv4 } = require('uuid');
const imageService = require('../service/image');
const multer = require('../config/multer');
require('dotenv').config();

const router = express.Router();

router.get('/all', async (req, res) => {
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
  const images = await imageService.findAllImages();
  res.status(200).send(images);
});

router.get('/:id', async (req, res) => {
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
  const image = await imageService.findImageById(req.params.id);
  if (image == null) {
    res.status(404).send('DB Image not found');
    return;
  }
  res.status(200).send(image);
});

// Process the file upload and upload to Google Cloud Storage.
router.post('/upload', multer.single('image'), async (req, res) => {
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }
  try {
    const filename = uuidv4() + req.file.originalname;
    const image = await imageService.createImage(req.file, filename);
    res.status(200).send(image);
  } catch (err) {
    res.status(500).send('Post Controller Error');
  }
});

router.delete('/delete/:id', async (req, res, next) => {
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
  try {
    const image = await imageService.deleteImageById(req.params.id);
    if (image == null) {
      res.status(404).send('DB Image not found');
      return;
    }
  } catch (err) {
    res.status(500).send('Delete Controller Error');
  }
  res.status(200).send('Image deleted');
});

module.exports = router;
