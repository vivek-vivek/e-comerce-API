const addressModel = require('../models/addressModel')


exports.getAllAddress = async (req, res) => {
    try {
        const address = await addressModel.find({ user: req.user })
        res.status(200).json(address)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
exports.CreateAddress = async (req, res) => {
    try {
        const { title, fullName, phone, pin, state, place, address, landMark } = req.body
        if (!title || !fullName || !phone || !pin || !state || !place || !address || !landMark) return res.status(400).json({ message: 'all fields required' })
        const newAddress = new addressModel({ user: req.user, title, fullName, phone, pin, state, place, address, landMark })
        await newAddress.save()
        res.status(201).json({ message: 'address added successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
exports.getAAddress = async (req, res) => {
    try {
        const address = await addressModel.findById(req.params.addId)
        res.status(200).json(address)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
exports.updateAddress = async (req, res) => {
    try {
        const { title, fullName, phone, pin, state, place, address, landMark } = req.body
        if (!title || !fullName || !phone || !pin || !state || !place || !address || !landMark) return res.status(400).json({ message: 'all fields required' })
        await addressModel.findByIdAndUpdate(req.params.addId, { $set: req.body })
        res.status(202).json({ message: 'address updated successfully' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
exports.deleteAddress = async (req, res) => {
    try {
        await addressModel.findByIdAndDelete(req.params.addId)
        res.status(202).json({ message: 'address deleted successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}