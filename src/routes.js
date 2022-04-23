const express = require('express');
const router = new express.Router();
const reqHandler = require('./req.handler.js');

router.get('/dash',reqHandler.handler);

module.exports = router;