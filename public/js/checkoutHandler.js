var app = angular.module('checkout', ['header', 'basket'])

app.controller('checkoutController', ['$scope', 'basketService', 'checkoutService', function ($scope, basketService, checkoutService) {
    var token = localStorage.getItem('jwt')
    var response = basketService.getBasketProducts(token)

    response.then(function (response) {
        var totalprice = 0
        var products = response.data.products

        for (var i = 0; i < products.length; i++) {
            totalprice += products[i].price
        }

        $scope.price = totalprice
        $scope.currency = products[0].currency
    })

    $scope.checkout = function () {
        var token = localStorage.getItem('jwt')
        var response = checkoutService.checkout(token)

        response.then(function (response) {
            if (response.success === true) {
                $("#modal").modal()
            }
        })
    }
}])

app.factory('checkoutService', ['$http', function ($http) {
    var service = {}
    service.checkout = checkout
    return service

    function checkout(token) {
        return $http.post('/api/checkout', {
            token: token
        }).then(function (response) {
            return response.data
        })
    }
}])