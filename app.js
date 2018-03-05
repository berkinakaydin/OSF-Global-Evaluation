const express = require('express')
const mongoose = require('mongoose')
const path = require('path')


const app = express();
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(path.resolve('./public')));   

const homeController = require('./controllers/homeController');
const categoryController = require('./controllers/categoryController');
const productController = require('./controllers/productController')

app.get('/', homeController.index);
app.get('/mens', categoryController.index);
app.get('/womens', categoryController.index);
app.get('/womens/womens-*/*/*', productController.index);
app.get('/mens/mens-*/*/*', productController.index);
app.get('/womens/womens-*/*', categoryController.products);
app.get('/mens/mens-*/*', categoryController.products);

app.get('/womens/*', categoryController.subcatagory);
app.get('/mens/*', categoryController.subcatagory);


app.listen(3000, () => console.log('Example app listening on port 80!'))