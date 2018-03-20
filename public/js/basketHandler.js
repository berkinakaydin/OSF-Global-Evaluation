app = angular.module('basket', ['header'])

app.controller('basketController', ['$scope', 'basketService', function ($scope, basketService) {

    var token = localStorage.getItem('jwt')
    var response = basketService.getBasketProducts(token)

    $scope.products = []
    response.then(function (response) {
        if (response.data.success === true) {
            var products = response.data.products
            for (var i = 0; i < products.length; i++) {
                var color = products[i].color
                var size = products[i].size
                console.log(color)
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
                    image: 'images/' + imagePath(color, size)
                }
                $scope.products.push(product)
            }
            console.log($scope.products)
        }
    })
}])

app.controller('wishlistController', ['$scope', 'basketService', function ($scope, basketService) {

    var token = localStorage.getItem('jwt')
    var response = basketService.getWishlistProducts(token)

    $scope.products = []
    response.then(function (response) {
        if (response.data.success === true) {
            $scope.products = response.data.products
        }
    })

}])

app.factory('basketService', ['$http', '$location', function ($http, $location) {
    var service = {}
    service.getBasketProducts = getBasketProducts
    service.getWishlistProducts = getWishlistProducts
    return service

    function getBasketProducts(token) {
        return $http.post('/api/getBasketProducts', {
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
}])