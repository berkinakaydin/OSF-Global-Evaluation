const mongoose = require('mongoose')
,productModel = require('../models/product.js')
,userModel = require('../models/user.js')

exports.index = function (req, res) {
    res.render('product')
};

//GET PRODUCTS FOR ANGULARJS
exports.getProductById = function (req, res) {
    var pid = req.body.pid
    var query = productModel.getProductWithProductId(pid)
    query.exec(function (err, product) {
        if (err) {
            return res.json({
                success: false
            })
        }
        return res.json({
            success: true,
            product: product
        })
    })
}


//ADD REVIEW TO A PRODUCT
exports.addReview = function (req, res) {
    var pid = req.body.pid
    var star = req.body.star
    var message = req.body.message
    var title = req.body.title

    var token = req.body.token
    var user = userModel.User().methods.verifyJWT(token) //GET USERNAME
    var username = user.username

    var query = productModel.getProductWithProductId(pid)
    query.exec(function (err, product) {
        if (err) {
            return res.json({
                success: false
            })
        }

        if (product) {
            var review = {
                star: star,
                message: message,
                username: username,
                title: title
            }
            product.review.push(review)
            product.save()
            return res.json({
                success: true,
                reviews: review
            })
        }

        return res.json({
            success: false
        })
    })
}

//GET ALL REVIEWS WHILE PRODUCT PAGE LOADING
exports.getReview = function (req, res) {
    var pid = req.body.pid

    var query = productModel.getProductWithProductId(pid)
    query.exec(function (err, product) {
        if (err) {
            return res.json({
                success: false
            })
        }

        if (product && product.review.length > 0) {
            return res.json({
                success: true,
                reviews: product.review
            })
        }

        return res.json({
            success: false
        })
    })
}