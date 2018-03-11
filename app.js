const express = require('express')
const config = require("./config/config.js");
const mongoose = require('mongoose')
const path = require('path')
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

const app = express();

app.set('port', config.port);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const router = require('./config/routes.js')(app)

app.listen(3000, () => console.log('Example app listening on port 80!'))