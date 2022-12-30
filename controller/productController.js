const productModel = require('../models/productModel')

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find(req.query)
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
    }
}
exports.createProducts = async (req, res) => {
    try {
        const { name, price, offer, size, category, rating } = req.body
        const image = req.files.map(e => e.filename)
        if (!name || !price || !offer || !size || !category || !rating) return res.status(400).json({ message: 'all fields require' })
        const discountPrice = price * (Number(offer) / 100)
        const newProduct = new productModel({ name, price, discountPrice, offer, size, category, rating, image })
        await newProduct.save()
        res.status(201).json({ message: 'product added successfully' })
    } catch (error) {
        console.log(error)

    }
}
exports.getAProducts = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {

    }
}