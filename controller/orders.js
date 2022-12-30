const orderModel = require('../models/order')
const cartModel = require('../models/cartModel')
const addressModel = require('../models/addressModel')
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userid: req.user }).populate({ path: 'products', populate: 'product' })
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
exports.createOrder = async (req, res) => {
    try {
        const { addressId, paymentType, products } = req.body
        if (!addressId || !paymentType || !products.length) return res.status(400).json({ message: 'all fields required' })
        const cart = await cartModel.findOne({ userid: req.user })
        if (!cart) return res.status(400).json({ message: 'no cart found' })
        const orderProducts = await cart.products.filter(product => products.find(e => e.id == product._id))
        if (!orderProducts.length) return res.status(400).json({ message: 'product not found in cart' })
        const totalPrice = await orderProducts.reduce((acc, curr) => {
            return acc + curr.price
        }, 0)
        const totalDiscount = await orderProducts.reduce((acc, curr) => {
            return acc + curr.discountPrice
        }, 0)
        const { fullName,
            phone,
            pin,
            state,
            place,
            address,
            landMark } = await addressModel.findById(addressId)
        let orderDate = new Date()
        let deliveryDate = new Date()
        deliveryDate.setDate(orderDate.getDate() + 3)
        const totalItem = cart.products.reduce((acc, curr) => {
            return acc + curr.qty
        }, 0)
        let newOrder
        if (paymentType === "COD") {
            newOrder = new orderModel({
                userid: req.user,
                products: orderProducts,
                paymentType,
                orderStatus: "confirmed",
                fullName,
                phone,
                pin,
                state,
                place,
                address,
                landMark,
                orderDate: orderDate,
                deliveryDate,
                totalItem,
                totalPrice,
                totalDiscount
            })
            await newOrder.save()
        } else if (paymentType === "ONLINE_PAYMENT") {
            newOrder = new orderModel({
                userid: req.user,
                products: orderProducts,
                paymentType,
                paymentStatus: true,
                orderStatus: "confirmed",
                fullName,
                phone,
                pin,
                state,
                place,
                address,
                landMark,
                orderDate: orderDate,
                deliveryDate,
                totalItem,
                totalPrice,
                totalDiscount
            })
            await newOrder.save()
        }
        cart.products = await cart.products.filter(product => !(products.find(e => e.id == product._id)))
        cart.totalDiscount -= totalDiscount
        cart.totalPrice -= totalPrice
        await cart.save()
        const order = await orderModel.findById(newOrder._id).populate({ path: 'products', populate: 'product' })
        return res.status(201).json({ message: 'order placed successfully', order })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
exports.getAOrders = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.orderId).populate({ path: 'products', populate: 'product' })
        res.status(200).json(order)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
exports.cancelOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.orderId)
        if (!order) return res.status(400).json({ message: 'no order found' })
        if (order.orderStatus == 'CANCELED') return res.status(400).json({ message: 'order already canceled' })
        const cancelDate = new Date()
        await orderModel.findByIdAndUpdate(req.params.orderId, { $set: { orderStatus: 'CANCELED', cancelDate } })
        res.status(200).json({ message: 'order canceled successfullly' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}