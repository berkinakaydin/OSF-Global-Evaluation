const homeController = require('../controllers/homeController')
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')
const userController = require('../controllers/userController')

module.exports = function(app){
    
    app.get('/', homeController.index);
    app.get('/color/:pid', productController.getColor);
    app.get('/price/:pid', productController.getPrice);
    app.get('/:category/:subcategory/:category_product/:product', productController.index);
    app.get('/:category/:subcategory/:category_product', categoryController.products);
    app.get('/:category/:subcategory', categoryController.subcategory);
    app.get('/:category', categoryController.index);
    app.get('/product/:product',productController.index);
    app.get('/login', userController.loginPage);
    app.get('/register', userController.registerPage);
    app.get('/profile',userController.profilePage); //AUTHORIZATION REQUIRED
    app.get('/verification', userController.verification); //AUTHORIZATION REQUIRED
    app.post('/api/getCategories', categoryController.getCategories); //AUTHORIZATION REQUIRED
    app.post('/api/updateuser', userController.authenticate,userController.updateUser); //AUTHORIZATION REQUIRED
    app.post('/api/emailverify', userController.authenticate,userController.emailVerify); //AUTHORIZATION REQUIRED
    app.post('/api/getUsername', userController.authenticate, userController.getUsername)  //AUTHORIZATION REQUIRED
    app.post('/api/register', userController.register);
    app.post('/api/login', userController.login);
    app.post('/api/logout', userController.authenticate, userController.logout);  //AUTHORIZATION REQUIRED
}