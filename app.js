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
const categoryController = require('./controllers/categoryController');

app.get('/', homeController.index);
app.get('/mens', categoryController.index);
app.get('/womens', categoryController.index);
app.get('/womens/*', categoryController.subcatagory);
app.get('/mens/*', categoryController.subcatagory);

app.listen(3000, () => console.log('Example app listening on port 80!'))