const express = require('express');
const service = require('../service/login_service');

const router = express.Router();

// 테스트용 유저 데이터
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

router.post('/test', (req, res) => {
  //  #swagger.tags = ['Login']
  //  #swagger.description = '로그인 테스트'
  /*  #swagger.parameters[''] = {
                  in: 'body',
                  schema: {
                      username: 'Developer',
                      password: '1234'
                  }
  } */
  /*  #swagger.responses[200] = {
              description: '로그인 성공',
              schema: {
                  message: '로그인 테스트를 성공 하였습니다.'
              }
  } */
  /*  #swagger.responses[400] = {
              description: 'body 또는 params를 입력받지 못한 경우',
              schema: {
                  message: '데이터 형식이 올바르지 않습니다.'
              }
  } */
  const { username, password } = req.body;
  service.login(username, password);

  res.send('login');
});

module.exports = router;
