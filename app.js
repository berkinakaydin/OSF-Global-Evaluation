const express = require('express')
, mongoose = require('mongoose')
, path = require('path')
, bodyParser = require('body-parser')
, favicon = require('serve-favicon')

const config = require("./config/config.js");
const app = express();

app.set('port', config.port);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/routes.js')(app)

app.listen(80, () => console.log('Example app listening on port 80!'))