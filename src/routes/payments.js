const express = require('express');

const payment = require('../controller/payments.js');
const {jwtMiddleware} = require('../middleware/jwt-middleware.js');

const router = express.Router();

router.get('/v1/payment', jwtMiddleware, payment.getPayments);
router.get('/v1/payment/:id', jwtMiddleware, payment.getOnePayment);
router.get('/v1/payment/user/:id', jwtMiddleware, payment.getUserPayment);
router.get('/v1/payment/amount/:amount', jwtMiddleware, payment.getAmountPayment);
router.get('/v1/payment/new/:rentalId/:userId/:paymentMethod/:amount', jwtMiddleware, payment.createPayment);

module.exports = router;

