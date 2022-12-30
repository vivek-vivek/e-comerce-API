const userModel = require('../models/userModel');
const twilio = require('../utils/twilio')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const otpModel = require('../models/otp')
const JWT = require('jsonwebtoken')
const jwt = require('../utils/Token')
const asyncHandler = require('express-async-handler')



exports.signup = async (req, res) => {
    const { email, password, phone, fullname } = req.body
    try {
        const olduser = await userModel.findOne({ email })
        if (olduser) return res.status(400).json({ message: "user already exist" })
        if (!email || !password || !phone || !fullname) return res.status(400).json({ message: 'all fields required' })
        const hash = await bcrypt.hash(password, 10)
        const newUser = new userModel({ email, password: hash, phone, fullname })
        await newUser.save();
        const accessToken = jwt.createAccessToken(newUser._id)
        const refreshToken = jwt.createRefreshToken(newUser._id)
        await userModel.findByIdAndUpdate(newUser._id, { $push: { refreshToken } })
        res.status(201).json({ refreshToken, accessToken })

    } catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) return res.status(400).json({ message: 'all fields requied' })
        const user = await userModel.findOne({ email })
        if (!user) return res.status(401).json({ message: "invaild username " })
        const result = await bcrypt.compare(password, user.password)
        if (!result) return res.status(401).json({ message: "invaild password" })
        const accessToken = jwt.createAccessToken(user._id)
        const refreshToken = jwt.createRefreshToken(user._id)
        await userModel.findByIdAndUpdate(user._id, { $push: { refreshToken } })
        res.status(200).json({ refreshToken, accessToken })
    } catch (error) {
        console.log(error)
    }
}

exports.verifyotp = async (req, res) => {
    try {
        const { otp, email } = req.body
        if (!otp || !email) return res.status(400).json({ message: 'all fields required' })
        const found = await otpModel.findOne({ userid: email })
        if (!found) return res.status(401).json({ message: 'something went wrong' })
        if (found.otp !== otp) return res.status(401).json({ message: 'invalid otp' });
        await otpModel.findOneAndDelete({ userid: email })
        res.status(200).json({ status: 'ok', message: "otp verified successfully", verified: true })
    } catch (error) {
        console.log(error)
    }
}


exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: 'email required' })
        const otp = Math.floor(1000 + Math.random() * 9000)
        const found = await otpModel.findOne({ userid: email })
        if (found) {
            found.otp = otp;
            const data = await twilio.sendOtp(email, otp)
            await found.save()
            return res.status(200).json({ message: 'otp send successfully' })
        }
        const otpM = new otpModel({ userid: email, otp })
        await otpM.save()
        const data = await twilio.sendOtp(email, otp)
        console.log(data)
        res.status(200).json({ message: "otp send successfully" })
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }
}
exports.forgotPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'all fields required' })
        const user = await userModel.findOne({ email: email })
        user.password = password
        await user.save()
        res.status(202).json({ message: "password updated" })
    } catch (error) {

    }
}

exports.googleLogin = async (req, res) => {
    try {
        const { email, name } = req.body
        if (!email || !name) return res.status(401)
        const user = new userModel({ email, fullname: name })
        await user.save()
        res.status(201).json({ message: "user create" })
    } catch (error) {
        console.log(error)
    }
}
exports.refresh = asyncHandler(async (req, res) => {

    const cookie = req.headers.refresh;
    if (!cookie) return res.status(401).json({ message: "Unauthorized" })
    const refreshToken = cookie.split(' ')[1]
    const foundUser = await userModel.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {

        JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHandler(async (err, decoded) => {
            if (err) {
                console.log(err)
                return res.status(403);
            }
            const hacked = await userModel.findById(decoded.user).exec();
            hacked.refreshToken = [];
            await hacked.save()
            return res.status(403).json({ message: 'forbidden' })
        }))
        return
    }
    const newArray = foundUser.refreshToken.filter(e => e !== refreshToken)
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHandler(async (err, decoded) => {
        if (err) {

            foundUser.refreshToken = newArray
            await foundUser.save();
            return res.status(403).json({ message: 'forbidden' })
        }
        const newRefreshToken = jwt.createRefreshToken(foundUser._id)

        const accessToken = jwt.createAccessToken(foundUser._id)
        foundUser.refreshToken = [...newArray, newRefreshToken]
        await foundUser.save();
        res.json({ refreshToken: newRefreshToken, accessToken })
    }))

})

exports.logout = async (req, res) => {
    try {
        const refreshToken = req.headers.refresh
        if (!refreshToken) return res.status(400).json({ message: 'refreshToken missing' })
        await userModel.findByIdAndUpdate(req.user, { $pull: { refreshToken } })
        res.status(200).json({ message: 'logout successfull' })
    } catch (error) {

    }
}