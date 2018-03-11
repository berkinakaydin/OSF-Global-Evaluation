const categoryDBModel = require('../models/category.js')
const productDBModel = require('../models/product.js')
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);
var productModel = new productDBModel.Schema();


exports.index = function(req, res,next){ 
    var category = req.params.category
    
    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        categoryModel.find({id:category},function(err, category) { //QUERIED RESULTS FROM URL
            if(typeof category[0] === 'undefined'){ //ERROR HANDLE
                return next()
            }
            var title = category[0].page_title
            res.render('./category/category', {title:title, allCategories : allCategories , category : category})
          });
    });
  };

  exports.subcategory = function(req,res,next){
    var category = req.params.category
    var subcategory= req.params.subcategory

    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        categoryModel.find({'id':category},{'categories': {$elemMatch: {'id': subcategory}}},function (err, subcategory) {

            if(typeof subcategory[0] === 'undefined'){ //ERROR HANDLE
                return next()
            }
                
            var title = subcategory[0].categories[0].page_title
            var subcategory = subcategory[0].categories[0]
            res.render('./category/subcategory',{title:title, subcategory : subcategory, allCategories : allCategories})  //WOW
          });
    });
    
};


exports.products = function(req, res,next){
    var parentURL = req.path
    var productCategory = req.params.category_product

    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        productModel.find({primary_category_id:productCategory},function(err, products) { //QUERIED RESULTS FROM URL
            if(typeof products[0] !== 'undefined'){  //SOME CATEGORIES HAVE NO PRODUCT!
                var productCategory = products[0].primary_category_id.replace(/-/g, " ");
                productCategory = titleCase(productCategory);        
                
                var title = productCategory
                res.render('./category/category_product', {title:title, allCategories : allCategories, products : products, parentURL : parentURL})
            }
            else{
                res.render('./category/category_product', {title:title, allCategories : allCategories, products : {}, parentURL : parentURL})
            }
          });
    });
    
};


function titleCase(str) {
    return str.toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');
  }