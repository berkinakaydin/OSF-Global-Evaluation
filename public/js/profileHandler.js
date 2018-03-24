var app = angular.module('profile', ['userFactory','header'])

app.controller('profileController', ['$scope', '$timeout', 'userService', function ($scope, $timeout, userService) {
    var token = localStorage.getItem('jwt')
    var response = userService.GetByToken(token)

    response.then(function(response){
        var user = response.user

        if(user.emailVerify){
            $scope.message = 'Your account is verified'
            $scope.verify = true
        }
        else{
            $scope.message = 'Please verify your account'
            $scope.verify = false
        }
        
        $scope.user = {
            name : user.name,
            surname : user.surname,
            email : user.email,
            username : user.username
        }


        var orderResponse = userService.GetUserOrders(token)

        orderResponse.then(function(orderResponse){
            var orders = orderResponse.orders
            var order_products = orders.products
            console.log(orders)
            $scope.orderHistory = order_products
            $scope.orders = orders
        })


    })
 
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
    $scope.verifyEmail = function () {
        var token = localStorage.getItem('jwt')
        $http.post('/api/emailVerify', {token: token }).then(function (response) {
            if (response.data.success === true) {
                $("#myModal").modal()
            } else {
                console.log('error')
            }
        })
    }
}])