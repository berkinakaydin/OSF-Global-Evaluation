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
    c_isSale : Boolean
});

module.exports = {
    Schema : function(){
        return mongoose.model('product', Product);
    }
}
