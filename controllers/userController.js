const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const categoryDBModel = require('../models/category.js')
const userDBModel = require('../models/user.js')

const file = require('../utils/file')
var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);
var userModel = new userDBModel.Schema();


exports.loginPage = function (req, res) {
    categoryModel.find(function (err, allCategories) { //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        res.render('login', {
            allCategories: allCategories
        })
    });
};

exports.registerPage = function (req, res) {
    categoryModel.find(function (err, allCategories) { //NOT TO LOSE MENS OR WOMENS FROM NAVBAR !
        res.render('register', {
            allCategories: allCategories
        })
    });
}

exports.login = function (req, res) {
    var username = req.body.user.username
    var password = req.body.user.password
    userModel.find({'username': username }, function (err, user) { //QUERIED RESULTS FROM 
        var checkPassword = userDBModel.User().methods.comparePassword(password, user[0].password) //user.password is hashed in DB
        console.log(checkPassword)
        if (checkPassword)
            res.sendStatus(200)
        else {
            console.log(err)
        }
    });

}

exports.register = function (req, res) {
    var username = req.body.user.username
    var name = req.body.user.name
    var surname = req.body.user.surname
    var password = req.body.user.password
    var email = req.body.user.email
    var hashedPassword = userDBModel.User().methods.cryptPassword(password)
    //var x = userModel.User().methods.comparePassword('a', '$2a$10$QcZiYiye2dF3h3XXe/oXluGjnx1mofrpdaRQaMf335ZXec33iCx52')

    var userEntity = new userModel()
    userEntity.name = username
    userEntity.surname = surname
    userEntity.username = username
    userEntity.password = hashedPassword
    userEntity.email = email

    userEntity.save((err, data) => {
        if (data) {
            res.sendStatus(200)
        } else {
            var errors = []
            for (error in err.errors) {
                errors.push(error)
            }

            res.json({
                errors: errors
            })
        }
    })
}