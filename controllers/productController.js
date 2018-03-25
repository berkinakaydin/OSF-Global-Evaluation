const mongoose = require('mongoose')

const productDBModel = require('../models/product.js')
const userDBModel = require('../models/user.js')
var productModel = new productDBModel.Schema();
var userModel = new userDBModel.Schema()

exports.index = function (req, res) {
    res.render('product')
};

//GET PRODUCTS FOR ANGULARJS
exports.getProductById = function (req, res) {
    var pid = req.body.pid
    productModel.findOne({
        'id': pid
    }, function (err, product) {
        res.json({
            success: true,
            product: product
        })
    });
}

exports.addReview = function(req,res){
    var pid = req.body.pid
    var star = req.body.star
    var message = req.body.message
    var title = req.body.title
    console.log(title)
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token) //GET USERNAME
    var username = user.username

    productModel.findOne({'id': pid}, function (err, product) {
        if(product){
            var review = {
                star : star,
                message : message,
                username : username,
                title : title
            }
            product.review.push(review)
            product.save()
            res.json({success:true,reviews:review})
        }
    })
}

exports.getReview = function(req,res){
    var pid = req.body.pid

    productModel.findOne({'id': pid}, function (err, product) {
        if(product && product.review.length > 0){
            res.json({reviews:product.review})
        }
        else{
            res.json(null)
        }
    })
}