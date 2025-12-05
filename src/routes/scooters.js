const scooters = require('../controller/scooters.js');

const express = require('express');

const router = express.Router();

router.get('/v1/bike', scooters.getScooters);
router.get('/v1/bike/:id', scooters.getOneScooter);
router.get('/v1/available/bike', scooters.getAvailable);
router.get('/v1/bike/:id/:available', scooters.updateAvailable);

module.exports = router

