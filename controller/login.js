const express = require('express');
const jwtService = require('../service/jwt');
const logger = require('../config/logger');

const router = express.Router();

// 테스트용 유저 데이터
const users = [
  { id: 1, username: 'user1', password: '1234' },
  { id: 2, username: 'user2', password: '1234' }
];

router.post('/test', (req, res) => {
  //  #swagger.tags = ['Login']
  //  #swagger.description = '로그인 테스트'
  /*  #swagger.parameters['test'] = {
                  in: 'body',
                  schema: {
						username: 'user1',
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
  logger.info(`username, password: ${username}, ${password}`);
  // 일단 테스트용 유저 데이터를 불러와서 로그인 할 수 있도록 구현
  const user = users.find((u) => u.username === username && u.password === password);
  if (user == undefined) {
    logger.info('존재하지 않는 유저입니다.', user);
    return res.status(400).send('존재하지 않는 유저입니다.');
  }
  // todo: 여기는 나중에 DB로 로그인 로직을 구현하면 됩니다.
  //  OauthService.login(username, password);

  // jwt 토큰 발급
  const secret = process.env.SECRET_KEY ? process.env.SECRET_KEY : 'secretKey';
  // 받은 요청에서 db의 데이터를 가져온다 (로그인정보)
  const id = '1'; // todo: db에서 가져온 id로 바꿔야 함
  const token = jwtService.accessToken(id, secret);

  // response
  return res.status(200).json({
    code: 200,
    message: 'token is created',
    token
  });
});

module.exports = router;
