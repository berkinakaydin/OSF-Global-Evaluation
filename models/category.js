const mongoose = require('mongoose')

var Schema = mongoose.Schema;

var Category = new Schema({
    categories : Array,
    id : String,
    name : String,
    page_description : String,
    page_title : String,
    parent_category_id : String
});

module.exports = {
    Schema : function(){
        return mongoose.model('Category', Category);
    }
}

var categoryModel = mongoose.model('Category', Category);

module.exports.getAllCategories = function(){
    var query = categoryModel.find()
    return query
}