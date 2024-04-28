
const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')
const auth = require('../middleware/auth')
router.post('/signup', userController.postSignup)
router.post('/login', userController.postLogin)
router.post('/logout', userController.postLogout)
router.get('/getUser', auth, userController.getUser)
module.exports = router;
