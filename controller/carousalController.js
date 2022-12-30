const carousalModel = require('../models/carousalModel')



exports.getAllCarosuals = async (req, res) => {
    try {
        const carousals = await carousalModel.find({})
        res.status(200).json(carousals)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.createCarousal = async (req, res) => {
    try {
        const { offer } = req.body
        const image = req.file.filename
        const newCarousal = new carousalModel({
            offer,
            image
        })
        await newCarousal.save()
        res.status(201).json({ message: 'carousal added successfully' })
    } catch (error) {

    }
}