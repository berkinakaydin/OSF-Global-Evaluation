const mongoose = require('mongoose')

var Schema = mongoose.Schema;

var Cart = new Schema({
    id : String,
    userId : String,
    products : Array
});

module.exports = {
    Schema : function(){
        return mongoose.model('cart', Cart);
    }
}
