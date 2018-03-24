var app = angular.module('category', ['header'])

app.controller('categoryController', ['$scope', 'categoryService', '$location', function ($scope, categoryService, $location) {
    var response = categoryService.GetCategories()
    response.then(function (response) {
        var categories = response.categories
        var url = $location.absUrl().split('/')
        var subset = url.slice(3, url.length)
        var category = searchInCategories(categories, 0, subset)
        
        $scope.categories = []
        console.log(category)
        for(var i=0;i<category.length;i++){
            
            var obj = {
                image : category[i].image,
                name : category[i].name,
                page_description : category[i].page_description,
                url: $location.absUrl() + '/' + category[i].id,
                image : (category[i].image)?'/images/' + category[i].image:'/images/categories/default.png',
            }
            $scope.categories.push(obj)
        }
        $scope.title = category.title
    })


    //RECURSIVE CATEGORY SEARCH
     function searchInCategories(categories, i, param) {
        if (i == param.length) {
            return categories
        }
        var category = categories
        var obj = category.find(o => o.id === param[i]);
        
        category = obj.categories
        category.title= obj.page_title
        i++
        return searchInCategories(category, i, param)
    }
}])

app.controller('productController', ['$scope', 'categoryService', '$location', function ($scope, categoryService, $location) {
    var url = $location.absUrl().split('/').pop()
    var response = categoryService.GetProducts(url)

    response.then(function(response){
        
        if(response.success == true){
            var products = response.products
            $scope.products = []
            for(var i=0; i<products.length;i++){
                var product = {
                    name : products[i].name,
                    image : '/images/' + products[i].image_groups[0].images[0].link,
                    url : $location.absUrl() + '/' +  products[i].id
                }
                $scope.products.push(product)
            }
            console.log(response)
            $scope.title = response.title
        }
    })
    
}])

app.factory('categoryService',['$http','$location', function ($http, $location) {
    var service = {};
    service.GetCategories = GetCategories;
    service.GetProducts = GetProducts;

    return service;

    function GetCategories() {
        return $http.post('/api/getCategories').then(handleSuccess,handleError('Error deleting user'));
    }

    function GetProducts(url){
        var categoryId = url
        return $http.post('/api/getCategory_Products', {categoryId : categoryId}).then(handleSuccess,handleError('Error deleting user'));
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
}])