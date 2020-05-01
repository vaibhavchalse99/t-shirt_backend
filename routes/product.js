const express = require('express');
const router = express.Router();

const {
    getProductById,
    getProduct, 
    createProduct,
    photo,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getAllUniqueCategory
} = require('../controllers/product');
const {isSignedIn, isAdmin, isAuthenticated} = require('../controllers/auth');
const {getUserById} = require('../controllers/user')

//all of params
router.param("userId",getUserById);
router.param("productId",getProductById);

//all of routes
router.post(
    '/product/create/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct
)

//read route
router.get('/product/:productId',getProduct)
router.get('/product/photo/:productId',photo)

//delete route
router.delete(
    '/product/:productId/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteProduct
)

//update
router.put(
    '/product/:productId/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct
)

router.get('/products',getAllProducts)

router.get('/products/categories',getAllUniqueCategory)



module.exports = router