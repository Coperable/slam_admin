(function () {
    'use strict';

    angular.module('app.participants')
        .controller('participants-list', ['$scope', '$window', '$state', 'Participant', participantsList])
        .controller('participants-edit', ['$scope', '$window', '$location', 'Participant', participantsEdit])
        .controller('participants-view', ['$scope', '$window', 'Participant', '$location', '$state', '$stateParams', participantsView]);

    function participantsList($scope, $window, $state, Participant) {
        $scope.participants = [];

        Participant.query(function(data) {
            $scope.participants = data;
        });

        $scope.view = function(id) {
            console.log('view '+id);
            $state.go('participant-view', {
                participantId: id
            }); 
        };



    }

    function participantsEdit($scope, $window, $location, Participant) {
        $scope.participant = new Participant({});

        $scope.canSubmit = function() {
            return $scope.participant_form.$valid;
        };

        $scope.revert = function() {
            $scope.participant = new Participant({});
        };

        $scope.submitForm = function() {
            $scope.participant.$save(function() {
                console.log('guardado');
                $location.url('/slam/participants/list');
            }).catch(function(response) {
                console.log('error: '+response);
            });
 



        };
    }

    function participantsView($scope, $window, Participant, $location, $state, $stateParams) {
        $scope.participant = {};
        $scope.competitions = [];

        console.log('Participant view id: '+$stateParams.participantId);
        Participant.get({
            id: $stateParams.participantId
        }, function(data) {
            $scope.participant = data;
            $scope.competitions = $scope.participant.competitions;
        });


        $scope.createCompetition = function() {
            console.log('create competition');
            $state.go('competition-new', {
                participantId: $scope.participant.id
            }); 
        };

    }


})(); 






