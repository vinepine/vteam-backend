const express = require('express');
const stations = require('../controller/stations.js');

const router = express.Router();

router.get('/v1/stations', stations.getStations);
router.get('/v1/stations/:id', stations.getOneStation);

module.exports = router;
