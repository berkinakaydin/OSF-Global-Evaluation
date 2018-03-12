var app = angular.module('login', ['userFactory']);

app.controller('loginController',['$scope','$window','userService', function ($scope,$window,userService) {
   $scope.save = function(){
       var user = {}
       user.username = $scope.username
       user.password = $scope.password
    
       userService.Login(user)
        .then(function (response) {
            if (response.data === 'OK') {         
                console.log("ok")        
                $window.location.href = "/";
            } else {           
                console.log("fuck")
                /*for(var i = 0; i < response.data.errors.length; i++){
                    var error = response.data.errors[i]
                    if(error === 'email'){                  
                        $scope.registerForm.email.$setValidity("unique", false)
                    }
                        
                    if(error === 'username'){                        
                        $scope.registerForm.username.$setValidity("unique", false)
                    }
                }      */                                       
            }
        });
   }
}]);