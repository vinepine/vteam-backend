const express = require('express');
const router = express.Router();

const price = require('../controller/price.js');
const {jwtMiddleware} = require('../middleware/jwt-middleware.js');

router.get('/v1/price', jwtMiddleware, price.getPrice);
router.put('/v1/price', jwtMiddleware, price.updatePrice);

module.exports = router;
