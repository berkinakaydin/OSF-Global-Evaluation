const mongoose = require('mongoose')
const basketDBModel = require('../models/basket.js')
const wishlistDBModel = require('../models/wishlist.js')
const productDBModel = require('../models/product.js')
const orderDBModel = require('../models/order.js')
const userDBModel = require('../models/user.js')
const nodemailer = require('nodemailer');


const ip = require('../config/config.js').ip
var userModel = new userDBModel.Schema();
var basketModel = new basketDBModel.Schema();
var wishlistModel = new wishlistDBModel.Schema();
var productModel = new productDBModel.Schema();
var orderModel = new orderDBModel.Schema();

exports.loginPage = function (req, res) {
    res.render('login')
};

exports.registerPage = function (req, res) {
    res.render('register')
}

//OPEN PROFILE PAGE
exports.profilePage = function (req, res) {
    var token = req.query.token
    if (token) {
        var user = userDBModel.User().methods.verifyJWT(token)
        if (user) {
            var username = user.username
            var query = userDBModel.getUserByUsername(username)

            query.exec(function (err, user) {
                if (user) {
                    return res.render('profile')
                } else
                    return res.sendStatus(401)
            })

        } else
            return res.sendStatus(401)
    } else
        return res.sendStatus(401)
}

//OPEN BASKET PAGE
exports.basketPage = function (req, res) {
    var token = req.query.token
    if (token) {
        var user = userDBModel.User().methods.verifyJWT(token)
        if (user) {
            var username = user.username
            var query = userDBModel.getUserByUsername(username)

            query.exec(function (err, user) {
                if (user) {
                    return res.render('basket')
                } else
                    return res.sendStatus(401)
            })

        } else
            return res.sendStatus(401)
    } else
        return res.sendStatus(401)
}

exports.wishlistPage = function (req, res) {
    var token = req.query.token
    if (token) {
        var user = userDBModel.User().methods.verifyJWT(token)
        if (user) {
            var username = user.username
            var query = userDBModel.getUserByUsername(username)

            query.exec(function (err, user) {
                if (user) {
                    return res.render('wishlist')
                } else
                    return res.sendStatus(401)
            })

        } else
            return res.sendStatus(401)
    } else
        return res.sendStatus(401)
}


//LOGIN OPERATION
exports.login = function (req, res) {
    var username = req.body.user.username
    var password = req.body.user.password

    var query = userDBModel.getUserByUsername(username)
    query.exec(function (err, user) {
        if (user) { //USERNAME IS TRUE
            var checkPassword = userDBModel.User().methods.comparePassword(password, user.password) //user.password is hashed in DB
            if (checkPassword) { //ALSO PASSWORD IS TRUE
                var jwt = userDBModel.User().methods.generateJWT(user.username)
                user.token = jwt
                user.save()
                return res.json({
                    success: true,
                    token: jwt
                })
            }
            return res.json({
                success: false
            })
        }
        return res.json({
            success: false
        })
    })
}


//REGISTER OPERATION
exports.register = function (req, res) {
    var username = req.body.user.username
    var name = req.body.user.name
    var surname = req.body.user.surname
    var password = req.body.user.password
    var email = req.body.user.email

    var hashedPassword = userDBModel.User().methods.cryptPassword(password)

    var userEntity = new userModel()
    userEntity.name = name
    userEntity.surname = surname
    userEntity.username = username
    userEntity.password = hashedPassword
    userEntity.email = email
    userEntity.emailVerify = false

    userEntity.save((err, data) => {
        if (data) {
            return res.sendStatus(200)
        } else {
            var errors = []
            for (error in err.errors) {
                errors.push(error)
            }

            return res.json({
                errors: errors
            })
        }
    })
}

exports.logout = function (req, res) {
    return res.json({
        success: true
    })
}

//USER CLICKS EMAIL LINK
exports.forgotPasswordVerify = function (req, res) {
    if (req.method == 'POST') {
        var password = req.body.password
        var token = req.body.token
        var hashedPassword = userDBModel.User().methods.cryptPassword(password)
        var user = userDBModel.User().methods.verifyJWT(token) //GET USERNAME

        if (user) {
            var email = user.username
            var query = userDBModel.getUserByEmail(email)
            query.exec(function (err, user) {
                if (user) {
                    user.password = hashedPassword
                    user.save((err, data) => {
                        if (data) {
                            return res.json({
                                success: true
                            })
                        } else {
                            return res.json({
                                success: false
                            })
                        }
                    })
                }
            })
        } else {
            return res.json({
                success: false
            })
        }

    } else {
        var token = req.query.token
        if (token != null) {
            var user = userDBModel.User().methods.verifyJWT(token) //GET USERNAME
            if (user != null) {
                var email = user.username
                var query = userDBModel.getUserByEmail(email)
                query.exec(function (err, user) {
                    if (user) {
                        res.render('passwordReset')
                    } else {
                        res.sendStatus(401)
                    }
                })
            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(401)
        }
    }
}

//FORGOT PASSWORD BUTTON CLICKED, EMAIL INPUT PAGE
exports.forgotPassword = function (req, res) {
    if (req.method === "POST") {
        var email = req.body.email
        var query = userDBModel.getUserByEmail(email)

        query.exec(function (err, user) {
            if (err) {
                return res.json({
                    success: false
                })
            }
            else if(user){
                console.log(user)
                var jwt = userDBModel.User().methods.generateJWT(email)
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'osfmailer@gmail.com',
                        pass: 'osfmailer123'
                    }
                });
    
                var mailOptions = {
                    from: 'osfmailer@gmail.com',
                    to: email,
                    subject: 'OSF E-Commerce Reset Password',
                    text: 'Please click this following link to reset your password \n' + 'http://' + ip + '/forgotPasswordVerify?token=' + jwt + '\nThis link can be used once 24 hours'
                };
    
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        return res.json({
                            success: false
                        })
                    } else {
                        console.log('Email sent: ' + info.response);
                        return res.json({
                            success: true
                        })
                    }
                });
            }
            else{
                return res.json({
                    success: false
                })
            }
            
        })
    } else {
        return res.render('forgotPassword')
    }
}

//GET USER
exports.getUser = function (req, res) {
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token)
    var username = user.username

    var query = userDBModel.getUserByUsername(username)

    query.exec(function (err, user) {
        if (err) {
            return res.json({
                success: false,
            })
        }
        return res.json({
            success: true,
            user: user
        })
    })
}

//GET DATA FOR PRINT INTO HEADER
exports.headerInformation = function (req, res) {
    var token = req.body.token
    if (token) {
        var user = userDBModel.User().methods.verifyJWT(token)
        if (user) {
            var username = user.username
            var query = basketDBModel.getBasketByUsername(username)

            query.exec(function (err, basket) {
                var secondQuery = wishlistDBModel.getWishlistByUsername(username)
                secondQuery.exec(function (err, wishlist) {
                    return res.json({
                        username: username,
                        basket: (basket != null) ? basket : null,
                        wishlist: (wishlist != null) ? wishlist : null,
                        success: true
                    })
                })
            })
        } else {
            res.sendStatus(201)
        }

    } else {
        res.sendStatus(201)
    }
}


//UPDATE USER
exports.updateUser = function (req, res) {
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token) //GET USERNAME
    var username = user.username

    //INPUT FIELD
    var name = req.body.user.name
    var surname = req.body.user.surname
    var email = req.body.user.email

    var query = userDBModel.getUserByEmail(email)

    query.exec(function (err, user) {
        if (err) {
            return res.json({
                success: false
            })
        }
        //CHECKS AN EMAIL IS EXIST, IF  THERE ISNT ANY USER WITH THIS EMAIL, PROCESS GOES ON
        if (!user) {
            var secondQuery = userDBModel.getUserByUsername(username)

            secondQuery.exec(function (err, user) {
                user.set({
                    email: (typeof email != 'undefined') ? email : user.email,
                    name: (typeof name != 'undefined') ? name : user.name,
                    surname: (typeof surname != 'undefined') ? surname : user.surname,
                    emailVerify: (typeof email == 'undefined') ? user.emailVerify : false
                })
                user.save(function (err, updatedUser) {
                    if (err) {
                        return res.json({
                            success: false
                        })
                    } else {
                        return res.json({
                            success: true
                        })
                    }
                })
            })
        } else {
            return res.json({
                success: false
            })
        }
    })
}


//USER VERIFICATION PAGE 
exports.verification = function (req, res) {
    var token = req.query.token
    if (token) {
        var user = userDBModel.User().methods.verifyJWT(token) //GET USERNAME
        if (user) {
            var username = user.username

            var query = userDBModel.getUserByUsername(username)
            query.exec(function (err, user) {
                if (err) {
                    return res.sendStatus(401)
                }
                if (user) {
                    user.emailVerify = true
                    user.save()
                    return res.render('verify')
                }
            })
        } else {
            return res.sendStatus(401)
        }
    } else {
        return res.sendStatus(401)
    }
}

//CHECKOUT OPERATION
exports.checkout = function (req, res) {
    if (req.method === 'POST') {
        var token = req.body.token
        var user = userDBModel.User().methods.verifyJWT(token) //GET USERNAME
        var username = user.username
        
        var query = basketDBModel.removeBasketWithUsername(username)
        console.log('hi')
        query.exec(function (err, basket) {
            
            if (err) {
                return res.json({
                    success: false
                })
            }
            
            else if (basket) {
                var secondQuery = userDBModel.getUserByUsername(username)
                secondQuery.exec(function (err, user) {
                    if (err) {
                        return res.json({
                            success: false
                        })
                    }
                    if (user) {
                        var text = "\n"
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!
                        var yyyy = today.getFullYear();
                        var hour = today.getHours()
                        var minute = today.getMinutes()
                        if (dd < 10) {
                            dd = '0' + dd
                        }

                        if (mm < 10) {
                            mm = '0' + mm
                        }

                        today = mm + '/' + dd + '/' + yyyy + ' ' + hour + ':' + minute;

                        var orderEntity = new orderModel()
                        orderEntity.date = today
                        orderEntity.products = basket.products
                        orderEntity.save(function (err, order) {
                            user.orderHistory.push({
                                'orderId': order.id
                            })
                            user.save()
                        });

                        for (var i = 0; i < basket.products.length; i++) {
                            var itemName = basket.products[i].name
                            text += itemName + "\n"
                        }
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'osfmailer@gmail.com',
                                pass: 'osfmailer123'
                            }
                        });

                        var mailOptions = {
                            from: 'osfmailer@gmail.com',
                            to: user.email,
                            subject: 'You Bought Some Items',
                            text: 'You bought these items :' + text + today
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return res.json({
                                    success: false
                                })
                            } else {
                                console.log('Email sent: ' + info.response);
                                res.json({
                                    success: true
                                })
                            }
                        });
                    }
                })
            } else {
                return res.json({
                    success: false
                })
            }
        })
    } else {
        var token = req.query.token
        if (token) {
            var user = userDBModel.User().methods.verifyJWT(token) //GET USERNAME
            if (user) {
                var username = user.username
                var query = userDBModel.getUserByUsername(username)
                query.exec(function (err, user) {
                    if (err) {
                        return res.sendStatus(401)
                    }
                    else if (user) {
                        return res.render('checkout')
                    }
                })
            } else {
                return res.sendStatus(401)
            }
        } else {
            return res.sendStatus(401)
        }
    }
}

//TO PRINT ORDER HISTORY
exports.getUserOrders = function (req, res) {
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token) //GET USERNAME
    var username = user.username

    userModel.findOne({
        username
    }, async function (err, user) {
        if (!user) return;
        const orders = [];
        for (const {
                orderId: id
            } of user.orderHistory) {
            const order = await orderModel.findOne({
                id
            }).exec();
            orders.push(order);
        }

        return res.json({
            success: true,
            orders: orders
        })
    })
}

//CHECK IF THIS EMAIL EXIST
exports.isEmailExist = function (req, res) {
    var email = req.body.email

    var query = userDBModel.getUserByEmail(email)
    query.exec(function (err, user) {
        if (err) {
            return res.json({
                success: false
            })
        } else if (user) {
            return res.json({
                success: true
            })
        } else {
            return res.json({
                success: false
            })
        }

    })
}

//EMAIL VERIFY 
exports.emailVerify = function (req, res, next) {
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token) //GET USERNAME
    var username = user.username

    var query = userDBModel.getUserByUsername(username)
    query.exec(function (err, user) {
        if (err) {
            return res.json({
                success: false
            })
        } else if (user) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'osfmailer@gmail.com',
                    pass: 'osfmailer123'
                }
            });

            var mailOptions = {
                from: 'osfmailer@gmail.com',
                to: user.email,
                subject: 'OSF E-Commerce Verification',
                text: 'Please click this following link to verify your email \n ' + 'http://' + ip + '/verification?token=' + user.token + '\n This link can be used once 24 hours'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return res.json({
                        success: false
                    })
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.json({
                        success: true
                    })
                }
            });
        } else {
            return res.json({
                success: false
            })
        }
    })
}

//ADD ITEM TO BASKET
exports.addBasket = function (req, res, next) {
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token)
    var username = user.username

    var itemId = req.body.itemId

    var size = req.body.size
    var color = req.body.color

    var query = basketDBModel.getBasketByUsername(username)
    query.exec(function (err, basket) {
        if (err) {
            return res.json({
                success: false
            })
        } else if (basket) {
            var secondQuery = productDBModel.getProductWithProductId(itemId)
            secondQuery.exec(function (err, product) {
                if (err) {
                    return res.json({
                        success: false
                    })
                } else if (product) {
                    product.size = size
                    product.color = color
                    //IF ITEM IS NOT IN BASKET, ADD TO BASKET
                    if (!basket.products.filter(function (e) {
                            return e.id === product.id;
                        }).length > 0) {
                        basket.products.push(product)
                        basket.save(function (err, result) {
                            if (result) {
                                return res.json({
                                    success: true,
                                    basket: basket.products
                                })
                            }
                        })

                    }
                    //IF IT IS ALREADY IN BASKET
                    else {
                        return res.json({
                            success: true,
                            basket: basket.products,
                            info: true
                        })
                    }
                }
            })
        } else {
            var secondQuery = productDBModel.getProductWithProductId(itemId)
            secondQuery.exec(function (err, product) {
                if (err) {
                    console.log(err)
                    return res.json({
                        success: false
                    })
                }
                else if(product){
                    var basketEntity = new basketModel();
                    basketEntity.userId = username
                    basketEntity.products = []
                    product.size = size
                    product.color = color
                    basketEntity.products.push(product)
    
                    basketEntity.save(function (err, result) {
                        if (result)
                            return res.json({
                                success: true,
                                basket: basketEntity.products,
                            })
                    })
                }
                else{
                    console.log('TEST2')
                    return res.json({
                        success: false
                    })
                }
            })
        }
    })
}

//ADD ITEM TO WISHLISH
exports.addWishlist = function (req, res) {
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token)
    var username = user.username


    var userId = username
    var itemId = req.body.itemId

    var size = req.body.size
    var color = req.body.color

    var query = wishlistDBModel.getWishlistByUsername(username)
    query.exec(function (err, wishlist) {
        if (err) {
            return res.json({
                success: false
            })
        } else if (wishlist) {
            console.log('hi')
            var secondQuery = productDBModel.getProductWithProductId(itemId)
            secondQuery.lean().exec(function (err, product) {
                if (err) {
                    return res.json({
                        success: false
                    })
                } else if (product) {
                    console.log(size)
                    product.size = size
                    product.color = color
                    //IF ITEM IS NOT IN BASKET, ADD TO BASKET
                    if (!wishlist.products.filter(function (e) {
                            return e.id === product.id;
                        }).length > 0) {
                        wishlist.products.push(product)
                        wishlist.save(function (err, result) {
                            if (result) {
                                return res.json({
                                    success: true,
                                    wishlist: wishlist.products
                                })
                            }
                        })

                    }
                    //IF IT IS ALREADY IN BASKET
                    else {
                        return res.json({
                            success: true,
                            wishlist: wishlist.products,
                            info: true
                        })
                    }
                }
            })
        } else {
            var secondQuery = productDBModel.getProductWithProductId(itemId)
            secondQuery.lean().exec(function (err, product) {
                if (err) {
                    return res.json({
                        success: false
                    })
                }
                else if(product){
                    console.log(size)
                    var wishlistEntity = new wishlistModel();
                    wishlistEntity.userId = username
                    wishlistEntity.products = []
                    product.size = size
                    product.color = color
                    wishlistEntity.products.push(product)
    
                    wishlistEntity.save(function (err, result) {
                        if (result)
                            return res.json({
                                success: true,
                                wishlist: wishlistEntity.products,
                            })
                    })
                }
                else{
                    return res.json({
                        success: false
                    })
                }
                
            })
        }
    })
}

//GET ALL ITEMS FROM BASKET
exports.getBasketProducts = function (req, res, next) {
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token)
    var username = user.username

    var query = basketDBModel.getBasketByUsername(username)
    query.exec(function(err,basket){
        if(err){
            return res.json({
                success: false
            })
        }
        else if (basket) {
            return res.json({
                success: true,
                products: basket.products
            })
        } else {
            return res.json({
                success: false
            })
        }
    })
}

//GET ALL ITEMS FROM WISHLIST
exports.getWishlistProducts = function (req, res, next) {
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token)
    var username = user.username

    var query = wishlistDBModel.getWishlistByUsername(username)
    query.exec(function(err,wishlist){
        if(err){
            return res.json({
                success: false
            })
        }
        else if (wishlist) {
            return res.json({
                success: true,
                products: wishlist.products
            })
        } else {
            return res.json({
                success: false
            })
        }
    })
}

//REMOVE ITEM FROM BASKET
exports.removeItemFromBasket = function (req, res, next) {
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token)
    var username = user.username
    var pid = req.body.pid

    var query = basketDBModel.getBasketByUsername(username)
    query.exec(function(err,basket){
        if(err){
            return res.json({
                success: false
            })
        }
        else if (basket) {
            basket.products.filter(function (obj) {
                if (obj.id === pid) {
                    basket.products.remove(obj)
                }
            });
            basket.save()
            return res.json({
                success: true
            })
        } else {
            return res.json({
                success: false
            })
        }
    })
}

exports.removeItemFromWishlist = function (req, res, next) {
    var token = req.body.token
    var user = userDBModel.User().methods.verifyJWT(token)
    var username = user.username
    var pid = req.body.pid


    var query = wishlistDBModel.getWishlistByUsername(username)
    query.exec(function(err,wishlist){
        if(err){
            return res.json({
                success: false
            })
        }
        else if (wishlist) {
            wishlist.products.filter(function (obj) {
                if (obj.id === pid) {
                    wishlist.products.remove(obj)
                }
            });
            wishlist.save()
            return res.json({
                success: true
            })
        } else {
            return res.json({
                success: false
            })
        }
    })
}

exports.authenticate = function (req, res, next) {
    var token = req.body.token
    if (token != null) { //To know that user logged in
        var user = userDBModel.User().methods.verifyJWT(token)
        if (user) {
            return next()
        } else {
            return res.status(201).json({
                success: false
            })
        }
    } else {
        return res.status(201).json({
            success: false
        })
    }
}