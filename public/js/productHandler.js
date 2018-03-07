var app = angular.module('product', []);

app.controller('productColor',['$scope', '$location' ,'$http', function($scope,$location,$http) {
    var url = $location.absUrl();
    var pid = url.split('/').pop()

    var jsonURL = '/api/' + pid

    $scope.colors = []
    
    $http({
        method: 'GET',
        url: jsonURL
    })
    .then(function onSuccess(response) {
        for(var i = 0; i < response.data.product.length; i++){
            var color = response.data.product[i].name
            $scope.colors.push(color)
        }
        
    })
    .catch(function onError(error) {
        console.log(error);         
    });

}]);