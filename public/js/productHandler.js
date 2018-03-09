var app = angular.module('product', []);

app.service('productColorService',['$location','$q', '$http', function($location,$q,$http){

    var getColors = function(){
        var url = $location.absUrl();
        var pid = url.split('/').pop()
    
        var jsonURL = '/api/' + pid
    
        var colors = []
        var deferred = $q.defer();

        return $http({
            method: 'GET',
            url: jsonURL
        }).then(function onSuccess(response) {
            for(var i = 0; i < response.data.productColors.length; i++){
                var color = response.data.productColors[i]              

                colors.push(color)                               
            }      
            return colors
            //deferred.resolve(colors);
        }) .catch(function onError(error) {
            console.log(error);         
        });
    }
   
    return {getColors : getColors}
}]);

app.controller('productColor', function($scope, productColorService) {
   
    var colors = productColorService.getColors()
    colors.then(function(data) {
        $scope.colors = data
      });
  
    $scope.selected= function() {
        $scope.value = $scope.selectedColor;
        console.log($scope.value);
    };
});