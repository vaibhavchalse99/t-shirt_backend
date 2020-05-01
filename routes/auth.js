const express = require('express')
const router = express.Router()
const { check } = require('express-validator');

const { signout , signin , signup , isSignedIn} = require('../controllers/auth')

router.get('/signout',signout)

router.post('/signup',[
    check("name","Name should be more than 3 character").isLength({min:3}),
    check("email","Please Enter the valid Email").isEmail(), 
    check("password","Password should be more than 3 character").isLength({min:3})
],signup)

router.post('/signin',[
    check("email","Please Enter the valid Email").isEmail(), 
    check("password","Password should be more than 3 character").isLength({min:3})
],signin)

router.get('/testroute',isSignedIn,(req,res)=>{
    res.json(req.auth)
})

module.exports = router