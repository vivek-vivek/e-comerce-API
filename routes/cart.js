const express = require('express')
const router = require('express').Router();
const cartController = require('../controller/cartController')
const prductRoute = express.Router({ mergeParams: true })
router.use('/:cartid', prductRoute)
router.route('/')
    .get(cartController.getACart)
    .post(cartController.AddCart)
    .patch(cartController.removeFromCart)
prductRoute.route('/product/:id')
    .get(cartController.getSingleProduct)
module.exports = router