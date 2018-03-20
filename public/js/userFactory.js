var app = angular.module('userFactory', []);

app.factory('userService', ['$http', function ($http) {
    var service = {};
    service.GetByToken = GetByToken;
    service.Create = Create;
    service.Update = Update;
    service.Login = Login;
    service.Logout = Logout;

    return service;

    function GetByToken(token){
        return $http.post('/api/getUser/', {token:token}).then(handleSuccess, handleError('Error getting user by username'));
    }

    function Create(user) {
        return $http.post('/api/register', {
            'user': user
        }).then(true, handleError('Error creating user'));
    }

    function Login(user) {
        return $http.post('/api/login', {
            'user': user
        }).then(true, handleError('Error logging user'));
    }

    function Logout() {
        var token = localStorage.getItem('jwt')
        return $http.post('/api/logout', {
            'token': token
        }).then(function (response) {
            if (response.data.success === true) {
                localStorage.removeItem('jwt')
                location.href = "/";
            }
        });
    }

    function Update(user, token) {
        return $http.post('/api/updateUser/' ,{token:token, user:user}).then(handleSuccess, handleError('Error updating user'));
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

}]);