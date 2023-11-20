const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// router 모듈 추가
const YAML = require('yamljs');
const indexRouter = require('./srcs/controller/index');
const userRouter = require('./srcs/controller/user');
const loginRouter = require('./srcs/controller/login');
const playlistRouter = require('./srcs/controller/playlists');
const dbTest = require('./srcs/controller/dbTest');
const imageRouter = require('./srcs/controller/image');

// swagger 설정 추가
// eslint-disable-next-line import/order, import/no-extraneous-dependencies
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = YAML.load(path.join(__dirname, './build/swagger.yaml'));
// const swaggerFile = require('./config/swagger-output.json');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/playlists', playlistRouter);
app.use('/dbTest', dbTest);
app.use('/image', imageRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const whitelist = ['http://localhost:8080', 'http://localhost:3000', `${process.env.SERVER_HOST}`];

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      // 만일 whitelist 배열에 origin인자가 있을 경우
      callback(null, true); // cors 허용
    } else {
      callback(new Error('Not Allowed Origin!')); // cors 비허용
    }
  }
};

app.use(cors(corsOptions)); // 옵션을 추가한 CORS 미들웨어 추가

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
