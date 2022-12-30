const categoryModel = require('../models/categoryModel')

exports.getAllCategory = async (req, res) => {
    try {
        const categorys = await categoryModel.find({})
        res.status(200).json(categorys)
    } catch (error) {

    }
}
exports.createCategory = async (req, res) => {
    try {
        const image = req?.file?.filename
        const name = req.body.category
        const newCategory = new categoryModel({ image, name })
        await newCategory.save()
        res.status(201).json({ message: 'category added successfully' })
    } catch (error) {

    }
}