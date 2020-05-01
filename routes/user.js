const express = require('express')
const router = express.Router()

const {isSignedIn, isAuthenticated, isAdmin} = require('../controllers/auth')
const {getUser,getUserById,updateUser, userPurchesList} = require('../controllers/user')

router.param("userId",getUserById)

router.get('/user/:userId',isSignedIn,isAuthenticated, getUser)

router.put('/user/:userId',isSignedIn,isAuthenticated,updateUser)

router.get('/order/user/:userId',isSignedIn,isAuthenticated,userPurchesList) 




module.exports = router;
