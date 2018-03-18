app = angular.module('index', ['userFactory','product'])

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

    $scope.basket = function () {
        var token = $window.localStorage.getItem('jwt')
        $window.location.href = '/basket?token=' + token
    }

    $scope.wishlist = function () {
        var token = $window.localStorage.getItem('jwt')
        $window.location.href = '/wishlist?token=' + token
    }
}])


app.service('indexService', ['$http','$location', '$window', function ($http,$location, $window) {
    var headerButtons = function () {
        var token = $window.localStorage.getItem('jwt')
        var objects = []
        return $http.post('/api/headerInformation', {'token': token}).then(function (response) {
            if (response.data.success === true) {
                var username = response.data.username
                var basket = response.data.basket
                var wishlist = response.data.wishlist

                console.log(basket)
                console.log(wishlist)
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
                    text: 'Basket ',
                    count : basket.products.length
                }
                var wishlist = {
                    type: 'wishlist',
                    text: 'Wish List',
                    count : wishlist.products.length
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
                    url : response.data.categories[i].id,
                    description : response.data.categories[i].page_description,
                    image_url : response.data.categories[i].id + '.png'
                }              
                categories.push(category)
            }
            return categories
        })
    }

    var getUser = function(){
        var token = $window.localStorage.getItem('jwt')
        return $http.post('/api/getUser', {'token': token}).then(function (response) {
            
            var user = response.data.user
            return user
        })
    }

    return {
        headerButtons: headerButtons,
        getCategories: getCategories,
        getUser : getUser
    }
}])