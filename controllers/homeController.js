var path    = require("path");
var fs = require('fs')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient
const file = require('../utils/file.js')


exports.index = function(req, res){
  res.sendFile('/views/index.html', { root : '.' });
};
