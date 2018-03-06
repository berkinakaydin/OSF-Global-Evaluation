const express = require('express')
const mongoose = require('mongoose')
const path = require('path')


const app = express();
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(path.resolve('./public')));     


app.get('/favicon.ico', function(req, res) {
    res.status(204);
});




const homeController = require('./controllers/homeController');
const categoryController = require('./controllers/categoryController');
const productController = require('./controllers/productController')

app.get('/', homeController.index);
app.get('/:category', categoryController.index);
app.get('/:category/:subcategory', categoryController.subcategory);
app.get('/:category/:subcategory/:category_product', categoryController.products);
app.get('/:category/:subcategory/:category_product/:product', productController.index);


app.get('/mens/mens-*/color', productController.colors);



app.listen(3000, () => console.log('Example app listening on port 80!'))