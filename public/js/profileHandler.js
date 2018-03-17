var app = angular.module('profile', ['userFactory', 'index'])

app.controller('headerController', ['$scope', 'indexService', 'userService', function ($scope, indexService, userService) {
    var objects = indexService.headerButtons()

    objects.then(function (data) {
        $scope.objects = data
    });
    $scope.logout = function () {
        userService.Logout();
    }
}])




app.controller('profileController', ['$scope', '$timeout', 'userService', function ($scope, $timeout, userService) {

    $scope.update = function () {
        var user = {}
        user.name = $scope.name
        user.surname = $scope.surname
        user.email = $scope.email
        var token = localStorage.getItem('jwt')

        userService.Update(user, token).then(function (response) {
            console.log(response)
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