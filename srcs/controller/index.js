const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  //  res.render('index', { title: 'Express' });
  res.sendFile('index.html', { root: 'build' });
});

module.exports = router;
