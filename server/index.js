'use strict';

// ライブラリのインポート
const express = require('express');
const path = require('path');
const router = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json({ limit: '10kb' }));
app.use(function (error, req, res, next) {
  res.status(400).json({ 'error': 'Invalid JSON format' })
  return;
});
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,x-access-token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Router
app.use(router);

// エラーハンドラ
app.use(function (err, req, res, next) {
  res.status(500).json({ 'error': err.message })
  return;
})

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started on port`, PORT);
});