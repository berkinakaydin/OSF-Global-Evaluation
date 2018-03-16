app = angular.module('index', ['userFactory'])

app.controller('indexController', ['$scope', '$window', '$http', 'indexService','userService', function ($scope, $window, $http, indexService,userService) {
    var objects = indexService.getUsername()

    objects.then(function (data) {
        $scope.objects = data
    });

    $scope.logout = function () {
        userService.Logout();
    }
}])


app.service('indexService', ['$http', '$window',function ($http, $window) {
    var getUsername = function () {
        var token = $window.localStorage.getItem('jwt')
        var objects = []
        return $http.post('/api/getUsername', {
            'token': token
        }).then(function (response) {
            if (response.data.success === true) {
                var username = response.data.username
                var profile = {
                    text: username,
                    url: '/profilePage'
                }
                var logout = {
                    text: 'Log Out'
                }
                objects.push(profile)
                objects.push(logout)
                return objects
            } else {
                var login = {
                    text: 'Log In',
                    url: '/login'
                }
                var register = {
                    text: 'Register',
                    url: '/register'
                }
                objects.push(login)
                objects.push(register)
                return objects
            }
        });
    }

    return {
        getUsername: getUsername
    }
}])