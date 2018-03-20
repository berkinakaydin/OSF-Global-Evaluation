const categoryDBModel = require('../models/category.js')
const productDBModel = require('../models/product.js')
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose')

var categoryModel = new categoryDBModel.Schema(); //mongoose.model('product', Product);
var productModel = new productDBModel.Schema();


exports.index = function (req, res, next) {
    var category_id = req.params.category
    categoryModel.findOne({id: category_id}, function (err, category) { //QUERIED RESULTS FROM URL
        if (category === null) { //ERROR HANDLE
            return next()
        }

        var title = category.page_title
        res.render('./category/category', {
            title: title,
            category: category
        })


    });
};

exports.subcategory = function (req, res, next) {
    var category = req.params.category
    var subcategory = req.params.subcategory

    categoryModel.findOne({'id': category}, {'categories': { $elemMatch: {  'id': subcategory} } }, function (err, subcategory) {

        if (subcategory === null) { //ERROR HANDLE
            return next()
        }

        var title = subcategory.categories[0].page_title
        var subcategory = subcategory.categories[0]
        res.render('./category/subcategory', {
            title: title,
            subcategory: subcategory
        }) //WOW
    });
};

exports.getCategories = function (req, res) {
    var categories = categoryModel.find()
 
    categories.then(function (categories) {
       
        res.json({
            categories: categories
        })
    })
}

exports.products = function (req, res, next) {
    var parentURL = req.path
    var productCategory = req.params.category_product

    productModel.find({
        primary_category_id: productCategory
    }, function (err, products) { //QUERIED RESULTS FROM URL

        if (products[0] != null) { //SOME CATEGORIES HAVE NO PRODUCT!
            var productCategory = products[0].primary_category_id.replace(/-/g, " ");
            productCategory = titleCase(productCategory);
            var title = productCategory
            res.render('./category/category_product', {
                title: title,
                products: products,
                parentURL: parentURL
            })
        } else {
            res.render('./category/category_product', {
                title: title,
                products: {},
                parentURL: parentURL
            })
        }
    });
};


function titleCase(str) {
    return str.toLowerCase().split(' ').map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
}