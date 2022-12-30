const mongoose = require('mongoose')
const carousalSchema = mongoose.Schema({
    image: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    offer: String
});

const carousalModel = mongoose.model('carousal', carousalSchema);
module.exports = carousalModel