const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/products");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${Math.floor(Math.random() * 1000)}${file.fieldname}-${Date.now()}.${ext}`);
    },
})
const upload = multer({ storage })

router.route('/')
    .get(productController.getAllProducts)
    .post(upload.array('images', 5), productController.createProducts)
router.route('/:id')
    .get(productController.getAProducts)
//     .patch(userController.updateUser)
module.exports = router