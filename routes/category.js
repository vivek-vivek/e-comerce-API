const express = require('express')
const router = express.Router()
const categoryController = require('../controller/categoryController')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/category");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
})
const upload = multer({ storage })

router.route('/')
    .get(categoryController.getAllCategory)
    .post(upload.single('category'), categoryController.createCategory)
module.exports = router