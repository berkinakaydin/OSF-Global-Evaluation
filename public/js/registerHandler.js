var app = angular.module('register', []);

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
            $scope.registerForm.username.unique = false
            
    }

    $scope.uniqueEmailSet = function(){
        $scope.registerForm.email.unique = false  
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
                        $scope.registerForm.email.unique = true
                    }
                        
                    if(error === 'username'){                        
                        $scope.registerForm.username.unique = true
                    }
                }                                             
            }
        });
    }
}]);

app.factory('userService',['$http', function($http){
    var service = {};
    service.GetAll = GetAll;
    service.GetById = GetById;
    service.GetByUsername = GetByUsername;
    service.Create = Create;
    service.Update = Update;
    service.Delete = Delete;

    return service;

    function GetAll() {
        return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
    }

    function GetById(id) {
        return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
    }

    function GetByUsername(username) {
        return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
    }

    function Create(user) {
        return $http.post('/api/register', {'user' : user}).then(true, handleError('Error creating user'));
    }

    function Update(user) {
        return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
    }

    function Delete(id) {
        return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
    }

    function handleSuccess(res) {
        return res.data;
    }

    function handleError(error) {
        return function () {
            return { success: false, message: error };
        };
    }

}]);