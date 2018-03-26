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

var wishlistModel = mongoose.model('wishlist', Wishlist);

module.exports.getWishlistByUsername = function(username){
    var query = wishlistModel.findOne({'userId' : username})
    return query
}