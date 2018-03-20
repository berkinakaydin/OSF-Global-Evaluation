var app = angular.module('login', ['userFactory','header']);

app.controller('loginController',['$scope','$timeout','userService', function ($scope,$timeout, userService) {
   $scope.save = function(){
       var user = {}
       user.username = $scope.username
       user.password = $scope.password
    
       userService.Login(user) .then(function (response) {
            if (response.data.success=== true) {              
                var token = response.data.token
                localStorage.setItem('jwt',token)
                location.href = "/";
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