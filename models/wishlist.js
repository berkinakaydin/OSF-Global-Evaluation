const mongoose = require('mongoose')

var Schema = mongoose.Schema;

var Wishlist = new Schema({
    userId : String,
    products : Array
});

module.exports = {
    Schema : function(){
        return mongoose.model('wishlist', Wishlist);
    }
}
