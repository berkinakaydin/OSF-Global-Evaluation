const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const categoryDBModel = require('../models/category.js')
const file = require('../utils/file')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);


module.exports.index = function(req, res){
  categoryModel.find(function(err, categories) {
    res.render('index', {categories : categories})
  });
};
