const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
//var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config/config').secret;
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var User = new Schema({
    id: String,
    username: {
        type: String,
        unique: true,
        required: [true, "can't be blank"],
        index: true,
        trim: true
    },
    name: String,
    surname: String,
    password: String,
    email: {
        type: String,
        unique: true,
        required: [true, "can't be blank"],
        index: true,
        trim: true
    },
    wishlistId: String,
    cartId: String
});

User.plugin(uniqueValidator, {
    message: 'is already taken.'
});



User.methods.cryptPassword = function(password, callback) {
    const saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);
    return hash
};

User.methods.comparePassword = function(plainPass, hashword, callback) {
    var compare = bcrypt.compareSync(plainPass, hashword); // true
    return compare
    //bcrypt.compareSync(someOtherPlaintextPassword, hash); // false
};

User.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

User.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
    };
};

module.exports = {
    Schema: function () {
        return mongoose.model('user', User);
    },
    User : function(){
        return User
    }
}