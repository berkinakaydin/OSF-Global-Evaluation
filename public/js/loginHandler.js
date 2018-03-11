var app = angular.module('login', []);

app.controller('loginController', function ($scope) {

});


app.factory('AuthenticationService',['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',function (Base64, $http, $cookieStore, $rootScope, $timeout) {
    var service = {};
 
        service.Login = function (username, password, callback) {
  
            $http.post('/api/authenticate', { username: username, password: password })
               .success(function (response) {

                callback(response);
                },5000);
        };
        
        service.SetCredentials = function (username, password) {
            var authdata = Base64.encode(username + ':' + password);
  
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
  
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };


}]);