const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const app = express();

app.use(bodyParser.json());

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

// Error Handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(err.message)
})

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started on port`, PORT);
});