app = angular.module('index', ['userFactory'])

app.controller('indexController', ['$scope', '$location', '$window', '$http', 'indexService', 'userService', function ($scope, $location, $window, $http, indexService, userService) {
    var objects = indexService.headerButtons()
    var categories = indexService.getCategories()

    objects.then(function (data) {
        $scope.objects = data
    });

    categories.then(function(categories){
        $scope.categories = categories
    })

    $scope.logout = function () {
        userService.Logout();
    }

    $scope.profile = function () {
        var token = $window.localStorage.getItem('jwt')
        $window.location.href = '/profile?token=' + token
    }
}])


app.service('indexService', ['$http','$location', '$window', function ($http,$location, $window) {
    var headerButtons = function () {
        var token = $window.localStorage.getItem('jwt')
        var objects = []
        return $http.post('/api/getUsername', {'token': token}).then(function (response) {
            if (response.data.success === true) {
                var username = response.data.username
                var profile = {
                    type: 'profile',
                    text: username
                }
                var logout = {
                    type: 'logout',
                    text: 'Log Out',
                }
                var basket = {
                    type: 'basket',
                    text: 'Basket '
                }
                var wishlist = {
                    type: 'wishlist',
                    text: 'Wish List'
                }
                objects.push(basket)
                objects.push(wishlist)
                objects.push(profile)
                objects.push(logout)
                return objects
            } else {
                var login = {
                    type: 'unAuth',
                    text: 'Log In',
                    url: '/login'
                }
                var register = {
                    type: 'unAuth',
                    text: 'Register',
                    url: '/register'
                }
                objects.push(login)
                objects.push(register)
                return objects
            }
        });
    }

    var getCategories = function () {
        var categories = []
        return $http.post('/api/getCategories').then(function (response) {
            for(var i=0; i<response.data.categories.length;i++){
                var category = {
                    text : response.data.categories[i].name,
                    url : response.data.categories[i].id
                }
                categories.push(category)
            }
            return categories
        })
            
    }

    /*var profile = function () {
        var token = $window.localStorage.getItem('jwt')
        return $http.post('/api/profile',  {'token': token}).then(function (response) {
            console.log(response.data)
            if(response.data.success === true){
                console.log('ok')
                //$window.location.href = "/profile";
            }else{
                console.log('no')
                //$window.location.href = "/login";
            }

        });
    }*/

    return {
        headerButtons: headerButtons,
        getCategories: getCategories
        //profile: profile
    }
}])