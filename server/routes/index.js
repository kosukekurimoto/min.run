const express = require('express');
const router = express.Router();

const redirectController = require('../controller/redirectController');
const shortenController = require('../controller/shortenController')

router.post('/shorten', shortenController.index);
router.get('/:code', redirectController.index);

module.exports = router;