const mongoose = require('mongoose')

var Schema = mongoose.Schema;

var Basket = new Schema({
    userId : String,
    products : Array
});

module.exports = {
    Schema : function(){
        return mongoose.model('basket', Basket);
    }
}

var basketModel = mongoose.model('basket', Basket)

module.exports.getBasketByUsername = function(username){
    var query = basketModel.findOne({'userId' : username})
    return query
}

module.exports.removeBasketWithUsername = function(username){
    var query = basketModel.findOneAndRemove({'userId' : username})
    return query
}