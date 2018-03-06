const mongoose = require('mongoose')

const categoryDBModel = require('../models/category.js')
const productDBModel = require('../models/product.js')
const file = require('../utils/file')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);
var productModel = new productDBModel.Schema();

exports.index = function(req, res){
    var productId = req.params.product

    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        productModel.find({'id':productId},function(err, product) { //QUERIED RESULTS FROM URL

            var title = product[0].page_title
            res.render('product',{title:title,allCategories : allCategories,product : product[0]})
          });
    });
};

exports.colors = function(req, res){

    var url = req.path.replace('/','')
    var productId = '25604524';//url.split('/')[3]

    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        productModel.find({'id':productId},function(err, product) { //QUERIED RESULTS FROM URL

            res.json({product : product[0]})
          });
    });
};
