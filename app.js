const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const MongoClient = require('mongodb').MongoClient;

var favicon = require('serve-favicon');


const app = express();

app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

const router = require('./config/routes.js')(app)


app.listen(3000, () => console.log('Example app listening on port 80!'))