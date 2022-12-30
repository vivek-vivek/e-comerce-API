const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' } }]
})

const wishlistModel = mongoose.model('wishlist', wishlistSchema)

module.exports = wishlistModel