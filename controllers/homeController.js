var path    = require("path");
var fs = require('fs')
const mongoose = require('mongoose')
const categoryDBModel = require('../models/category.js')
const file = require('../utils/file')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);


exports.index = function(req, res){
  categoryModel.find(function(err, categories) {
    res.render('index', {data : 'hi' , categories : categories})
  });
};
