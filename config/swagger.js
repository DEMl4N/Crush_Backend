// swagger.js
const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const options = {
  info: {
    title: 'TEST API Docs',
    description: 'test api 문서입니다'
  },
  host:
    process.env.HOST && process.env.PORT
      ? `${process.env.HOST}:${process.env.PORT}`
      : 'localhost:8080',
  servers: [
    {
      url:
        process.env.HOST && process.env.PORT
          ? `http://${process.env.HOST}:${process.env.PORT}`
          : 'http://localhost:8080'
    }
  ],
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];
swaggerAutogen(outputFile, endpointsFiles, options);
