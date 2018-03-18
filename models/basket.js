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
