const homeController = require('../controllers/homeController')
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')
const userController = require('../controllers/userController')

module.exports = function(app){
    app.get('/', homeController.index);

    app.get('/login', userController.loginPage);
    app.get('/register', userController.registerPage);
    app.get('/profile',userController.profilePage); //AUTHORIZATION REQUIRED
    app.get('/basket',userController.basketPage); //AUTHORIZATION REQUIRED
    app.get('/wishlist',userController.wishlistPage); //AUTHORIZATION REQUIRED
    app.get('/verification', userController.verification); //AUTHORIZATION REQUIRED
    app.get('/:category/:subcategory/:category_product/:product', productController.index);
    app.get('/:category/:subcategory/:category_product', categoryController.category_product);
    app.get('/:category/:subcategory', categoryController.subcategory);
    app.get('/:category', categoryController.index);
    app.get('/product/:product',productController.index);
    app.post('/api/getProductById', productController.getProductById);
    app.post('/api/getCategories', categoryController.getCategories); //AUTHORIZATION REQUIRED
    app.post('/api/getCategory_Products', categoryController.getCategory_Products); //AUTHORIZATION REQUIRED
    app.post('/api/updateUser', userController.authenticate,userController.updateUser); //AUTHORIZATION REQUIRED
    app.post('/api/emailVerify', userController.authenticate,userController.emailVerify); //AUTHORIZATION REQUIRED
    app.post('/api/headerInformation', userController.authenticate, userController.headerInformation)  //AUTHORIZATION REQUIRED
    app.post('/api/getUser', userController.authenticate, userController.getUser)  //AUTHORIZATION REQUIRED
    app.post('/api/register', userController.register);
    app.post('/api/login', userController.login);
    app.post('/api/logout', userController.authenticate, userController.logout);  //AUTHORIZATION REQUIRED
    app.post('/api/addBasket', userController.authenticate, userController.addBasket);  //AUTHORIZATION REQUIRED
    app.post('/api/addWishlist', userController.authenticate, userController.addWishlist);  //AUTHORIZATION REQUIRED
}