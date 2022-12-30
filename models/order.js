const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: [{
        product:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        qty: Number,
        price: Number,
        discountPrice: Number,
        size: String
    }],
    paymentType: String,
    paymentStatus: {
        type: Boolean,
        default: false
    },
    orderStatus: String,
    fullName: String,
    phone: String,
    pin: String,
    state: String,
    place: String,
    address: String,
    landMark: String,
    orderDate: Date,
    deliveryDate: Date,
    deliveredDate: Date,
    cancelDate: {
        type: Date,
        default: null
    },
    totalPrice: Number,
    totalDiscount: Number,
    totalItems: Number,
})

const orderModel = mongoose.model('order', orderSchema)
module.exports = orderModel