const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const categoryDBModel = require('../models/category.js')
const productDBModel = require('../models/product.js')
const file = require('../utils/file')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);
var productModel = new productDBModel.Schema();

exports.index = function(req, res){
    console.log(req.params.product)
    var productId = req.params.product

    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        productModel.find({'id':productId},function(err, product) { //QUERIED RESULTS FROM URL

            var title = product[0].page_title
            res.render('product',{title:title,allCategories : allCategories,product : product[0]})
          });
    });
};

exports.getColor = function(req, res){
    var productId = req.params.pid

    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        productModel.find({'id':productId},function(err, product) { //QUERIED RESULTS FROM URL
            res.json({
                productColors : product[0].variation_attributes[0].values,
                productImages : product[0].image_groups
            })
          });
    });
};
