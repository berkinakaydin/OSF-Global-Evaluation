const mongoose = require('mongoose')
,categoryModel = require('../models/category.js')
,productModel = require('../models/product.js')

exports.index = function (req, res, next) {
    res.render('./category/category')
};

exports.subcategory = function (req, res, next) {
    res.render('./category/subcategory')
};

exports.category_product = function (req, res, next) {
    res.render('./category/category_product')
}

//GET ALL CATEGORIES
exports.getCategories = function (req, res) {
    var query = categoryModel.getAllCategories()
    query.exec(function(err,categories){
        if(err){
            return res.json({success:false})
        }
        return res.json({success:true, categories: categories})
    })
}

//SEARCH OPERATIONS
exports.search = function (req, res) {
    if (req.method === 'POST') {
        var q = req.body.search
        var query = productModel.getProductsIfIncludeQuery(q)

        query.exec(function (err, products) {
            if (err) {
                return res.json({
                    success: false,
                    result: {}
                })
            }

            if (products) {
                return res.json({
                    success: true,
                    result: products
                })
            }

            return res.json({
                success: false,
                result: {}
            })

        })

    } else {
        return res.render('search')
    }

}


//RECEIVE ALL PRODUCTS TO REPRESENT IN CATEGORY PAGE
exports.getCategory_Products = function (req, res) {
    var categoryId = req.body.categoryId

    var query = productModel.getAllProductsWithCategoryId(categoryId)
    query.exec(function (err, products) {
        if (err) {
            return res.json({
                success: false
            })
        }

        if (products[0]) { //SOME CATEGORIES HAVE NO PRODUCT!
            var productCategory = products[0].primary_category_id.replace(/-/g, " ");
            productCategory = titleCase(productCategory);
            var title = productCategory
            return res.json({
                success: true,
                title: title,
                products: products
            })
        }
        return res.json({
            success: true,
            title: '',
            products: {}
        })
    })
}

function titleCase(str) {
    return str.toLowerCase().split(' ').map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
}