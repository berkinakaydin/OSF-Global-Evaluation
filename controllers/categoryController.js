var path    = require("path");
var fs = require('fs')
const categoryDBModel = require('../models/category.js')
const productDBModel = require('../models/product.js')
const mongoose = require('mongoose')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);
var productModel = new productDBModel.Schema();


exports.index = function(req, res){
    var url = req.path.replace('/','')
    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        categoryModel.find({id:url},function(err, category) { //QUERIED RESULTS FROM URL
            var title = category[0].page_title
            res.render('category', {title:title, allCategories : allCategories , category : category})
          });
    });
  };

exports.subcatagory = function(req,res){
    var url = req.path
    var category = url.split('/')[1]
    var subcategory=  url.split('/')[2]

    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        categoryModel.find({'id':category },{'categories': {$elemMatch: {'id': subcategory}}},function (err, subcategory) {
            var title = subcategory[0].categories[0].page_title
            var subcategory = subcategory[0].categories[0]
            res.render('subcategory',{title:title, subcategory : subcategory, allCategories : allCategories})  //WOW
          });
    });
};

exports.products = function(req, res){
    var url = req.path.replace('/','')
  
    var productCategory = url.split('/')[2]
    console.log(url)
    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        productModel.find({primary_category_id:productCategory},function(err, products) { //QUERIED RESULTS FROM URL

            var productCategory = products[0].primary_category_id.replace(/-/g, " ");
            productCategory = titleCase(productCategory);        
            
            var title = productCategory
            res.render('category_product', {title:title, allCategories : allCategories, products : products, parentUrl : url})
          });
    });
};

function titleCase(str) {
    return str.toLowerCase().split(' ').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');
  }