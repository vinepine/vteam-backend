const express = require('express');
const auth = require('../controller/auth.js');

const router = express.Router();

router.post('/v1/register', auth.register);
router.post('/v1/login', auth.login);

module.exports = router;
