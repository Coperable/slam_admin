(function () {
    'use strict';

    angular.module('app.regions')
        .controller('regions-list', ['$scope', '$window', '$state', 'Region', regionsList])
        .controller('regions-edit', ['$scope', '$state', '$stateParams', '$location', 'logger', 'Region', 'Color', 'Icon', regionsEdit])
        .controller('regions-view', ['$scope', '$window', 'Region', '$location', '$state', '$stateParams', regionsView]);

    function regionsList($scope, $window, $state, Region) {
        $scope.regions = [];

        Region.query(function(data) {
            $scope.regions = data;
        });

        $scope.view = function(id) {
            console.log('view '+id);
            $state.go('region-view', {
                regionId: id
            }); 
        };

        $scope.edit = function(id) {
            $state.go('region-edit', {
                regionId: id
            }); 
        };



    }

    function regionsEdit($scope, $state, $stateParams, $location, logger, Region, Color, Icon) {
        $scope.region = new Region({});

        if($stateParams.regionId) {
            Region.get({
                id: $stateParams.regionId
            }, function(data) {
                $scope.region = data;
            });
        } else {
            $scope.region = new Region({

            });
        }

        Color.query(function(data) {
            $scope.colors = data;
        });

        Icon.query(function(data) {
            $scope.icons = _.sortBy(_.filter(data, function(item) {
                return item.is_region;
            }),
            function(icon) {
                return icon.code; 
            });
        });

        $scope.canSubmit = function() {
            return $scope.region_form.$valid;
        };

        $scope.revert = function() {
            if($scope.region.id) {
                $state.go('region-view', {
                    regionId: $scope.region.id
                }); 
            } else {
                $location.url('/slam/regions/list');
            }
        };

        $scope.submitForm = function() {
            if($scope.region.id) {
                $scope.region.$update(function() {
                    logger.logSuccess("El centro fue actualizado con éxito!"); 
                    $state.go('region-view', {
                        regionId: $scope.region.id
                    }); 
                }).catch(function(response) {
                    logger.logError(response.message); 
                });
            } else {
                $scope.region.$save(function() {
                    logger.logSuccess("El centro fue creado con éxito!"); 
                    $state.go('region-view', {
                        regionId: $scope.region.id
                    }); 
                }).catch(function(response) {
                    logger.logError(response.message); 
                });
            }
        };


    }

    function regionsView($scope, $window, Region, $location, $state, $stateParams) {
        $scope.region = {};
        $scope.competitions = [];

        console.log('Region view id: '+$stateParams.regionId);
        Region.get({
            id: $stateParams.regionId
        }, function(data) {
            $scope.region = data;
            $scope.competitions = $scope.region.competitions;
        });


        $scope.createCompetition = function() {
            console.log('create competition');
            $state.go('competition-new', {
                regionId: $scope.region.id
            }); 
        };

        $scope.edit = function(id) {
            $state.go('region-edit', {
                regionId: id
            }); 
        };

    }


})(); 




