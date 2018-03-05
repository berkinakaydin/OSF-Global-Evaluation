var app = angular.module('product', []);

app.controller('productColor',['$scope', function($scope) {
    $scope.message = window.message
    
    $scope.colors = [
        'hi'
    ]
}]);