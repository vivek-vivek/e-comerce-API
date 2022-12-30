require('dotenv').config()

const nodemailer = require("nodemailer");


exports.sendOtp = async (email, otp) => {
    try {
        let transporter = nodemailer.createTransport({

            service: 'Gmail',
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        })

        transporter.sendMail({
            from: "hello@gmail.com",
            to: email,
            subject: 'verify your account',
            text: 'verify your account ',
            html: `<p>verify your account with this otp :<b>${otp}</b></p>`
        }, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log(info)
            }
        })


    } catch (error) {
        console.log(error)
    }
}
