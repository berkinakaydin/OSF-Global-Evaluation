var app = angular.module('login', ['userFactory']);

app.controller('loginController',['$scope','$window','$timeout','userService', function ($scope,$window,$timeout, userService) {
   $scope.save = function(){
       var user = {}
       user.username = $scope.username
       user.password = $scope.password
    
       userService.Login(user)
        .then(function (response) {
            if (response.data.success=== true) {              
                var token = response.data.token
                $window.localStorage.setItem('jwt',token)
                $window.location.href = "/";
            } else {          
                if(response.data.error === true){       
                    $scope.alert = true
                    $timeout(function() {
                        $scope.alert = false
                     }, 2000);      
                     
                }
            }
        });
   }
}]);