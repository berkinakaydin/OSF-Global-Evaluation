const homeController = require('../controllers/homeController')
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')

module.exports = function(app){
    
    app.get('/', homeController.index);
    app.get('/color/:pid', productController.getColor);
    app.get('/price/:pid', productController.getPrice);
    app.get('/:category/:subcategory/:category_product/:product', productController.index);
    app.get('/:category/:subcategory/:category_product', categoryController.products);
    app.get('/:category/:subcategory', categoryController.subcategory);
    app.get('/:category', categoryController.index);
    app.get('/product/:product',productController.index)
}