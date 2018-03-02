var path    = require("path");

exports.index = function(req, res){
  res.sendFile('/views/index.html', { root : '.' });
};