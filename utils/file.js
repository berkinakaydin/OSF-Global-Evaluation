var path = require("path");
var fs = require('fs')
const mongoose = require('mongoose')

const productDBModel = require('../models/product.js')
const categoryDBModel = require('../models/category.js')

const URL = 'mongodb://localhost/testDB'

mongoose.connect(URL, function (err, db) {
    mongoose.connection.db.listCollections({name: 'products', name : 'catagories'}).next(function (err, collinfo) {
        if (!collinfo) {
            readJSON();
            console.log("DB UPDATED")
        } else {
            console.log("DB IS UP-TO-DATE")
        }
    });
});

var readJSON = function () {
        
    fs.readFile('./products_json/products.json', function (err, data) {
        var fullJson = data.toString().trim()
  
        var records = fullJson.split('\n').map(function (record) {
            return JSON.parse(record)
        })

        var productModel = new productDBModel.Schema(); //mongoose.model('product', Product);

        for (var i = 0; i < records.length; i++) {
            var productEntity = new productModel();
      
            productEntity.price_max = records[i].price_max
            productEntity.page_description = records[i].page_description
            productEntity.page_title = records[i].page_title
            productEntity.variation_attributes = records[i].variation_attributes
            productEntity.name = records[i].name
            productEntity.price = records[i].price
            productEntity.master = records[i].master
            productEntity.primary_category_id = records[i].primary_category_id
            productEntity.image_groups = records[i].image_groups
            productEntity.short_description = records[i].short_description
            productEntity.variants = records[i].variants
            productEntity.id = records[i].id
            productEntity.type = records[i].type
            productEntity.c_isSale = records[i].c_isSale
            productEntity.currency = records[i].currency
            productEntity.orderable = records[i].orderable
            productEntity.long_description = records[i].long_description

            productEntity.save();
        }

        console.log("Saved!")

    });

    fs.readFile('./products_json/categories.json', function (err, data) {
        
        var fullJson = data.toString().trim()

        var records = fullJson.split('\n').map(function (record) {
            return JSON.parse(record)
        })

        var categoryModel = new categoryDBModel.Schema(); //mongoose.model('catagory', Catagory);
        
        for(var i = 0; i < records.length; i++){
            var categoryEntity = new categoryModel();
            categoryEntity.id = records[i].id
            categoryEntity.categories = records[i].categories
            categoryEntity.name = records[i].name
            categoryEntity.page_description = records[i].page_description
            categoryEntity.page_title = records[i].page_title
            categoryEntity.parent_category_id = records[i].parent_category_id
            categoryEntity.save();
        }
    });
}