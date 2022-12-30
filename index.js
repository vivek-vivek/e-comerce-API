const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var morgan = require('morgan')
require('dotenv').config()
const cors = require('cors');
const app = express()
app.use(morgan('tiny'));
const verifyJWT = require('./middleware/verifyJWT')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const carousalRoute = require('./routes/carousal')
const categoryRoute = require('./routes/category')
const productRoute = require('./routes/product')
const WishlistRoute = require('./routes/wishlist')
const cartRoute = require('./routes/cart')
const addressRoute = require('./routes/address')
const orderRoute = require('./routes/orders')
const port = process.env.PORT || 5000;
const connectionString = process.env.DB_CONNECTION_STRING



app.use(cors())
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static('uploads'))
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/carousal', verifyJWT, carousalRoute)
app.use('/api/v1/category', verifyJWT, categoryRoute)
app.use('/api/v1/products', verifyJWT, productRoute)
app.use('/api/v1/wishlist', verifyJWT, WishlistRoute)
app.use('/api/v1/address', verifyJWT, addressRoute)
app.use('/api/v1/cart', verifyJWT, cartRoute)
app.use('/api/v1/orders', verifyJWT, orderRoute)
app.use('/api/v1/summary', verifyJWT,)




// app.use('/api/v1/products')

mongoose.connect(connectionString).then(() => {
    app.listen(port, () => {
        console.log("server running on port : " + port)
    })
}).catch((err) => {
    console.log(err.message)
})