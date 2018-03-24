const categoryDBModel = require('../models/category.js')
const productDBModel = require('../models/product.js')
const mongoose = require('mongoose')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);
var productModel = new productDBModel.Schema();

exports.index = function (req, res, next) {
    res.render('./category/category')
};

exports.subcategory = function (req, res, next) {
    res.render('./category/subcategory')
};

exports.category_product = function(req,res,next){
    res.render('./category/category_product')
}

exports.getCategories = function (req, res) {
    var categories = categoryModel.find()
 
    categories.then(function (categories) {
        res.json({
            categories: categories
        })
    })
}

exports.search = function(req,res){
    if(req.method === 'POST'){
        var query = req.body.search
        productModel.find({'name' : { "$regex": query, "$options": "i" }},function(err,products){
            if(products){
                res.json({success:true,result:products})
            }
            else{
                res.json({success:false,result:{}})
            }         
        })
    }
    else{
        res.render('search')
    }
}

exports.getCategory_Products = function(req,res){
    
    var categoryId = req.body.categoryId
    productModel.find({
        primary_category_id: categoryId
    }, function (err, products) { //QUERIED RESULTS FROM URL
        if (products[0] != null) { //SOME CATEGORIES HAVE NO PRODUCT!
            var productCategory = products[0].primary_category_id.replace(/-/g, " ");
            productCategory = titleCase(productCategory);
            var title = productCategory
            res.json({success:true, title : productCategory, products : products})
        } else {
            res.json({success:true, title : productCategory, products : {}})
        }
    });
}

function titleCase(str) {
    return str.toLowerCase().split(' ').map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
}