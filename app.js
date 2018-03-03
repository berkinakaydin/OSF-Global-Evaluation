const express = require('express')
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const path = require('path')


const app = express();
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(path.resolve('./public')));   

const homeController = require('./controllers/homeController');


app.get('/', homeController.index);

app.listen(3000, () => console.log('Example app listening on port 80!'))