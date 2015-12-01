(function () {
    'use strict';

    angular.module('app.users')
        .controller('users-list', ['$scope', '$window', '$state', 'User', usersList])
        .controller('users-edit', ['$scope', '$state', 'logger', 'User', usersEdit])
        .controller('users-view', ['$scope', '$window', 'User', '$location', '$state', '$stateParams', '$http', 'logger', 'Role', 'Region', 'Account', 'api_host', usersView]);

    function usersList($scope, $window, $state, User) {
        $scope.users = [];

        User.query(function(data) {
            $scope.users = data;
        });

        $scope.view = function(id) {
            console.log('view '+id);
            $state.go('user-view', {
                userId: id
            }); 
        };



    }

    function usersEdit($scope, $state, logger, User) {
        $scope.user = new User({});

        $scope.canSubmit = function() {
            return $scope.user_form.$valid;
        };

        $scope.revert = function() {
            $scope.user = new User({});
        };

        $scope.submitForm = function() {
            $scope.user.$save(function() {
                logger.logSuccess("Usuario creado"); 
                $state.go('user-view', {
                    userId: $scope.user.id
                }); 
            }).catch(function(response) {
                logger.logError("Error al crear usuario, verifique los datos"); 
            });
        };
    }

    function usersView($scope, $window, User, $location, $state, $stateParams, $http, logger, Role, Region, Account, api_host) {
        $scope.user = {};
        $scope.competitions = [];
        $scope.account = Account;
        $scope.roles = [];
        $scope.regions = [];
        $scope.isRoleCollapsed = true;
        $scope.isRegionCollapsed = true;
        $scope.change_password = false;

        $scope.changePassword = function() {
            $scope.change_password = true;
        };

        $scope.canSubmit = function() {
            return $scope.user_form.$valid;
        };

        User.get({
            id: $stateParams.userId
        }, function(data) {
            $scope.user = data;
            $scope.fetchRoles();
            $scope.fetchRegions();
        });

        $scope.submitForm = function() {
            if($scope.user.id == $scope.account.profile_id) {
                $http.put(api_host+'/api/me', $scope.user).success(function(data) {
                    logger.logSuccess("Tus datos actualizados"); 
                });

            } else {
                $scope.user.$update(function() {
                    logger.logSuccess("Usuario actualizado"); 
                }).catch(function(response) {
                    logger.logError("Error al actualizar usuario, verifique los datos"); 
                });
            }
        };


        $scope.fetchRoles = function() {
            Role.query(function(data) {
                $scope.roles = data;
                _.each($scope.user.roles, function(user_role) {
                    var role = _.find($scope.roles, function(item) {
                        return user_role.id == item.id;
                    });
                    role.assigned = true;
                });
            });
        };

        $scope.fetchRegions = function() {
            Region.query(function(data) {
                $scope.regions = data;
                _.each($scope.user.regions, function(user_region) {
                    var region = _.find($scope.regions, function(item) {
                        return user_region.id == item.id;
                    });
                    region.assigned = true;
                });
            });
        };




        $scope.saveRoles = function() {
            var rolesToAssign = _.filter($scope.roles, function(rol) {
                return rol.assigned;
            }); 
            $http.post(api_host+'/api/users/assign/roles', {
                userId: $scope.user.id,
                roles: rolesToAssign
            }).success(function(data) {
                logger.logSuccess("Roles asignados"); 
            });

        };

        $scope.saveRegions = function() {
            var regionsToAssign = _.filter($scope.regions, function(region) {
                return region.assigned;
            }); 
            $http.post(api_host+'/api/users/assign/regions', {
                userId: $scope.user.id,
                regions: regionsToAssign 
            }).success(function(data) {
                logger.logSuccess("Regiones asignadas"); 
            });

        };

        $scope.revertRoles = function() {
            $scope.fetchRoles();
        };

        $scope.revertRegions = function() {
            $scope.fetchRegions();
        };

    }


})(); 





