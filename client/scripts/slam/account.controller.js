(function () {
'use strict';

angular.module('app.account')
.controller('loginController', ['$scope', '$window', '$auth', '$location', 'logger', 'Account', function($scope, $window, $auth, $location, logger, Account) {

    $scope.doLogin = function()  {
        $auth.login({ email: $scope.email, password: $scope.password })
        .then(function(response) {
            Account.getProfile(function(profile) {
                $scope.account = profile;
                $location.url('/');
                logger.log("Estás adentro!"); 
            });
        })
        .catch(function(response) {
            logger.logError("Hubo un inconveniente: ("+response+")"); 
            console.dir(response);
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {

        })
        .catch(function(response) {

        });
    };



}])
.controller('sidebar-controller', ['$scope', '$auth', '$state', 'logger', 'Account', function($scope, $auth, $state, logger, Account) {

    $scope.regions = [];
    $scope.roles = [];

    console.log('sidebar-controller');
    Account.getProfile(function(profile) {
        $scope.account = Account.profile;
        $scope.profile = profile;
        $scope.regions = profile.regions;
        $scope.roles = profile.roles;
    });

    $scope.viewRegion = function(id) {
        $state.go('region-view', {
            regionId: id
        }); 
    };


    $scope.hasRole = function(role_name) {
        return Account.hasRole(role_name);
    };

}])
.controller('session-bar-controller', ['$scope', '$location', 'Account', sessionBarController]);

function sessionBarController($scope, $location, Account) {

    $scope.profile = {};

    Account.getProfile(function(profile) {
        $scope.profile = profile;
    });

    $scope.logout = function() {
        console.log('do logout');
        Account.logout();
        $location.url('/');
    };

    /*
    $scope.login = function() {

    };


    $scope.signup = function() {
    };

    $scope.reset =  function() {
    };

    $scope.unlock =  function() {
        $location.url('/');
    };   
    */

}


})(); 





