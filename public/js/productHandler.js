var app = angular.module('product', []);

app.service('productColorService', ['$location', '$http', function ($location, $http) {

    var url = $location.absUrl();
    var pid = url.split('/').pop()

    var jsonURL = '/color/' + pid

    var getColors = function () {
        var colors = []

        return $http({
            method: 'GET',
            url: jsonURL
        }).then(function onSuccess(response) {
            for (var i = 0; i < response.data.productColors.length; i++) {
                var color = response.data.productColors[i]

                colors.push(color)
            }
            return colors

        }).catch(function onError(error) {
            console.log(error);
        });
    }

    var getImages = function (type) {
        var images = []

        return $http({
            method: 'GET',
            url: jsonURL
        }).then(function onSuccess(response) {
            var images = response.data.productImages

            var obj = images.find((o, i) => {
                if (o.variation_value === type) {
                    return images[i]
                }
            });
            if (obj === undefined) {
                obj = {
                    variation_value: 'default'
                }
            }
            return obj

        }).catch(function onError(error) {
            console.log(error);
        });
    }

    return {
        getColors: getColors,
        getImages: getImages
    }
}]);

app.service('productPriceService', ['$location', '$http', function ($location, $http) {

    var url = $location.absUrl();
    var pid = url.split('/').pop()

    var jsonURL = '/price/' + pid

    var getPrice = function () {
        return $http({
            method: 'GET',
            url: jsonURL
        }).then(function onSuccess(response) {
            var price = response.data.price

            return price
        }).catch(function onError(error) {
            console.log(error);
        });
    }

    return {
        getPrice: getPrice
    }
}]);


app.controller('colorController', function ($scope, productColorService) {
    var colors = productColorService.getColors()
    colors.then(function (data) {
        $scope.colors = data
        $scope.selectedColor = $scope.colors[0];

        var images = productColorService.getImages($scope.selectedColor.value)
        images.then(function (data) {
            printImage(data)
        });
    });

    $scope.selected = function () {
        $scope.value = $scope.selectedColor;

        var images = productColorService.getImages($scope.selectedColor.value)
        images.then(function (data) {
            printImage(data)
        });
    };

    var printImage = function (data) {
        if (data.variation_value === 'default') {
            $scope.selectedImage = '/images/products/default.png'
        } else {
            $scope.selectedImage = '/images/' + data.images[0].link
        }
    }
});

app.controller('priceController', function ($scope, productPriceService) {

    var price = productPriceService.getPrice()

    price.then(function (price) {
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