const express = require('express');
const loginService = require('../service/login');

const router = express.Router();

/* GET users listing. */
router.get('/:username', (req, res) => {
  const userName = req.params.username;
  const user = loginService.findUserByNmae(userName);
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
});

router.patch('/:username', (req, res) => {
  const userName = req.params.username;
  const { comment } = req.body;
  const user = loginService.update_user(userName, comment);
  if (user == null) {
    res.status(400).json({
      code: 400,
      message: '올바르지 않은 요청입니다.'
    });
  } else {
    res.status(200).json({
      code: 200,
      message: 'user updated',
      user
    });
  }
});

module.exports = router;
