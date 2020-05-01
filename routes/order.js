const express = require('express');
const router = express.Router()

const {
    isSignedIn,
    isAdmin,
    isAuthenticated
} = require('../controllers/auth');
const {getUserById, addOrderToPurchase} = require('../controllers/user');
const {updateStock} = require('../controllers/product')

const {getOrderById, createOrder, getAllOrders, updateStatus,getOrderStatus} = require('../controllers/order')
 
//params
router.param('orderId',getOrderById);
router.param('userId',getUserById);

//routes
//create
router.post("/order/create/:userId",isSignedIn,isAuthenticated,addOrderToPurchase,updateStock,createOrder)

//read 
router.get('/order/all/:userId',isSignedIn,isAuthenticated,isAdmin,getAllOrders)

//status of Order
router.get('/order/status/:userId',isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
router.put('/order/:orderId/status/:userId',isSignedIn,isAuthenticated,isAdmin,updateStatus)

module.exports = router;