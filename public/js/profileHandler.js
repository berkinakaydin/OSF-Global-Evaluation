var app = angular.module('profile', ['userFactory', 'index'])

app.controller('headerController', ['$scope', 'indexService', 'userService', function ($scope, indexService, userService) {
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
}])


app.directive('email', function () {

})

app.controller('profileController', ['$scope', '$timeout', 'userService', function ($scope, $timeout, userService) {

    $scope.update = function () {
        var user = {}
        user.name = $scope.name
        user.surname = $scope.surname
        user.email = $scope.email
        var token = localStorage.getItem('jwt')

        userService.Update(user, token).then(function (response) {
            if (response.success === true) {
                $scope.alert = true
                $timeout(function () {
                    $scope.alert = false
                    location.reload()
                }, 2000);

            } else {
                $scope.updateForm.email.$setValidity("unique", false)
            }
        });
    }

    $scope.uniqueEmailSet = function () {
        $scope.updateForm.email.$setValidity("unique", true)
    }
}])

app.controller('verifyController', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {

    $scope.$watch('verify', function () {
        console.log($scope.verify);
    });

    $scope.verifyEmail = function () {
        var token = localStorage.getItem('jwt')
        $http.post('/api/emailverify', {token: token }).then(function (response) {
            if (response.data.success === true) {
                $("#myModal").modal()
            } else {
                console.log('error')
            }
        })
    }
}])