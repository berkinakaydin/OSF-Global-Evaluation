var path    = require("path");
var fs = require('fs')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient


const URL = 'mongodb://localhost/testDB'

const productDBModel = require('../models/product.js')



mongoose.connect(URL, function(err,db){
  mongoose.connection.db.listCollections({name: 'products'}).next(function(err, collinfo) {
    if (!collinfo) {
      readJSON();
    }
    else{
        console.log("no need")
    }
  });
});


var readJSON = function (){
    fs.readFile('./products_json/products.json',function(err, data) {		
      var jsonData = data.toString()  	// json data
      var jsonParsed = JSON.parse(JSON.stringify(jsonData)); //parse json array
      var array = jsonParsed.split('\n') //objects

        var productModel = new productDBModel.Schema();  //mongoose.model('product', Product);
        var productEntity = new productModel();
        
        for(var i = 0; i < array.length-1; i++){ //-1 UNEXPECTED JSON END ?
          var parsedObject = JSON.parse(array[i])

          productEntity.price_max = parsedObject.price_max
          productEntity.page_description = parsedObject.page_description
          productEntity.page_title = parsedObject.page_title
          productEntity.name = parsedObject.name
          productEntity.price = parsedObject.price
          productEntity.id = parsedObject.id
          productEntity.currency = parsedObject.currency
          productEntity.primary_category_id = parsedObject.primary_category_id
          productEntity.orderable = parsedObject.orderable
          productEntity.long_description = parsedObject.long_description
    
          productEntity.save();
        }
  
        console.log("Saved!")
      
    });

    fs.readFile('./products_json/catagory.json',function(err, data){

    });
}