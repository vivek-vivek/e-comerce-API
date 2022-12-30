const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')

exports.getACart = async (req, res) => {
    try {
        const cart = await cartModel.findOne({ userid: req.user }).populate({ path: 'products', populate: 'product' })
        res.status(200).json(cart)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'someting went wrong' })
    }
}
exports.AddCart = async (req, res) => {
    try {

        const { product, qty, size } = req.body
        if (!product || !qty || !size) return res.status(400).json({ message: 'all fields require' })
        const found = await cartModel.findOne({ userid: req.user })
        const productDetails = await productModel.findById(product)
        if (!productDetails) return res.status(400).json({ message: "no product found" })
        const price = productDetails.price * qty
        const discountPrice = productDetails.discountPrice * qty
        const products = { product, qty, size, price, discountPrice }
        if (!found) {
            const newCart = new cartModel({ userid: req.user, products, totalPrice: price, totalDiscount: discountPrice })
            await newCart.save()
            return res.status(201).json({ message: 'product added to cart successfully' })
        }
        if (!found.products.find(e => e.product == product && e.size == size)) {
            await cartModel.findByIdAndUpdate(found._id, { $push: { products: { product, qty, size, price, discountPrice } } })
            await cartModel.findByIdAndUpdate(found._id, { $inc: { totalPrice: price, totalDiscount: discountPrice } })
            return res.status(201).json({ message: 'product added to cart successfully' })
        }
        await cartModel.updateOne({ 'products.product': product }, { '$inc': { 'products.$.qty': qty, 'products.$.price': price, 'products.$.discountPrice': discountPrice } })
        await cartModel.findByIdAndUpdate(found._id, { $inc: { totalPrice: price, totalDiscount: discountPrice } })
        res.status(201).json({ message: 'cart updated successfully' })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'someting went wrong' })
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        const { product } = req.body
        if (!product) return res.status(400).json({ message: 'all fields require' })
        const cart = await cartModel.findOne({ userid: req.user }).populate({ path: 'products', populate: 'product' })
        if (!cart) return res.status(400).json({ message: 'bad request' })
        const productDetail = cart.products.filter(e => e.product._id == product)
        const price = productDetail[0].price * -1
        const discountPrice = productDetail[0].discountPrice * -1
        await cartModel.findByIdAndUpdate(cart._id, { $inc: { totalPrice: price, totalDiscount: discountPrice } })
        await cartModel.findOneAndUpdate({ userid: req.user }, { $pull: { products: { product } } })
        res.status(201).json({ message: 'item removed from cart' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'someting went wrong' })
    }
}
exports.getSingleProduct = async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cartid).populate({ path: 'products', populate: 'product' })
        const product = cart.products.filter(e => e.product._id == req.params.id)
        res.status(200).json(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })

    }
}