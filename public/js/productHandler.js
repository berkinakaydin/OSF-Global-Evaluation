var app = angular.module('product', ['header']);

app.controller('colorController', function ($scope, productService) {
    //var product = productService.GetProduct()
    var product = productService.product()
    
    product.then(function (product) {

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

app.controller('productInformationController', function ($scope, productService) {
    var product = productService.product()
    product.then(function (product) {
        $scope.title = (typeof product.page_title != 'undefined') ? product.page_title : product.id
        $scope.name = product.name
        $scope.page_description = product.page_description
    })
})

app.controller('buttonController', ['$timeout', '$http', '$scope', '$location','productService', function ($timeout, $http, $scope, $location, productService) {
    var url = $location.absUrl().split('/').pop()
    var token = localStorage.getItem('jwt')

    
    $scope.addBasket = function () {
        var color = (productService.color)?productService.color:'default'
        var size = (productService.size)?productService.size:'default'
     
        var itemId = url;
        $http.post('/api/addBasket', {
            token: token,
            itemId: itemId,
            color : color,
            size : size
        }).then(function (response) {
            var info = response.data.info
            var status = response.data.success

            if (status) {
                if (info) {
                    $scope.alreadyInBasketAlert = true
                    $timeout(function () {
                        $scope.alreadyInBasketAlert = false
                    }, 2000);
                } else {
                    $scope.basketAlert = true
                    $timeout(function () {
                        $scope.basketAlert = false
                    }, 2000);
                }
            }
        })
    }

    $scope.addWishlist = function () {
        var itemId = url;
        var color = (productService.color)?productService.color.value:'default'
        var size = (productService.size)?productService.size:'default'
        $http.post('/api/addWishlist', {
            token: token,
            itemId: itemId,
            color : color,
            size : size
        }).then(function (response) {
            var info = response.data.info
            var status = response.data.success

            if (status) {
                if (info) {
                    $scope.alreadyInWishlistAlert = true
                    $timeout(function () {
                        $scope.alreadyInWishlistAlert = false
                    }, 2000);
                } else {
                    $scope.wishlistAlert = true
                    $timeout(function () {
                        $scope.wishlistAlert = false
                    }, 2000);
                }
            }

        })
    }
}])

app.factory('productService', ['$http', '$location', function ($http, $location) {
    var service = {};
    service.color = null
    service.size = null
    service.product = GetProduct
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
}])