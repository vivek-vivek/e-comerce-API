const wishlistModel = require('../models/wishListModel')

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistModel.findOne({ userId: req.user }).populate('products.product')
        res.status(200).json(wishlist)
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

exports.AddAndRemoveWishlist = async (req, res) => {
    try {
        if (!req?.body?.product) return res.status(400).json({ message: 'all fields required' })
        const found = await wishlistModel.findOne({ userId: req.user })
        if (!found) {
            const newWishlist = new wishlistModel({ userId: req.user, products: [{ product: req.body.product }] })
            await newWishlist.save()
            return res.status(201).json({ message: 'product added to wishlist' })
        }
        if (!found.products.find(e => e.product == req.body.product)) {
            await wishlistModel.findByIdAndUpdate(found._id, { $push: { products: { product: req.body.product } } })

            return res.status(201).json({ message: 'product added to wishlist' })
        }
        await wishlistModel.findByIdAndUpdate(found._id, { $pull: { products: { product: req.body.product } } })
        return res.status(204).json({ message: 'product removed from wishlist' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}