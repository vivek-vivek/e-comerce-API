const mongoose = require('mongoose')
const categorySchema = mongoose.Schema({
    name: String,
    image: String,
})

const carousalModel = mongoose.model('category', categorySchema)

module.exports = carousalModel