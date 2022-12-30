const express = require('express')
const router = express.Router()
const carousalController = require('../controller/carousalController')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/carousals");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
})
const upload = multer({ storage })

router.route('/')
    .get(carousalController.getAllCarosuals)
    .post(upload.single('carousal'), carousalController.createCarousal)
// router.route('/:id')
//     .get(userController.getAuser)
//     .patch(userController.updateUser)
module.exports = router