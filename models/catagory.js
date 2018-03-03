const mongoose = require('mongoose')

var Schema = mongoose.Schema;


var Catagory = new Schema({
    catagories : [{

    }],
    id : String,
    name : String,
    page_description : String,
    page_title : String,
    parent_category_id : String
});