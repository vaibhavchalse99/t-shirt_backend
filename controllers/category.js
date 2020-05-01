const Category = require('../models/category');


exports.getCategoryById = (req,res,next,id) =>{
    Category.findById(id).exec((err,cate) => {
        if(err || !cate){
            return res.status(400).json({
                error:"Category Not Found"
            })
        }
        req.category = cate
        next()
    });
}

exports.createCategory = (req,res)=>{
    const category = new Category(req.body)
    category.save((err,cate)=>{
        if(err || !cate){
            return res.status(400).json({
                error:"Not able to save Category in DB"
            })
        }
        res.json({cate})
    })

}

exports.getCategory = (req,res)=>{
    return res.json(req.category)
}


exports.getAllCategory = (req,res)=>{
    Category.find().exec((err,categories)=>{
        if(err || !categories){
            return res.status(400).json({
                error:"No Category Found"
            });
        }
        res.json(categories);
    });
}

exports.updateCategory = (req,res)=>{
    const category = req.category;
    category.name = req.body.name;
    category.save((err,updatedCategory)=>{
        if(err || !updatedCategory){
            return res.status(400).json({
                error:"Failed to update Category"
            });
        }
        res.json(updatedCategory) 
    })    
}

exports.deleteCategory = (req,res)=>{
    const category = req.category;
    category.remove((err,category)=>{           //category which was just deleted
        if (err || !category){
            return res.status(400).json({
                error:"No Such Category Present"
            })
        }
        res.json({
            message: `successfully deleted a ${category.name}`
        })
    })
}