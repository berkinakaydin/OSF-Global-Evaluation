const mongoose = require('mongoose'),autoIncrement = require('mongoose-auto-increment');
const config = require('../config/config.js')

var connection = mongoose.createConnection(config.db);
 
autoIncrement.initialize(connection);

var Schema = mongoose.Schema;

var Order = new Schema({
    id : String,
    userId : String,
    date : Date,
    products : Array
});

Order.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = {
    Schema : function(){
        return mongoose.model('Order', Order);
    }
}