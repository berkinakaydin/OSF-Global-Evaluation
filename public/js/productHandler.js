var app = angular.module('product', []);

app.service('productColorService',['$location', '$http', function($location,$http){

    var url = $location.absUrl();
    var pid = url.split('/').pop()

    var jsonURL = '/api/' + pid

    var getColors = function(){
        var colors = []
       
        return $http({
            method: 'GET',
            url: jsonURL
        }).then(function onSuccess(response) {
            for(var i = 0; i < response.data.productColors.length; i++){
                var color = response.data.productColors[i]              

                colors.push(color)                               
            }      
            return colors
         
        }) .catch(function onError(error) {
            console.log(error);         
        });
    }
   
    var getImages = function(type){
        var images = []

        return $http({
            method: 'GET',
            url: jsonURL
        }).then(function onSuccess(response) {
            var images = response.data.productImages

            var obj = images.find((o,i)=>{
                if(o.variation_value === type){
                    return images[i]
                }         
            });
            
            return obj
         
        }) .catch(function onError(error) {
            console.log(error);         
        });
    }

    return {getColors : getColors, getImages : getImages}
}]);

app.controller('productColor', function($scope, productColorService) {
    var colors = productColorService.getColors()
    colors.then(function(data) {
        $scope.colors = data
        $scope.selectedColor= $scope.colors[0];

        var images = productColorService.getImages($scope.selectedColor.value)
        images.then(function(data) { 
            $scope.selectedImage =  '/images/'+ data.images[0].link
          });
      });
     
    $scope.selected= function() {
        $scope.value = $scope.selectedColor;

        var images = productColorService.getImages($scope.selectedColor.value)
        images.then(function(data) {
            $scope.selectedImage = '/images/'+ data.images[0].link
          });
    };

    
});

app.controller('productImage', function($scope, productColorService) {
    

});