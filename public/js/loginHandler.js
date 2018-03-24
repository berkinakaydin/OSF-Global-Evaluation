var app = angular.module('login', ['userFactory','header']);

app.controller('loginController',['$scope','$timeout','userService','loginService', function ($scope,$timeout, userService,loginService) {
   $scope.save = function(){
       var user = {}
       user.username = $scope.username
       user.password = $scope.password
    
       userService.Login(user) .then(function (response) {
            if (response.data.success=== true) {              
                var token = response.data.token
                localStorage.setItem('jwt',token)
                $("#modal").modal()
                $timeout(function() {
                    location.href = "/";
                 }, 2000);                       
                
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

   $scope.forgotPasswordButton = function(){
        location.href = '/forgotPassword'
   }

   $scope.validEmailSet = function(){ 
      $scope.alert = false  
        $scope.forgotPasswordForm.email.$setValidity("valid", true)  
    }

   $scope.sendEmail = function(){
       var email = $scope.email
       console.log(email)
        var isEmailExist = loginService.isEmailExist(email)

        isEmailExist.then(function(isEmailExist){
            console.log(isEmailExist)
            if(isEmailExist.success === true){
                var response = loginService.forgotPassword(email)

                response.then(function(response){
                   
                    $("#myModal").modal()
                })
            }
            else{        
                $scope.forgotPasswordForm.email.$setValidity("valid", false)  
                $scope.alert = true                          
            }
        })
   }
}])

app.factory('loginService',['$http', function($http){
    var service = {}
    service.isEmailExist = isEmailExist
    service.forgotPassword = forgotPassword
    return service

    function isEmailExist(email){
        return $http.post('/api/isEmailExist', {email:email}).then(handleSuccess,handleError)
    }

    function forgotPassword(email){
        return $http.post('/api/forgotPassword', {email:email}).then(handleSuccess,handleError)
    }

    function handleSuccess(res) {
        return res.data;
    }

    function handleError(error) {
        return function () {
            return {
                success: false,
                message: error
            };
        };
    }
}])