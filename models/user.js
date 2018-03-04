const mongoose = require('mongoose')

var Schema = mongoose.Schema;

var User = new Schema({
    id : String,
    password : String,
    token : String,
    email : String,
    wishlistId : String,
    cartId : String
});

module.exports = {
    Schema : function(){
        return mongoose.model('user', User);
    }
}
