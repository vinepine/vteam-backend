const express = require('express');
const router = express.Router();

const scooters = require('../controller/scooters.js');
const {jwtMiddleware} = require('../middleware/jwt-middleware.js');


router.get('/v1/bike', scooters.getScooters);
router.get('/v1/bike/:id', jwtMiddleware, scooters.getOneScooter);
router.get('/v1/available/bike', jwtMiddleware, scooters.getAvailable);
router.get('/v1/bike/:id/:available', jwtMiddleware, scooters.updateAvailable);

module.exports = router;
