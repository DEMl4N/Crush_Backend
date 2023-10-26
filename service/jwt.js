// Desc: 로그인 서비스
const jwt = require('jsonwebtoken');

function accessToken(id, secret) {
  // jwt.sign(payload, secretOrPrivateKey, [options, callback])
  const payload = {
    // access token에 들어갈 payload
    id
  };

  return jwt.sign(payload, secret, {
    // secret으로 sign하여 발급하고 return
    algorithm: 'HS256', // 암호화 알고리즘
    expiresIn: '1h' // 유효기간
  });
}

function verifyToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      ok: true,
      id: decoded.id
      // role: decoded.role
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message
    };
  }
}

function refreshToken(id, secret) {
  const payload = {
    // refresh token에 들어갈 payload
    id
  };
  return jwt.sign(payload, secret, {
    // refresh token은 payload 없이 발급
    algorithm: 'HS256',
    expiresIn: '14d'
  });
}

module.exports = {
  accessToken,
  refreshToken,
  verifyToken
};
