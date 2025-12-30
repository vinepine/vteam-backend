const express = require('express');

const stations = require('../controller/stations.js');
const {jwtMiddleware} = require('../middleware/jwt-middleware.js');

const router = express.Router();

router.get('/v1/stations', jwtMiddleware, stations.getStations);
router.get('/v1/stations/:id', jwtMiddleware, stations.getOneStation);

module.exports = router;
