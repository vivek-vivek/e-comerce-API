const userModel = require('../models/userModel')



exports.getAllUser = async (req, res) => {
    try {
        const users = await userModel.find({})
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
exports.createUser = async (req, res) => {
    try {
        const { fullname, email, mobile, dob, gender } = req.body
        const newUser = new userModel({ fullname, email, mobile, dob, gender })
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        console.log(error)
    }
}
exports.getAUser = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.query.email })
        if (!user) return res.status(201).json(user)
        // if (!user) return res.status(302).json({ messsage: 'no user found' })
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}
exports.getAuser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        if (!user) return res.status(400).json(user)
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}
exports.updateUser = async (req, res) => {
    try {

    } catch (error) {

    }
}

