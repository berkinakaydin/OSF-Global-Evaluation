const homeController = require('../controllers/homeController')
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')

module.exports = function(app){
    
    app.get('/', homeController.index);
    app.get('/api/:pid', productController.getColor);

    app.get('/:category/:subcategory/:category_product/:product', productController.index);
    app.get('/:category/:subcategory/:category_product', categoryController.products);
    app.get('/:category/:subcategory', categoryController.subcategory);
    app.get('/:category', categoryController.index);
}