const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config/config').secret;

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
    password: String,
    token: String,
    email: {
        type: String,
        unique: true,
        required: [true, "can't be blank"],
        index: true,
        trim: true
    },
    wishlistId: String,
    cartId: String,
    hash: String,
    salt: String
});

UserSchema.plugin(uniqueValidator, {
    message: 'is already taken.'
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
      var today = new Date();
      var exp = new Date(today);
      exp.setDate(today.getDate() + 60);
    
      return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
      }, secret);
    };

    UserSchema.methods.toAuthJSON = function(){
          return {
            username: this.username,
            email: this.email,
            token: this.generateJWT(),
          };
        };

module.exports = {
    Schema: function () {
        return mongoose.model('user', User);
    }
}