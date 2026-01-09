const express = require('express');
const router = express.Router();

const {startInterval, stopInterval, resetSimulation} = require('../controller/sim/simulation.js');

router.get('/v1/startsim/:amount', startInterval);
router.get('/v1/stopsim', stopInterval);
router.get('/v1/resetsim', resetSimulation);

module.exports = router;