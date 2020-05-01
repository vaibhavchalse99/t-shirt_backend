const User = require('../models/user')
const Order = require('../models/order')

exports.getUserById = (req, res, next, id)=>{
    User.findById(id).exec((err,user)=>{
        if (err || !user){
            return res.status(400).json({
                error:"No user is found in DB"
            })
        }
        req.profile = user; 
        next();
    })
}

exports.getUser = (req,res)=>{
    req.profile.salt = undefined
    req.profile.ency_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined

    return res.json(req.profile)
}

exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify:false},
        (err,user)=>{
            if(err || !user){
                return res.status(400).json({
                    error : "you are not Authorized to update user"
                })
            }
            user.salt = undefined
            user.ency_password = undefined
            res.json(user);
        }
    )
}

exports.userPurchesList = (req,res)=>{
    Order.find({user:req.profile._id})
        .populate("user","_id name")
        .exec((err,order)=>{
            if(err || !order){
                return res.status(400).json({
                    error:"No Order for this User"
                })
            }
            res.json(order)
        })
}


exports.addOrderToPurchase = (req,res,next)=>{
    let purchases = [] 
    req.body.order.products.forEach(product=>{
        purchases.push({
            _id:product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            price: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    });

    // store this in DB

    User.findOneAndUpdate(                    //it is not overqwriting the purches it is going to update a purcheses
        {_id :req.profile._id},
        {$push: {purchess: purchases}},        //as it is a array we are using $push
        {new :true},                            //means send me back the objects which is updated one not a privious one
        (err, purchases) =>{
            if(err || !purchases){
                return res.status(400).json({
                    error:"Unable to save a user"
                })
            }
            next();
        }
    )
}