const mongoose = require('mongoose')

var Schema = mongoose.Schema;

var Review = new Schema({
    id : String,
    userId : String,
    review : String,
    title : String
});

module.exports = {
    Schema : function(){
        return mongoose.model('Review', Review);
    }
}
