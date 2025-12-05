const express = require('express');
const users = require('../controller/users.js');

const router = express.Router();

router.get('/v1/users', users.getUsers);
router.get('/v1/users/:id', users.specificUser);

module.exports = router;
