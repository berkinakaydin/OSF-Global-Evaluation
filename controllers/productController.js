const mongoose = require('mongoose')

const productDBModel = require('../models/product.js')
var productModel = new productDBModel.Schema();

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