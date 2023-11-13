const express = require('express');
const { v4: uuidv4 } = require('uuid');
const imageService = require('../service/image');
const multer = require('../config/multer');
require('dotenv').config();

const router = express.Router();

router.get('/all', async (req, res) => {
  const images = await imageService.findAllImages();
  res.status(200).send(images);
});

router.get('/:id', async (req, res) => {
  const image = await imageService.findImageById(req.params.id);
  if (image == null) {
    res.status(404).send('DB Image not found');
    return;
  }
  res.status(200).send(image);
});

// Process the file upload and upload to Google Cloud Storage.
router.post('/upload', multer.single('image'), async (req, res) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }
  try {
    const uuid = uuidv4();
    const filename = uuid + req.file.originalname;
    await imageService.createImage(req.file, filename, res);
  } catch (err) {
    res.status(500).send('Post Controller Error');
  }
});

router.delete('/delete/:id', async (req, res, next) => {
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