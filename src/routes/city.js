const express = require('express');

const city = require('../controller/city.js');
const {jwtMiddleware} = require('../middleware/jwt-middleware.js');

const router = express.Router();

router.get('/v1/city', jwtMiddleware, city.getCitys);
router.get('/v1/city/:id', jwtMiddleware, city.getOneCity);
router.get('/v1/city/name/:name', jwtMiddleware, city.getCityName);
router.get('/v1/city/bike/:id', jwtMiddleware, city.getBikeInCity);

module.exports = router;

