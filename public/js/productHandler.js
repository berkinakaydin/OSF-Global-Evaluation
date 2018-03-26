var app = angular.module('product', ['header']);

app.controller('colorController', function ($scope, productService) {
    //var product = productService.GetProduct()
    var product = productService.product()

    product.then(function (product) {
        $scope.id = product.id
        var sizes = []

        for (var i = 0; i < product.image_groups.length; i++) {
            if (typeof product.image_groups[i].variation_value == 'undefined') {
                var size = product.image_groups[i].view_type
                size = size.replace(/\b\w/g, function (l) {
                    return l.toUpperCase()
                })
                sizes.push(size)
            }
        }

        //SOME PRODUCTS HAVENT GOT ANY VARIATION ATTRIBUTES
        if (typeof product.variation_attributes[0] != 'undefined' && typeof product.image_groups != 'undefined') {

            var colors = product.variation_attributes[0].values //PRODUCT'S COLORS

            $scope.colors = colors
            $scope.selectedColor = colors[0] //INITIALIZE SELECTED COLOR AS FIRST COLOR


            $scope.sizes = sizes
            $scope.selectedSize = sizes[0] //INITIALIZE SELECTED SIZE AS FIRST SIZE

            var colorType = $scope.selectedColor.value //FOR EXAMPLE EJ3
            var sizeType = $scope.selectedSize //FOR EXAMPLE LARGE

            productService.color = colorType
            productService.size = sizeType
            var images = getImages(product, colorType, sizeType)

            printImage(images)
        } else {
            $scope.sizes = sizes
            $scope.selectedSize = sizes[0] //INITIALIZE SELECTED SIZE AS FIRST SIZE

            var sizeType = $scope.selectedSize //FOR EXAMPLE LARGE
            productService.size = sizeType

            var images = getImages(product, undefined, sizeType)
            printImage(images)
        }
    })

    //WHEN COLOR SELECTED FROM DROPDOWN LIST
    $scope.colorSelected = function () {
        $scope.value = $scope.selectedColor;
        product.then(function (product) {

            var colorType = $scope.selectedColor.value //FOR EXAMPLE EJ3
            var sizeType = $scope.selectedSize //FOR EXAMPLE LARGE
            productService.color = colorType
            productService.size = sizeType

            var images = getImages(product, colorType, sizeType)
            printImage(images)
        })
    };

    //WHEN COLOR SELECTED FROM DROPDOWN LIST
    $scope.sizeSelected = function () {
        $scope.value = $scope.selectedSize;
        product.then(function (product) {

            if (typeof $scope.selectedColor != 'undefined') {
                var colorType = $scope.selectedColor.value //FOR EXAMPLE EJ3
                productService.color = colorType
            }
            if (typeof $scope.selectedSize != 'undefined') {
                var sizeType = $scope.selectedSize //FOR EXAMPLE LARGE
                productService.size = sizeType
            }

            var images = getImages(product, colorType, sizeType)
            printImage(images)
        })
    };

    //PRINT IMAGE
    printImage = function (product) {
        if (product === null) {
            $scope.selectedImage = '/images/products/default.png'
        } else {
            $scope.selectedImage = '/images/' + product.images[0].link //PRINT FIRST COLOR
        }
    }

    //GET ALL IMAGES OF A PRODUCT WITH SELECTED TYPE
    getImages = function (product, colorType, sizeType) {
        for (var i = 0; i < product.image_groups.length; i++) {
            if (product.image_groups[i].variation_value === colorType && product.image_groups[i].view_type.toUpperCase() === sizeType.toUpperCase()) {
                return product.image_groups[i]
            }
        }
        return null
    }
});


app.controller('priceController', function ($scope, productService) {
    var product = productService.product()
    product.then(function (product) {
        var price = product.price
        $scope.newPrice = price
        $scope.selected = function () {
            $scope.value = $scope.selectedCurrency;

            var newPrice = 0
            switch ($scope.value) {
                case 'TRY':
                    newPrice = 3.81155664 * price;
                    break;
                case 'USD':
                    newPrice = price;
                    break;
                case 'EUR':
                    newPrice = 0.812512696 * price;
                    break;
                case 'GBP':
                    newPrice = 0.721870511 * price;
                    break;
                case 'RON':
                    newPrice = 3.7852979 * price;
                    break;
            }

            $scope.newPrice = newPrice.toFixed(2)

        };
    });

    $scope.currencies = [
        "USD",
        "TRY",
        "EUR",
        "GBP",
        "RON"
    ]
});

app.controller('productInformationController', function ($scope, $location, productService) {
    var product = productService.product()
    product.then(function (product) {
        $scope.title = (typeof product.page_title != 'undefined') ? product.page_title : product.id
        $scope.name = product.name
        $scope.page_description = product.page_description

        var facebookDesc = (typeof product.page_description != 'undefined') ? product.page_description : product.name

        for (var i = 0; i < 3; i++) {
            var meta = document.createElement('meta');
            if (i == 0) {
                meta.setAttribute('property', 'og:title');
                meta.content = $scope.name;
            }
            if(i==1){
                meta.setAttribute('property', 'og:description');
                meta.content = facebookDesc;
            }
            else{
                meta.setAttribute('property', 'og:image');
                meta.content = '/public/images/' + product.image_groups[0].images[0].link;
            }
            document.getElementsByTagName('head')[0].prepend(meta);
        }

        /*$('head').append('<meta property="og:title" content='+ $scope.name +' />');
        $('head').append('<meta property="og:description" content='+facebookDesc +' />');
        $('head').append('<meta property="og:image" content='+ '/public/images/' + product.image_groups[0].images[0].link +' />');*/
    })

    $scope.url = $location.absUrl()
})

app.controller('buttonController', ['$timeout', '$http', '$scope', '$location', 'productService', function ($timeout, $http, $scope, $location, productService) {
    var token = localStorage.getItem('jwt')

    $scope.addBasket = function (itemId) {
        var color = (productService.color) ? productService.color : 'default'
        var size = (productService.size) ? productService.size : 'default'

        var response = productService.AddBasket(token, itemId, color, size);

        response.then(function (response) {
            var info = response.info
            var status = response.success
            if (status) {
                if (info) {
                    $scope.alreadyInBasketAlert = true
                    $timeout(function () {
                        $scope.alreadyInBasketAlert = false
                    }, 2000);
                } else {
                    angular.element('#basketCount')[0].innerText++;
                    $scope.basketAlert = true
                    $timeout(function () {
                        $scope.basketAlert = false
                    }, 2000);
                }
            } else {
                $scope.authorizedAlert = true
                $timeout(function () {
                    $scope.authorizedAlert = false
                }, 2000);
            }
        })
    }

    $scope.addWishlist = function (itemId) {
        var color = (productService.color) ? productService.color : 'default'
        var size = (productService.size) ? productService.size : 'default'

        var response = productService.AddWishlist(token, itemId, color, size)

        response.then(function (response) {
            var info = response.info
            var status = response.success

            if (status) {
                if (info) {
                    $scope.alreadyInWishlistAlert = true
                    $timeout(function () {
                        $scope.alreadyInWishlistAlert = false
                    }, 2000);
                } else {
                    angular.element('#wishlistCount')[0].innerText++;
                    $scope.wishlistAlert = true
                    $timeout(function () {
                        $scope.wishlistAlert = false
                    }, 2000);
                }
            } else {
                $scope.authorizedAlert = true
                $timeout(function () {
                    $scope.authorizedAlert = false
                }, 2000);
            }
        })
    }
}])

app.controller('reviewController', ['$http', '$scope', '$location', 'productService', function ($http, $scope, $location, productService) {

    $scope.range = function (min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };

    $scope.reviews = [];
    var response = productService.GetReview();

    response.then(function (response) {
        if (response.success === true) {
            var reviews = response.reviews
            for (var i = 0; i < reviews.length; i++) {
                var status = ''
                switch (reviews[i].star) {
                    case '1':
                        status = 'bad'
                        break
                    case '2':
                        status = 'weak'
                        break
                    case '3':
                        status = 'average'
                        break
                    case '4':
                        status = 'good'
                        break
                    case '5':
                        status = 'perfect'
                        break
                }
                var review = {
                    username: reviews[i].username,
                    star: reviews[i].star,
                    message: reviews[i].message,
                    status: status,
                    title: reviews[i].title
                }
                $scope.reviews.push(review)
            }
        }
    })


    $scope.addReview = function () {
        var token = localStorage.getItem('jwt')
        var star = $scope.star
        var message = $scope.message
        var title = $scope.title


        if (typeof message != 'undefined' && message.length > 0 && typeof title != 'undefined' && title.length > 0) {
            var response = productService.AddReview(star, message, title, token)

            response.then(function (response) {
                if (response.success === true) {
                    var review = response.reviews
                    var status = ''
                    switch (review.star) {
                        case '1':
                            status = 'bad'
                            break
                        case '2':
                            status = 'weak'
                            break
                        case '3':
                            status = 'average'
                            break
                        case '4':
                            status = 'good'
                            break
                        case '5':
                            status = 'perfect'
                            break
                    }
                    review.status = status
                    $scope.reviews.push(review)
                }
            })
        } else {
            if (typeof star == 'undefined') {
                $scope.starStatus = false
            }
            if (typeof message == 'undefined' || message == "") {
                $scope.reviewForm.message.$setValidity("empty", false)
            }
            if (typeof title == 'undefined' || title == "") {
                $scope.reviewForm.title.$setValidity("empty", false)
            }
        }
    }

    $scope.messageChange = function () {
        $scope.reviewForm.message.$setValidity("empty", true)
    }

    $scope.titleChange = function () {
        $scope.reviewForm.title.$setValidity("empty", true)
    }
}])

app.factory('productService', ['$http', '$location', function ($http, $location) {
    var service = {};
    service.color = null
    service.size = null
    service.product = GetProduct
    service.AddReview = AddReview
    service.GetReview = GetReview
    service.AddBasket = AddBasket
    service.AddWishlist = AddWishlist
    return service

    //POST REQUEST TO GET PRODUCT
    function GetProduct() {
        var url = $location.absUrl();
        var pid = url.split('/').pop()
        return $http.post('/api/getProductById', {
            pid: pid
        }).then(function (response) {
            if (response.data.success === true) {
                return response.data.product
            }
        })
    }

    function AddReview(star, message, title, token) {
        var url = $location.absUrl();
        var pid = url.split('/').pop()

        return $http.post('/api/addReview', {
            token: token,
            pid: pid,
            star: star,
            title: title,
            message: message
        }).then(function (response) {
            return response.data
        })
    }

    function GetReview() {
        var url = $location.absUrl();
        var pid = url.split('/').pop()
        return $http.post('/api/getReview', {
            pid: pid
        }).then(function (response) {

            return response.data

        })
    }

    function AddBasket(token, itemId, color, size) {
        return $http.post('/api/addBasket', {
            token: token,
            itemId: itemId,
            color: color,
            size: size
        }).then(function (response) {
            return response.data
        })
    }

    function AddWishlist(token, itemId, color, size) {
        return $http.post('/api/addWishlist', {
            token: token,
            itemId: itemId,
            color: color,
            size: size
        }).then(function (response) {
            return response.data
        })
    }
}])