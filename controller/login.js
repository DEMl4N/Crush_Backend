/* eslint-disable camelcase */
const express = require('express');
const axios = require('axios');
const jwtService = require('../service/jwt');
const logger = require('../config/logger');
require('dotenv').config();

const router = express.Router();
// mongoose 불러오기
const mongoose = require('../database/mongoose');
// 스키마와 모델 구성
const user_schema = new mongoose.Schema({
  id: String,
  name: String,
  email: String
});

const user_model = mongoose.model('user', user_schema);

// 테스트용 유저 데이터
const users = [
  { id: 1, username: 'user1', password: '1234' },
  { id: 2, username: 'user2', password: '1234' }
];

function find_user(id) {
  const user = user_model
    .findOne({
      id
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('find_user: ', isSuccessful);
      }
    })
    .catch((error) => {
      logger.error(error);
      return null;
    });
  return user;
}

function create_user(user_info) {
  const user = user_model
    .create({
      id: user_info.id,
      name: user_info.name,
      email: user_info.email
    })
    .then((isSuccessful) => {
      if (isSuccessful) {
        logger.info('create_user: ', isSuccessful);
      }
    })
    .catch((error) => {
      logger.error(error);
      return null;
    });
  return user;
}

router.post('/', (req, res) => {
  const { authorization } = req.headers;
  const secret = process.env.SECRET_KEY;
  if (authorization) {
    const jwt = authorization.split(' ')[1];
    const ret = jwtService.verifyToken(jwt, secret);
    if (ret.ok) {
      return res.status(200).json({
        code: 200,
        message: 'token is valid',
        access_token: jwt
      });
    }
  }
  const { refresh_token } = req.body;
  const refresh_ret = jwtService.verifyToken(refresh_token, secret);
  if (refresh_ret.ok) {
    const user = find_user(refresh_ret.id);
    if (user == null) {
      return res.status(404).json({
        code: 404,
        message: 'user not found'
      });
    }
    const new_token = jwtService.accessToken(user.id, secret);
    return res.status(200).json({
      code: 200,
      message: 'token is created',
      access_token: new_token
    });
  }
  return res.status(401).json({
    code: 401,
    message: 'token is invalid'
  });
});

router.get('/google', (req, res) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  // client_id는 위 스크린샷을 보면 발급 받았음을 알 수 있음
  // 단, 스크린샷에 있는 ID가 아닌 당신이 직접 발급 받은 ID를 사용해야 함.
  url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`;
  // 아까 등록한 redirect_uri
  // 로그인 창에서 계정을 선택하면 구글 서버가 이 redirect_uri로 redirect 시켜줌
  url += `&redirect_uri=${process.env.REDIRECT_URI}`;
  // 필수 옵션.
  url += '&response_type=code';
  // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
  url += '&scope=email profile';
  // 완성된 url로 이동
  // 이 url이 위에서 본 구글 계정을 선택하는 화면임.
  res.redirect(url);
});

// redirect 되었을 때 로그인 또는 회원가입해서 jwt 토큰 발급
router.get('/redirect', async (req, res) => {
  const { code } = req.query;
  // access_token, refresh_token 등의 구글 토큰 정보 가져오기
  const response_token = await axios.post('https://oauth2.googleapis.com/token', {
    // x-www-form-urlencoded(body)
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    grant_type: 'authorization_code'
  });
  const { access_token } = response_token.data;

  const user_info = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      authorization: `Bearer ${access_token}`
    }
  });
  logger.info(user_info.data);
  // db에 유저 정보가 있는지 확인
  let user = find_user(user_info.data.id);
  if (user == null) {
    user = create_user(user_info.data);
  }
  logger.info('user: ', user);
  // jwt 토큰 발급
  const secret = process.env.SECRET_KEY;
  // 받은 요청에서 db의 데이터를 가져온다 (로그인정보)
  const token = jwtService.accessToken(user.id, secret);
  const refresh_token = jwtService.refreshToken(user.id, secret);
  // response
  return res.status(200).contentType('application/json').json({
    code: 200,
    message: 'token is created',
    access_token: token,
    refresh_token
  });
});

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
  if (user === undefined) {
    logger.info('존재하지 않는 유저입니다.', user);
    return res.status(400).send('존재하지 않는 유저입니다.');
  }
  // todo: 여기는 나중에 DB로 로그인 로직을 구현하면 됩니다.
  //  OauthService.login(username, password);

  // jwt 토큰 발급
  const secret = process.env.SECRET_KEY;
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
