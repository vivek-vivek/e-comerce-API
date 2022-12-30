const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: String,
    fullName: String,
    phone: String,
    pin: String,
    state: String,
    place: String,
    address: String,
    landMark: String
})

const addressModel = mongoose.model('address', addressSchema)

module.exports = addressModel