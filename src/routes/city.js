const city = require('../controller/city.js');

const express = require('express');

const router = express.Router();

router.get('/v1/city', city.getCitys);
router.get('/v1/city/:id', city.getOneCity);
router.get('/v1/city/name/:name', city.getCityName);
router.get('/v1/city/bike/:id', city.getBikeInCity);

module.exports = router;

