const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')


router.route('/')
    .get(userController.getAUser)
router.route('/:id')
    .get(userController.getAuser)
    .patch(userController.updateUser)
module.exports = router