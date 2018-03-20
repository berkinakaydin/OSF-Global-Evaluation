app = angular.module('index', ['header'])

/*app.controller('indexController', ['$scope',  '$http','indexService', function ($scope, $http, indexService) {
    var categories = indexService.getCategories
    
    categories.then(function (categories) {
        $scope.categories = categories
    })
}])*/


app.factory('indexService', ['$http','$location', function ($http,$location) {
    var service = {}
    service.getUser = getUser()

    return service

    function getUser(){
        var token = localStorage.getItem('jwt')
        return $http.post('/api/getUser', {'token': token}).then(function (response) {
            
            var user = response.data.user
            return user
        })
    }
}])
