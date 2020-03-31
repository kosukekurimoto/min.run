// ライブラリのインポート
const express = require('express');
const router = require('./routes/index');
const {Datastore} = require('@google-cloud/datastore');

const app = express();

app.use(express.json());
app.use (function (error, req, res, next){
  res.status(400).json({'error':'Invalid JSON format'})
});
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
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
  res.status(500).json({'error':err.message})
})

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started on port`, PORT);
});