app = angular.module('header', ['userFactory'])

app.controller('urlController', ['$scope', '$location', function ($scope, $location) {
    var parsedURL = $location.absUrl().split('/');
    var urls = []
    urls.push({
        url: '',
        text: 'Home'
    })
    for (var i = 3; i < parsedURL.length - 1; i++) {
        var categoryText = parsedURL[i].split('-').pop()
        categoryText = categoryText.replace(/\b\w/g, function (l) {
            return l.toUpperCase()
        })
        var path = ""

        for (var j = urls.length - 1; j >= 0; j--) {
            if (i > 2 && j > 0) {
                path += parsedURL[i - j] + '/'
            } else {
                path += parsedURL[i - j]
            }
        }

        var url = {
            url: path,
            text: categoryText
        }
        urls.push(url)
    }
    $scope.urls = urls
}])


app.controller('headerController', ['$scope', 'userService', 'headerService', function ($scope, userService, headerService) {
    var headerButtons = headerService.getHeaderButtons()

    var categories = headerService.getCategories()

    categories.then(function (categories) {
        $scope.categories = categories
    })

    headerButtons.then(function (navbarObjects) {
        $scope.navbarObjects = navbarObjects
    });

    $scope.logout = function () {
        userService.Logout();
    }

    $scope.profile = function () {
        var token = localStorage.getItem('jwt')
        location.href = '/profile?token=' + token
    }

    $scope.basket = function () {
        var token = localStorage.getItem('jwt')
        location.href = '/basket?token=' + token
    }

    $scope.wishlist = function () {
        var token = localStorage.getItem('jwt')
        location.href = '/wishlist?token=' + token
    }

    $scope.search = function () {
        var search = angular.element('#search').val();
        location.href = "/search?q=" + search
    }
}])

app.controller('searchController', ['$scope', '$location', 'headerService', function ($scope, $location, headerService) {
    var search = $location.absUrl().split('/').pop().split('=').pop()
    var response = headerService.search(search)

    $scope.results = []
    response.then(function (response) {
        for (var i = 0; i < response.result.length; i++) {
            var result = {
                name: response.result[i].name,
                price: response.result[i].price,
                image: '/images/' + response.result[i].image_groups[0].images[0].link,
                currency: response.result[i].currency,
                category: response.result[i].primary_category_id,
                id: response.result[i].id
            }
            $scope.results.push(result)
        }
    })
}])

app.factory('headerService', ['$http', function ($http) {
    var service = {}
    service.getHeaderButtons = getHeaderButtons
    service.getCategories = getCategories
    service.search = search

    return service

    function getHeaderButtons() {
        var token = localStorage.getItem('jwt')
        var objects = []

        return $http.post('/api/headerInformation', {
            'token': token
        }).then(function (response) {
            if (response.data.success === true) {
                var username = response.data.username
                var basket = response.data.basket
                var wishlist = response.data.wishlist

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
                    count: (basket == null) ? 0 : basket.products.length
                }
                var wishlist = {
                    type: 'wishlist',
                    text: 'Wish List',
                    count: (wishlist == null) ? 0 : wishlist.products.length
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

    function getCategories() {
        var categories = []
        return $http.post('/api/getCategories').then(function (response) {
            for (var i = 0; i < response.data.categories.length; i++) {
                var category = {
                    text: response.data.categories[i].name,
                    url: response.data.categories[i].id,
                    description: response.data.categories[i].page_description,
                    image_url: response.data.categories[i].id + '.png'
                }
                categories.push(category)
            }
            return categories
        })
    }

    function search(search) {
        return $http.post('/api/search', {
            'search': search
        }).then(function (response) {
            return response.data
        })
    }
}])