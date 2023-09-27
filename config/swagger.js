// swagger.js
const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const options = {
  info: {
    title: 'TEST API Docs',
    description: 'test api 문서입니다',
  },
  host: process.env.HOST || 'localhost:8080',
  servers: [
    {
      url: `http://${process.env.HOST}` || 'http://localhost:8080',
    },
  ],
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];
swaggerAutogen(outputFile, endpointsFiles, options);
