var path    = require("path");
var fs = require('fs')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient
const categoryDBModel = require('../models/category.js')
const productDBModel = require('../models/product.js')
const file = require('../utils/file')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);
var productModel = new productDBModel.Schema();

exports.index = function(req, res){
    var url = req.path.replace('/','')
    var productCategory = url.split('/')[2]

    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        productModel.find({'primary_category_id':productCategory},function(err, products) { //QUERIED RESULTS FROM URL
           console.log('amk')
            res.render('category_product', {title:'wow', allCategories : allCategories, products : products})
          });
          
    });
};

