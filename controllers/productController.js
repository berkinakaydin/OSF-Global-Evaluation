const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const categoryDBModel = require('../models/category.js')
const productDBModel = require('../models/product.js')
const file = require('../utils/file')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);
var productModel = new productDBModel.Schema();

exports.index = function(req, res){
    var productId = req.params.product

    productModel.findOne({'id':productId},function(err, product) { //QUERIED RESULTS FROM URL
        var title = product.page_title
        res.render('product',{title:title,product : product})
      });
};

exports.getColor = function(req, res){
    var productId = req.params.pid

    productModel.findOne({'id':productId},function(err, product) { //QUERIED RESULTS FROM URL
        res.json({
            productColors : product.variation_attributes[0].values,
            productImages : product.image_groups
        })
      });
};

exports.getPrice = function(req,res){
    var productId = req.params.pid

    productModel.findOne({'id':productId},function(err, product) { //QUERIED RESULTS FROM URL
        res.json({
            price : product.price
        })
      });
}
