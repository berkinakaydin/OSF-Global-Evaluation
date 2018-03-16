var app = angular.module('register', ['userFactory','index']);

app.controller('registerController', ['$scope', 'userService', '$location', '$window', function ($scope, userService, $location,$window) {
    $scope.inputType = 'password'
    $scope.inputTypeForCheck = 'password'
 
    $scope.toggleShowPassword = function() {
        if ($scope.inputType == 'password')
             $scope.inputType = 'text';
        else
             $scope.inputType = 'password';
    }

    $scope.toggleShowPasswordCheck = function() {
        if ($scope.inputTypeForCheck == 'password')
             $scope.inputTypeForCheck = 'text';
        else
             $scope.inputTypeForCheck = 'password';
    }

    $scope.uniqueUsernameSet = function(){ 
        $scope.registerForm.username.$setValidity("unique", true)  
    }

    $scope.uniqueEmailSet = function(){
        $scope.registerForm.email.$setValidity("unique", true)  
    }

    $scope.match = function(){
        var status = ($scope.password === $scope.passwordCheck)? true:false;
        $scope.registerForm.passwordCheck.$setValidity("match", status)
    }

    $scope.register = function(){
        var user = {}
        user.name = $scope.name
        user.surname = $scope.surname
        user.username = $scope.username
        user.password = $scope.password
        user.email = $scope.email
        
        
        userService.Create(user)
        .then(function (response) {
            if (response.data === 'OK') {                 
                $window.location.href = "/";
            } else {           
                for(var i = 0; i < response.data.errors.length; i++){
                    var error = response.data.errors[i]
                    if(error === 'email'){                  
                        $scope.registerForm.email.$setValidity("unique", false)
                    }
                        
                    if(error === 'username'){                        
                        $scope.registerForm.username.$setValidity("unique", false)
                    }
                }                                             
            }
        });
    }

  
}]);

app.controller('headerController', ['$scope','indexService','userService', function ($scope, indexService, userService) {
    var objects= indexService.getUsername()
    objects.then(function(data){
        $scope.objects = data
    })

    $scope.logout = function () {
        userService.Logout();
    }
}])