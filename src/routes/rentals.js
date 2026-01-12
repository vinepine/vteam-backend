const express = require('express');
const router = express.Router();

const rentals = require('../controller/rentals.js');
const {jwtMiddleware} = require('../middleware/jwt-middleware.js');


router.get('/v1/rental', jwtMiddleware, rentals.getRental);
router.get('/v1/rental/me', jwtMiddleware, rentals.getMyRentals);
router.get('/v1/rental/:id', jwtMiddleware, rentals.getOneRental);
router.get('/v1/rental/start/:id/:userId/:scooterId', jwtMiddleware, rentals.startRental);
router.get('/v1/rental/end/:id/:userId/:scooterId', jwtMiddleware, rentals.endRental);

module.exports = router;
