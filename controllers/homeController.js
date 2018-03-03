var path    = require("path");
<<<<<<< HEAD
var fs = require('fs')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient

const URL = 'mongodb://localhost/testDB'

mongoose.connect(URL, function(err,db){
  mongoose.connection.db.listCollections({name: 'products'}).next(function(err, collinfo) {
    if (!collinfo) {
      readJSON();
    }
  });
});

var readJSON = function (){
  fs.readFile('./products_json/products.json',function(err, data) {		
    var jsonData = data.toString()  	// json data
    var jsonParsed = JSON.parse(JSON.stringify(jsonData)); //parse json array
    var array = jsonParsed.split('\n') //objects
    
    var Product = new mongoose.Schema({
      price_max : Number, 
      page_description : String, 
      page_title : String, 
      name : String, 
      price : Number, 
      id : String, 
      currency : String, 
      primary_category_id : String, 
      orderable : Boolean, 
      long_description : String
     });

    const productModel = mongoose.model('Product', Product);

      for(var i = 0; i < array.length-1; i++){ //-1 UNEXPECTED JSON END ?
        var parsedObject = JSON.parse(array[i])
        
        Product.price_max = parsedObject.price_max
        Product.page_description = parsedObject.page_description
        Productpage_title = parsedObject.page_title
        Product.name = parsedObject.name
        Product.price = parsedObject.price
        Product.id = parsedObject.id
        Product.currency = parsedObject.currency
        Product.primary_category_id = parsedObject.primary_category_id
        Product.orderable = parsedObject.orderable
        Product.long_description = parsedObject.long_description
  
        const dbProduct = new productModel (Product);
        dbProduct.save();
      }

      console.log("STOP")
    
  });
}

exports.index = function(req, res){
  
  res.sendFile('/views/index.html', { root : '.' });
};

=======

exports.index = function(req, res){
  res.sendFile('/views/index.html', { root : '.' });
};
>>>>>>> f6476871ed5f8b670c15896346384854b2c3c999
