var app = angular.module('register', ['userFactory','header']);

app.controller('registerController', ['$http', '$scope', 'userService', '$location', function ($http,$scope, userService, $location) {
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
                location.href = "/";
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

    $scope.reset = function(){
        var password = $scope.password
        var token = $location.absUrl().split('?')[1].split('=')[1]

        $http.post('/api/forgotPasswordVerify', {token:token, password : password}).then(function(response){
            if(response.data.success === true){
                $("#myModal").modal()
            }
            else{
                $scope.alert = true
            }
        })
    }
}]);