const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    phone: String,
    refreshToken: [String]
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel