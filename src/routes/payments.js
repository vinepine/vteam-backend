const payment = require('../controller/payments.js');

const express = require('express');

const router = express.Router();

router.get('/v1/payment', payment.getPayments);
router.get('/v1/payment/:id', payment.getOnePayment);
router.get('/v1/payment/user/:id', payment.getUserPayment);
router.get('/v1/payment/amount/:amount', payment.getAmountPayment);
router.get('/v1/payment/new/:rentalId/:userId/:paymentMethod/:amount', payment.createPayment);

module.exports = router;

