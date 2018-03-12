const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const categoryDBModel = require('../models/category.js')
const userModel = require('../models/user.js')

const file = require('../utils/file')
var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);
var userDBModel = new userModel.Schema();


exports.loginPage = function(req, res){
    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        res.render('login', {allCategories : allCategories})
    });
};

exports.registerPage = function(req,res){
    categoryModel.find(function(err, allCategories) {  //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        res.render('register', {allCategories : allCategories})
    });
}

exports.register = function(req,res){
    var username = req.body.user.username
    var name = req.body.user.name
    var surname = req.body.user.surname
    var password = req.body.user.password
    var email = req.body.user.email
    var hashedPassword = userModel.User().methods.cryptPassword(password)
    //var x = userModel.User().methods.comparePassword('a', '$2a$10$QcZiYiye2dF3h3XXe/oXluGjnx1mofrpdaRQaMf335ZXec33iCx52')

    var userEntity = new userDBModel()
    userEntity.name = username
    userEntity.surname = surname
    userEntity.username = username
    userEntity.password = hashedPassword
    userEntity.email = email
    
    userEntity.save((err, data) => {
        if(data) {
            res.sendStatus(200)
        }
        else {
            var errors = []
            for(error in err.errors){
                console.log(error)
                errors.push(error)
            }
            
            //res.sendStatus(409)
            res.json({errors : errors})
        }
    })
}