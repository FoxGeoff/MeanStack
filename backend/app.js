// npm install express --save
const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('First middleware');
  next();
});

app.use((req, res, next) => {
  console.log('Hello from express!');
  next();
});

module.exports = app;
