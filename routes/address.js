const router = require('express').Router()
const address = require('../controller/address')

router.route('/')
    .get(address.getAllAddress)
    .post(address.CreateAddress)

router.route('/:addId')
    .get(address.getAAddress)
    .patch(address.updateAddress)
    .delete(address.deleteAddress)

module.exports = router