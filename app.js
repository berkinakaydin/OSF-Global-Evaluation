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


const homeController = require('./controllers/homeController');
const categoryController = require('./controllers/categoryController');
const productController = require('./controllers/productController')


app.get('/', homeController.index);
app.get('/api/:pid', productController.getColor);

app.get('/:category/:subcategory/:category_product/:product', productController.index);
app.get('/:category/:subcategory/:category_product', categoryController.products);
app.get('/:category/:subcategory', categoryController.subcategory);
app.get('/:category', categoryController.index);


app.listen(3000, () => console.log('Example app listening on port 80!'))