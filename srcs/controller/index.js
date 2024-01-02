const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('*', (req, res) => {
  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
  //  res.render('index', { title: 'Express' });
  res.sendFile('index.html', { root: 'build' });
});

module.exports = router;
