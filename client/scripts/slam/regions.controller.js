(function () {
    'use strict';

    angular.module('app.regions')
        .controller('regions-list', ['$scope', '$window', '$state', 'Region', regionsList])
        .controller('regions-edit', ['$scope', '$stateParams', '$location', 'Region', regionsEdit])
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

    function regionsEdit($scope, $stateParams, $location, Region) {
        $scope.region = new Region({});

        $scope.canSubmit = function() {
            return $scope.region_form.$valid;
        };

        $scope.revert = function() {
            $scope.region = new Region({});
        };

        $scope.submitForm = function() {
            $scope.region.$save(function() {
                console.log('guardado');
                $location.url('/slam/regions/list');
            }).catch(function(response) {
                console.log('error: '+response);
            });
        };

        if($stateParams.regionId) {
            Region.get({
                id: $stateParams.regionId
            }, function(data) {
                $scope.region= data;
            });
        }



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




