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
    app.get('/checkout', userController.checkout); //AUTHORIZATION REQUIRED
    app.get('/forgotPasswordVerify', userController.forgotPasswordVerify); //AUTHORIZATION REQUIRED
    app.get('/forgotPassword', userController.forgotPassword); //AUTHORIZATION REQUIRED
    app.get('/product/:product',productController.index);
    app.get('/:category/:subcategory/:category_product/:product', productController.index);
    app.get('/:category/:subcategory/:category_product', categoryController.category_product);
    app.get('/:category/:subcategory', categoryController.subcategory);
    app.get('/:category', categoryController.index);
    app.post('/api/getProductById', productController.getProductById);
    app.post('/api/getCategories', categoryController.getCategories); //AUTHORIZATION REQUIRED
    app.post('/api/getCategory_Products', categoryController.getCategory_Products); //AUTHORIZATION REQUIRED
    app.post('/api/updateUser', userController.authenticate,userController.updateUser); //AUTHORIZATION REQUIRED
    app.post('/api/emailVerify', userController.authenticate,userController.emailVerify); //AUTHORIZATION REQUIRED
    app.post('/api/forgotPasswordVerify', userController.authenticate,userController.forgotPasswordVerify); //AUTHORIZATION REQUIRED
    app.post('/api/forgotPassword', userController.forgotPassword); 
    app.post('/api/headerInformation', userController.authenticate, userController.headerInformation)  //AUTHORIZATION REQUIRED
    app.post('/api/getUser', userController.authenticate, userController.getUser)  //AUTHORIZATION REQUIRED
    app.post('/api/register', userController.register);
    app.post('/api/login', userController.login);
    app.post('/api/checkout', userController.authenticate, userController.checkout);
    app.post('/api/logout', userController.authenticate, userController.logout);  //AUTHORIZATION REQUIRED
    app.post('/api/addBasket', userController.authenticate, userController.addBasket);  //AUTHORIZATION REQUIRED
    app.post('/api/addWishlist', userController.authenticate, userController.addWishlist);  //AUTHORIZATION REQUIRED
    app.post('/api/isEmailExist', userController.isEmailExist);  
    app.post('/api/getWishlistProducts',userController.authenticate,userController.getWishlistProducts)
    app.post('/api/getBasketProducts',userController.authenticate,userController.getBasketProducts)
    app.post('/api/removeItemFromBasket',userController.authenticate,userController.removeItemFromBasket)
    app.post('/api/removeItemFromWishlist',userController.authenticate,userController.removeItemFromWishlist)
    app.post('/api/getUserOrders/',userController.authenticate,userController.getUserOrders)
}