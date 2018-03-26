const mongoose = require('mongoose')

var Schema = mongoose.Schema;

var Product = new Schema({
    price_max : Number, 
    page_description : String, 
    page_title : String, 
    name : String, 
    price : Number, 
    variation_attributes : Array,
    id : String, 
    currency : String, 
    master : Array,
    primary_category_id : String, 
    image_groups : Array,
    short_description : String,
    orderable : Boolean, 
    variants : Array,
    type : Array,
    long_description : String,
    c_isSale : Boolean,
    review : Array
});


module.exports = {
    Schema : function(){
        return mongoose.model('product', Product);
    }
}

var productModel = mongoose.model('product', Product);

module.exports.getAllProductsWithCategoryId = function(categoryId){
    var query = productModel.find({primary_category_id: categoryId})
    return query
}

module.exports.getProductWithProductId = function(productId){
    var query = productModel.findOne({'id': productId})
    return query
}

module.exports.getProductsIfIncludeQuery = function(q){
    var query = productModel.find({'name' : { "$regex": q, "$options": "i" }})
    return query
}