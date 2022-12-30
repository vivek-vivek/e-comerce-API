const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    userid: String,
    otp: String,
})

const otpModel = mongoose.model('otp', otpSchema);
module.exports = otpModel;