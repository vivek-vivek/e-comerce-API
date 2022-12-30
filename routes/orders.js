const router = require('express').Router()
const orderController = require('../controller/orders')
router.route('/')
    .get(orderController.getAllOrders)
    .post(orderController.createOrder)

router.route('/:orderId')
    .get(orderController.getAOrders)
    .patch(orderController.cancelOrder)


module.exports = router