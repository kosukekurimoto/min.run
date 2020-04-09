const express = require('express');
const router = express.Router();

const rootController = require('../controller/rootController');
const redirectController = require('../controller/redirectController');
const urlGetController = require('../controller/urlGetController');
const urlCreateController = require('../controller/urlCreateController');

router.get('/', rootController.index);
router.get('/api/url/:code', urlGetController.index);
router.post('/api/url', urlCreateController.index);
router.get('/:code', redirectController.index);

module.exports = router;