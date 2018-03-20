app = angular.module('basket', ['header'])

app.controller('basketController', ['$scope', 'basketService', function ($scope, basketService) {

    var token = localStorage.getItem('jwt')
    var response = basketService.getBasketProducts(token)

    $scope.products = []
    response.then(function (response) {
        $scope.total = 0
        if (response.data.success === true) {
            var products = response.data.products
            for (var i = 0; i < products.length; i++) {
                var color = products[i].color
                var size = products[i].size
                
                var imagePath = function (color, size) {
                    if (color != 'default') {
                        for (var j = 0; j < products[i].image_groups.length; j++) {              
                            if (products[i].image_groups[j].variation_value === color) {
                                return products[i].image_groups[j].images[0].link
                            }
                        }
                        return products[i].image_groups[0].images[0].link  //not found
                    } else {
                        console.log(products[i])
                        return products[i].image_groups[0].images[0].link
                    }
                }
                var product = {
                    name: products[i].name,
                    price: products[i].price,
                    currency: products[i].currency,
                    size : products[i].size,
                    id : products[i].id,
                    image: 'images/' + imagePath(color, size)
                }
                $scope.total += product.price
                $scope.currency = 'USD'
                $scope.products.push(product)
            }
        }
    })

    $scope.checkout = function(){
        debugger
    }

    $scope.remove = function(product){
        var token = localStorage.getItem('jwt')
        var pid = product.id
        var response = basketService.removeItemFromBasket(pid,token)

        response.then(function(response){
            location.reload()
        })
    }
}])

app.controller('wishlistController', ['$timeout', '$scope', 'basketService', function ($timeout,$scope, basketService) {

    var token = localStorage.getItem('jwt')
    var response = basketService.getWishlistProducts(token)

    $scope.products = []
    response.then(function (response) {
        $scope.total = 0
        if (response.data.success === true) {
            var products = response.data.products
            for (var i = 0; i < products.length; i++) {
                var color = products[i].color
                var size = products[i].size
                var imagePath = function (color, size) {
                    if (color != 'default') {
                        for (var j = 0; j < products[i].image_groups.length; j++) {              
                            if (products[i].image_groups[j].variation_value === color) {
                                return products[i].image_groups[j].images[0].link
                            }
                        }
                        return products[i].image_groups[0].images[0].link  //not found
                    } else {
                        return products[i].image_groups[0].images[0].link
                    }
                }
                var product = {
                    name: products[i].name,
                    price: products[i].price,
                    currency: products[i].currency,
                    size : products[i].size,
                    id : products[i].id,
                    color : products[i].color,
                    image: 'images/' + imagePath(color, size)
                }
                $scope.total += product.price
                $scope.currency = 'USD'
                $scope.products.push(product)
            }
        }
    })

    $scope.remove = function(product){
        var token = localStorage.getItem('jwt')
        var pid = product.id
        var response = basketService.removeItemFromWishlist(pid,token)

        response.then(function(response){
            location.reload()
        })
    }

    $scope.addBasket = function(product){
        var token = localStorage.getItem('jwt')
        var pid = product.id
        var color = product.color
        var size = product.size

        var response = basketService.addItemToBasket(token,pid,color,size)

        response.then(function(response){
            var info = response.data.info
            if (info) {
                $scope.alreadyInBasketAlert = true
                $timeout(function () {
                    $scope.alreadyInBasketAlert = false
                }, 2000);
            }
            else{
                $scope.basketAlert = true
                $timeout(function () {
                    $scope.basketAlert = false
                }, 2000);
            }
        })
    }

}])

app.factory('basketService', ['$http', '$location', function ($http, $location) {
    var service = {}
    service.getBasketProducts = getBasketProducts
    service.getWishlistProducts = getWishlistProducts
    service.removeItemFromBasket = removeItemFromBasket
    service.removeItemFromWishlist = removeItemFromWishlist
    service.addItemToBasket = addItemToBasket
    return service

    function getBasketProducts(token) {
        return $http.post('/api/getBasketProducts', {
            token: token
        }).then(function (response) {
            return response
        })
    }

    function removeItemFromBasket(pid,token){
        return $http.post('/api/removeItemFromBasket', {
            pid:pid,
            token: token
        }).then(function (response) {
            return response
        })
    }

    function removeItemFromWishlist(pid,token){
        return $http.post('/api/removeItemFromWishlist', {
            pid:pid,
            token: token
        }).then(function (response) {
            return response
        })
    }

    function getWishlistProducts(token) {
        return $http.post('/api/getWishlistProducts', {
            token: token
        }).then(function (response) {
            return response
        })
    }
    
    function addItemToBasket(token,pid,color,size){
        return $http.post('/api/addBasket', {
            token: token,
            itemId : pid,
            color : color,
            size : size
        }).then(function (response) {
            return response
        })
    }
}])