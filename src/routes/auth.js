const express = require('express');
const auth = require('../controller/auth.js');

const oauth = require('../controller/oauth.js');

const router = express.Router();

router.post('/v1/register', auth.register);
router.post('/v1/login', auth.login);
router.get('/callback', oauth.callback);
router.get('/v1/oauth-run', oauth.run);

module.exports = router;
