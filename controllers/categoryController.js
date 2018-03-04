var path    = require("path");
var fs = require('fs')
const categoryDBModel = require('../models/category.js')
const mongoose = require('mongoose')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);

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
            res.render('subcategory',{title:subcategory[0].categories[0].page_title, subcatagory : subcategory[0].categories[0]})  //WOW
          });
    });
};

  