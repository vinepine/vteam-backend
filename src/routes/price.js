const express = require('express');
const router = express.Router();

const price = require('../controller/price.js');

router.get('/v1/price', price.getPrice);
router.put('/v1/price', price.updatePrice);

module.exports = router;
