const express = require('express');
const Multer = require('multer');
const imageService = require('../service/image');
require('dotenv').config();

const router = express.Router();

const { Storage } = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCS_KEYFILE_PATH
});

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

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
router.post('/upload', multer.single('image'), async (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }
  try {
    await imageService.createImage(req.file, res);
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
