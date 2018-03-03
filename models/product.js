const mongoose = require('mongoose')

var Schema = mongoose.Schema;

var Product = new Schema({
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

module.exports = {
    Schema : function(){
        return mongoose.model('product', Product);
    }
}
