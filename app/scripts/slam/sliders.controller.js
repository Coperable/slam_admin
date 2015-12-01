(function () {
'use strict';

angular.module('app.sliders')
.controller('slider-edit', ['$scope', '$window', '$location', '$state', '$stateParams', '$timeout', 'api_host', 'logger', 'Slider', function($scope, $window, $location, $state, $stateParams, $timeout, api_host, logger, Slider) {

    $scope.format = 'dd/MM/yyyy';
    $scope.events = [ ];

    $scope.today = function() {
        $scope.event_date = new Date();
    };

    $scope.clear = function () {
        $scope.event_date = null;
    };

    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };


    $scope.slider = {};

    if($stateParams.sliderId) {
        Slider.get({
            id: $stateParams.sliderId
        }, function(data) {
            $scope.slider = data;
            $scope.event_date = moment($scope.slider.event_date);
            $scope.setup_component();
        });

    } else {
        $scope.slider = new Slider({
            region_id: $stateParams.regionId
        });
        $timeout(function() {
            $scope.setup_component();
        }, 1000);

    }


    $scope.canSubmit = function() {
        return $scope.slider_form.$valid;
    };

    $scope.revert = function() {
        $scope.slider = new Slider({});
    };

    $scope.submitForm = function() {
        if($scope.slider.id) {
            $scope.slider.$update(function() {
                logger.logSuccess("El slider fue actualizado con éxito!"); 
                $state.go('slider-list'); 
            }).catch(function(response) {
                logger.logError(response.message); 
            });
        } else {
            $scope.slider.$save(function() {
                logger.logSuccess("El slider fue creado con éxito!"); 
                $state.go('slider-list'); 
            }).catch(function(response) {
                logger.logError(response.message); 
            });
        }


    };
    $scope.setup_component = function () {
        $scope.today();
        $('#slider_event_date').bootstrapMaterialDatePicker({  
            format : 'DD MM YYYY HH:mm',  
            minDate : new Date(), 
            currentDate: $scope.event_date,
            lang: 'es'  
        }).on('change', function(e, date) { 
            $scope.slider.event_date = date; 
        }); 

    };



    $scope.upload_url = api_host+"/api/media/slider/upload";
    $scope.uploading = false;

    $scope.onUpload = function(response) {
        $scope.uploading = true;
    };

    $scope.onError = function(response) {
        $scope.uploading = false;
        console.log('error');
    };

    $scope.onComplete = function(response) {
        $scope.uploading = false;
        $scope.slider.cover_photo = response.data.filename;
    };


}])
.controller('sliders-list', ['$scope', '$http', '$state', 'logger', 'api_host', 'Slider', function($scope, $http, $state, logger, api_host, Slider) {
   
    Slider.query(function(data) {
        $scope.sliders = data;
    });

    $scope.view = function(id) {
        console.log('view '+id);
        $state.go('slider-view', {
            sliderId: id
        }); 
    };

    $scope.remove = function(slider_data) {
        var slider = new Slider(slider_data);
        slider.$remove(function() {
            logger.logSuccess("El slider fue eliminado con éxito!"); 
            $state.go('slider-list', {}, {reload: true}); 
        }).catch(function(response) {
            logger.logError(response.message); 
        });


    };

    $scope.edit = function(id) {
        $state.go('slider-edit', {
            sliderId: id
        }); 
    };



}]);
})(); 





