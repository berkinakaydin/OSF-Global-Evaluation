var path    = require("path");
var fs = require('fs')
const categoryDBModel = require('../models/category.js')
const mongoose = require('mongoose')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);

exports.index = function(req, res){
    var url = req.path.replace('/','')
    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        categoryModel.find({id:url},function(err, categories) { //QUERIED RESULTS FROM URL
            res.render('category', {allCategories : allCategories , categories : categories})
          });
    });
  };

  