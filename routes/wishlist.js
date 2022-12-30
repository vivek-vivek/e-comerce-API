const express = require('express')
const router = express.Router()
const wishlistController = require('../controller/wishlist')

router.route('/')
    .get(wishlistController.getWishlist)
    .post(wishlistController.AddAndRemoveWishlist)

module.exports = router