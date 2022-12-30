const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    discountPrice: Number,
    offer: Number,
    size: [String],
    image: [String],
    category: {
        type: mongoose
            .Schema.Types.ObjectId,
        ref: 'category'
    },
    rating: String,
    deliveryFee: String,
})

const productModel = mongoose.model('products', productSchema)

module.exports = productModel