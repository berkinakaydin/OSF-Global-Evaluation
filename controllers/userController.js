const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const categoryDBModel = require('../models/category.js')

const file = require('../utils/file')
var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);


exports.login = function(req, res){
    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        res.render('login', {allCategories : allCategories})
    });
};

exports.register = function(req,res){
    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        res.render('register', {allCategories : allCategories})
    });
}