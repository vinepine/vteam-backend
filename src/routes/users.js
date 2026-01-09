const express = require('express');

const users = require('../controller/users.js');
const {jwtMiddleware} = require('../middleware/jwt-middleware.js');

const router = express.Router();

router.get('/v1/users', jwtMiddleware, users.getUsers);
router.get('/v1/users/:id', jwtMiddleware, users.specificUser);
router.delete('/v1/users/:id', jwtMiddleware, users.deleteUser);
router.post('/v1/users/loadbalance/:amount', jwtMiddleware, users.loadBalance);

module.exports = router;
