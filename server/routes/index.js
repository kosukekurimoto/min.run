const express = require('express');
const router = express.Router();

const rootController = require('../controller/rootController');
const shortenController = require('../controller/shortenController')

router.post('/shorten', shortenController.index);
router.get('/:code', rootController.index);

module.exports = router;