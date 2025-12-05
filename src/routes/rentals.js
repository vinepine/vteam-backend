const rentals = require('../controller/rentals.js');
const express = require('express');

const router = express.Router();

router.get('/v1/rental', rentals.getRental);
router.get('/v1/rental/:id', rentals.getOneRental);
router.get('/v1/rental/start/:id/:userId/:scooterId', rentals.startRental);
router.get('/v1/rental/end/:id/:userId/:scooterId', rentals.endRental);

module.exports = router;
