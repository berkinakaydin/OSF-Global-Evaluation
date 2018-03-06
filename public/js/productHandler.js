var app = angular.module('product', []);

app.controller('productColor',['$scope', '$http', function($scope,$http) {
    //var url = 'http://localhost:3000/mens/mens-clothing/color'
    $scope.colors = []
    
    $http.get(url).then(function(response) {  
        //$scope.colors = response
        
        //console.log(response.product)
        console.log('hello')
        console.log((response.data.product.variation_attributes[0].values))
    });

}]);