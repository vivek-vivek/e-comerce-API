const productModel = require('../models/productModel')
const addressModel = require('../models/addressModel')

exports.create = async (req, res) => {
    try {
        const { addressId, productids } = req.body
        if (!addressId || !productids) return res.status(400).json({ message: 'all fields required' })
        const products = productids.map(async e => {
            return await productModel.findById(e)
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}