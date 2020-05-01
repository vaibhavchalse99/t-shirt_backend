const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');


exports.getProductById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err || !product){
            return res.status(400).json({
                error : "Product Not Found"
            })
        }
        req.product = product;
        next();
    })
}

exports.createProduct = (req,res)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }
        //destructure the field

        const {name, description, price, category, stock} = fields

        if( !name || !description || !price || !category || !stock){
            return res.status(400).json({
                error:"Please include all fields"
            })
        }

        //TODO: restriction on field
        let product = new Product(fields)

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"file size is too big!"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type

        }
        
        //save the file
        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error:"Insertion in DB failed"
                })
            }
            res.json(product)
        })

    })
}

exports.getProduct = (req,res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

//deleteCotroller
exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,product)=>{
        if(err || !product){
            return res.status(400).json({
                error:"Failed to delete a Product"
            })
        }
        res.json({
            message:`Successfully Deleted ${product.name}`
        })
    })
    
}

//updateCotroller
exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }
        
        //updation code
        let product = req.product;
        product = _.extend(product,fields) //simply update the product with fields


        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"file size is too big!"
                })
            }

            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type

        }
        
        //save the file
        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error:"Insertion in DB failed"
                })
            }
            res.json(product)
        })

    })
}

exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy,"asc"]])
        .limit(limit)     //fields which we want to display
        .exec((err,products)=>{
            if(err || !products){
                return res.status(400).json({
                    error:"Products not Found"
                })
            }
            res.json(products)

    })
}


exports.updateStock = (req,res,next) =>{
    let myOpertion = req.body.order.products.map( prod => {
        return{
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc : {stock: -prod.count ,sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOpertion,{},(err,products) =>{
        if(err || !products){
            return res.status(400).json({
                error:"BULK Operation Failed"
            })
        }

        next()
    })

}


exports.getAllUniqueCategory = (req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err || !category){
            return res.status(400).json({
                error:"No Category Found"
            })
        }
        res.json(category);
    })

}